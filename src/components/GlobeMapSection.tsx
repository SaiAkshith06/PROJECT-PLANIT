import { useRef, useState, useCallback, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// --- Types ---
interface ClickedLocation {
  lat: number;
  lng: number;
  name: string;
  isInIndia: boolean;
  position: THREE.Vector3;
}

interface GlobeMapSectionProps {
  onLocationClick?: (name: string, isInIndia: boolean, lat: number, lng: number) => void;
  onZoomComplete?: (name: string, lat: number, lng: number) => void;
}

// --- Indian cities ---
const indianCities = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Goa", lat: 15.2993, lng: 74.124 },
  { name: "Kerala", lat: 10.8505, lng: 76.2711 },
  { name: "Manali", lat: 32.2396, lng: 77.1887 },
  { name: "Agra", lat: 27.1767, lng: 78.0081 },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { name: "Shimla", lat: 31.1048, lng: 77.1734 },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676 },
  { name: "Amritsar", lat: 31.634, lng: 74.8723 },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { name: "Darjeeling", lat: 27.041, lng: 88.2663 },
  { name: "Leh", lat: 34.1526, lng: 77.5771 },
  { name: "Mysore", lat: 12.2958, lng: 76.6394 },
  { name: "Coorg", lat: 12.3375, lng: 75.8069 },
  { name: "Ooty", lat: 11.4102, lng: 76.695 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Jaisalmer", lat: 26.9157, lng: 70.9083 },
  { name: "Gangtok", lat: 27.3389, lng: 88.6065 },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
];

// --- Helpers ---
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function vector3ToLatLng(point: THREE.Vector3, radius: number): { lat: number; lng: number } {
  const normalized = point.clone().normalize().multiplyScalar(radius);
  const lat = 90 - Math.acos(normalized.y / radius) * (180 / Math.PI);
  const lng = -(Math.atan2(normalized.z, -normalized.x) * (180 / Math.PI)) - 180;
  return { lat, lng: ((lng % 360) + 540) % 360 - 180 };
}

function isInIndia(lat: number, lng: number): boolean {
  return lat >= 6.5 && lat <= 35.5 && lng >= 68.0 && lng <= 97.5;
}

function findNearestCity(lat: number, lng: number): string {
  let nearest = indianCities[0];
  let minDist = Infinity;
  for (const city of indianCities) {
    const d = Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2);
    if (d < minDist) {
      minDist = d;
      nearest = city;
    }
  }
  return nearest.name;
}

function latLngToSpherical(lat: number, lng: number): { phi: number; theta: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return { phi, theta };
}

// --- Globe Earth ---
function Earth({
  autoRotate,
  onGlobeClick,
}: {
  autoRotate: boolean;
  onGlobeClick: (point: THREE.Vector3) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg");
  const bumpMap = useTexture("https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png");

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.04;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (e.point) {
        const localPoint = meshRef.current
          ? meshRef.current.worldToLocal(e.point.clone())
          : e.point;
        onGlobeClick(localPoint);
      }
    },
    [onGlobeClick]
  );

  return (
    <mesh ref={meshRef} onClick={handleClick}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhysicalMaterial
        map={texture}
        bumpMap={bumpMap}
        bumpScale={0.04}
        metalness={0.05}
        roughness={0.6}
        clearcoat={0.3}
        clearcoatRoughness={0.4}
      />
    </mesh>
  );
}

// --- Atmosphere glow ---
function Atmosphere() {
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const outerFragment = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
      gl_FragColor = vec4(0.25, 0.55, 1.0, 1.0) * intensity * 0.7;
    }
  `;
  const innerFragment = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.8);
      gl_FragColor = vec4(0.4, 0.75, 1.0, 1.0) * intensity * 0.35;
    }
  `;

  return (
    <>
      <mesh scale={[1.16, 1.16, 1.16]}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={outerFragment}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
      <mesh scale={[1.07, 1.07, 1.07]}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={innerFragment}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
    </>
  );
}

// --- Ripple Marker ---
function RippleMarker({ location }: { location: ClickedLocation }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const baseColor = location.isInIndia ? "#E67514" : "#ef4444";

  useFrame(() => {
    const t = Date.now() * 0.003;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
    }
    [ring1Ref, ring2Ref, ring3Ref].forEach((ref, i) => {
      if (ref.current) {
        const phase = (((t + i * 0.7) % 2) / 2);
        ref.current.scale.setScalar(1 + phase * 2.5);
        (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 * (1 - phase));
      }
    });
  });

  const normal = location.position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  return (
    <group position={location.position} quaternion={quaternion}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
      {[ring1Ref, ring2Ref, ring3Ref].map((ref, i) => (
        <mesh key={i} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.055, 32]} />
          <meshBasicMaterial color={baseColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Html position={[0, 0.12, 0]} center distanceFactor={3} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: location.isInIndia
              ? "linear-gradient(135deg, hsl(27 90% 49%), hsl(27 85% 38%))"
              : "linear-gradient(135deg, hsl(0 70% 50%), hsl(0 60% 40%))",
            color: "white",
            padding: "5px 12px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "'Alfa Slab One', serif",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          {location.name}
        </div>
      </Html>
    </group>
  );
}

// --- Camera Controller with zoom-complete callback ---
function CameraController({
  targetLatLng,
  onDistanceChange,
  onInteracting,
  onZoomComplete,
}: {
  targetLatLng: { lat: number; lng: number } | null;
  onDistanceChange: (d: number) => void;
  onInteracting: (interacting: boolean) => void;
  onZoomComplete?: () => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef(new THREE.Vector3());
  const animProgress = useRef(0);
  const isAnimating = useRef(false);
  const interactingTimeout = useRef<number | null>(null);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (!targetLatLng) return;
    const { phi, theta } = latLngToSpherical(targetLatLng.lat, targetLatLng.lng);
    const dist = 3.0;
    targetPos.current.set(
      -(dist * Math.sin(phi) * Math.cos(theta)),
      dist * Math.cos(phi),
      dist * Math.sin(phi) * Math.sin(theta)
    );
    isAnimating.current = true;
    hasCalledComplete.current = false;
    animProgress.current = 0;
    onInteracting(true);
  }, [targetLatLng]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    onDistanceChange(camera.position.length());

    if (isAnimating.current) {
      animProgress.current += delta * 0.5;
      const t = Math.min(animProgress.current, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerp(targetPos.current, eased * 0.07);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      controlsRef.current.update();

      if (t >= 1) {
        isAnimating.current = false;
        setTimeout(() => onInteracting(false), 400);
        if (!hasCalledComplete.current && onZoomComplete) {
          hasCalledComplete.current = true;
          setTimeout(() => onZoomComplete(), 800);
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={2.8}
      maxDistance={8}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.4}
      zoomSpeed={0.5}
      target={[0, 0, 0]}
      onStart={() => {
        onInteracting(true);
        if (interactingTimeout.current) clearTimeout(interactingTimeout.current);
      }}
      onEnd={() => {
        interactingTimeout.current = window.setTimeout(() => onInteracting(false), 2000);
      }}
    />
  );
}

// --- Scene ---
function GlobeScene({
  onLocationClick,
  onZoomComplete,
}: {
  onLocationClick?: (name: string, isInIndia: boolean, lat: number, lng: number) => void;
  onZoomComplete?: (name: string, lat: number, lng: number) => void;
}) {
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [, setCameraDistance] = useState(5);
  const [isInteracting, setIsInteracting] = useState(false);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const pendingRef = useRef<{ name: string; lat: number; lng: number } | null>(null);

  const handleGlobeClick = useCallback(
    (point: THREE.Vector3) => {
      const { lat, lng } = vector3ToLatLng(point, 2);
      const inIndia = isInIndia(lat, lng);
      const name = inIndia ? findNearestCity(lat, lng) : "Outside India";
      const position = latLngToVector3(lat, lng, 2.03);
      setClickedLocation({ lat, lng, name, isInIndia: inIndia, position });
      onLocationClick?.(name, inIndia, lat, lng);
      if (inIndia) {
        pendingRef.current = { name, lat, lng };
        setFlyTarget({ lat, lng });
      }
    },
    [onLocationClick]
  );

  const handleZoomComplete = useCallback(() => {
    if (pendingRef.current && onZoomComplete) {
      onZoomComplete(pendingRef.current.name, pendingRef.current.lat, pendingRef.current.lng);
    }
  }, [onZoomComplete]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#fffaf0" />
      <directionalLight position={[-3, 2, -4]} intensity={0.8} color="#87CEEB" />
      <hemisphereLight args={["#87CEEB", "#e8dcc4", 0.6]} />
      <Suspense fallback={null}>
        <Earth autoRotate={!isInteracting && !clickedLocation} onGlobeClick={handleGlobeClick} />
      </Suspense>
      <Atmosphere />
      {clickedLocation && <RippleMarker location={clickedLocation} />}
      <CameraController
        targetLatLng={flyTarget}
        onDistanceChange={setCameraDistance}
        onInteracting={setIsInteracting}
        onZoomComplete={handleZoomComplete}
      />
    </>
  );
}

// --- Main Component ---
const GlobeMapSection = ({ onLocationClick, onZoomComplete }: GlobeMapSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden mx-auto"
      style={{
        maxWidth: "720px",
        height: "560px",
        borderRadius: "2rem",
        background:
          "radial-gradient(ellipse at 50% 40%, hsl(210 45% 12%) 0%, hsl(215 50% 8%) 60%, hsl(220 55% 5%) 100%)",
        boxShadow: [
          "0 0 100px 30px hsl(210 60% 40% / 0.12)",
          "0 25px 60px -12px hsl(0 0% 0% / 0.4)",
          "inset 0 0 80px 20px hsl(210 50% 15% / 0.15)",
          "0 0 0 1px hsl(210 30% 25% / 0.3)",
        ].join(", "),
      }}
    >
      {/* Glass rim highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          borderRadius: "2rem",
          background:
            "linear-gradient(160deg, hsl(210 60% 80% / 0.08) 0%, transparent 35%, transparent 65%, hsl(210 60% 80% / 0.04) 100%)",
          border: "1px solid hsl(210 30% 40% / 0.15)",
        }}
      />

      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-px pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(210 50% 70% / 0.3) 50%, transparent 100%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={{ borderRadius: "2rem" }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <GlobeScene onLocationClick={onLocationClick} onZoomComplete={onZoomComplete} />
      </Canvas>

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, hsl(220 50% 5% / 0.6) 0%, transparent 100%)",
          borderRadius: "0 0 2rem 2rem",
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute top-0 left-0 right-0 h-14 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, hsl(210 45% 10% / 0.3) 0%, transparent 100%)",
          borderRadius: "2rem 2rem 0 0",
        }}
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-y-0 left-0 w-12 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, hsl(220 50% 5% / 0.4) 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-12 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, hsl(220 50% 5% / 0.4) 0%, transparent 100%)" }}
      />
    </motion.div>
  );
};

export default GlobeMapSection;
