import { useRef, useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface ClickedLocation {
  lat: number;
  lng: number;
  name: string;
  isInIndia: boolean;
  position: THREE.Vector3;
}

interface GlobeMapSectionProps {
  onLocationClick?: (name: string, isInIndia: boolean) => void;
}

// --- Indian cities for nearest-match ---
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
  { name: "Darjeeling", lat: 27.0410, lng: 88.2663 },
  { name: "Leh", lat: 34.1526, lng: 77.5771 },
  { name: "Mysore", lat: 12.2958, lng: 76.6394 },
  { name: "Coorg", lat: 12.3375, lng: 75.8069 },
  { name: "Ooty", lat: 11.4102, lng: 76.6950 },
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
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (e.point) {
        // Transform the intersection point from world space to the mesh's local space
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
      gl_FragColor = vec4(0.25, 0.55, 1.0, 1.0) * intensity * 0.8;
    }
  `;
  const innerFragment = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.8);
      gl_FragColor = vec4(0.4, 0.75, 1.0, 1.0) * intensity * 0.4;
    }
  `;

  return (
    <>
      <mesh scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={outerFragment}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
      <mesh scale={[1.08, 1.08, 1.08]}>
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

// --- Ripple Marker (placed on click) ---
function RippleMarker({ location }: { location: ClickedLocation }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const baseColor = location.isInIndia ? "#E67514" : "#ef4444";

  useFrame(() => {
    const t = Date.now() * 0.003;

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      coreRef.current.scale.setScalar(pulse);
    }

    // Staggered ripple rings
    [ring1Ref, ring2Ref, ring3Ref].forEach((ref, i) => {
      if (ref.current) {
        const offset = i * 0.7;
        const phase = ((t + offset) % 2) / 2; // 0 to 1
        const scale = 1 + phase * 2.5;
        ref.current.scale.setScalar(scale);
        (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 * (1 - phase));
      }
    });
  });

  // Orient marker to face outward from globe center
  const normal = location.position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normal
  );

  return (
    <group ref={groupRef} position={location.position} quaternion={quaternion}>
      {/* Core glowing dot */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* White highlight */}
      <mesh position={[0, 0.015, 0]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>

      {/* Ripple rings */}
      {[ring1Ref, ring2Ref, ring3Ref].map((ref, i) => (
        <mesh key={i} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.055, 32]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Label */}
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

// --- Camera Controller ---
function CameraController({
  targetLatLng,
  onDistanceChange,
  onInteracting,
}: {
  targetLatLng: { lat: number; lng: number } | null;
  onDistanceChange: (d: number) => void;
  onInteracting: (interacting: boolean) => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef(new THREE.Vector3());
  const animProgress = useRef(0);
  const isAnimating = useRef(false);
  const interactingTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!targetLatLng) return;

    const { phi, theta } = latLngToSpherical(targetLatLng.lat, targetLatLng.lng);
    const dist = 3.2;
    targetPos.current.set(
      -(dist * Math.sin(phi) * Math.cos(theta)),
      dist * Math.cos(phi),
      dist * Math.sin(phi) * Math.sin(theta)
    );
    isAnimating.current = true;
    animProgress.current = 0;
    onInteracting(true);
  }, [targetLatLng]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    const dist = camera.position.length();
    onDistanceChange(dist);

    if (isAnimating.current) {
      animProgress.current += delta * 0.6;
      const t = Math.min(animProgress.current, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerp(targetPos.current, eased * 0.06);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      controlsRef.current.update();

      if (t >= 1) {
        isAnimating.current = false;
        setTimeout(() => onInteracting(false), 500);
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
}: {
  onLocationClick?: (name: string, isInIndia: boolean) => void;
}) {
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [cameraDistance, setCameraDistance] = useState(5);
  const [isInteracting, setIsInteracting] = useState(false);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);

  const handleGlobeClick = useCallback(
    (point: THREE.Vector3) => {
      const { lat, lng } = vector3ToLatLng(point, 2);
      const inIndia = isInIndia(lat, lng);
      const name = inIndia ? findNearestCity(lat, lng) : "Outside India";
      const position = latLngToVector3(lat, lng, 2.03);

      const location: ClickedLocation = { lat, lng, name, isInIndia: inIndia, position };
      setClickedLocation(location);
      onLocationClick?.(name, inIndia);

      if (inIndia) {
        setFlyTarget({ lat, lng });
      }
    },
    [onLocationClick]
  );

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#fffaf0" />
      <directionalLight position={[-3, 2, -4]} intensity={0.8} color="#87CEEB" />
      <hemisphereLight args={["#87CEEB", "#e8dcc4", 0.6]} />

      <Suspense fallback={null}>
        <Earth
          autoRotate={!isInteracting && !clickedLocation}
          onGlobeClick={handleGlobeClick}
        />
      </Suspense>
      <Atmosphere />

      {clickedLocation && <RippleMarker location={clickedLocation} />}

      <CameraController
        targetLatLng={flyTarget}
        onDistanceChange={setCameraDistance}
        onInteracting={setIsInteracting}
      />
    </>
  );
}

// --- Main Component ---
const GlobeMapSection = ({ onLocationClick }: GlobeMapSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden"
      style={{
        height: "600px",
        borderRadius: "50% / 28%",
        background:
          "radial-gradient(ellipse at 50% 40%, hsl(205 60% 85%) 0%, hsl(210 50% 72%) 50%, hsl(215 40% 60%) 100%)",
        boxShadow: [
          "0 0 80px 20px hsl(210 40% 70% / 0.3)",
          "0 20px 60px -10px hsl(210 30% 50% / 0.3)",
          "inset 0 0 100px 30px hsl(210 50% 90% / 0.2)",
        ].join(", "),
        border: "1px solid hsl(210 30% 80% / 0.6)",
      }}
    >
      {/* Glassmorphism rim */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          borderRadius: "50% / 28%",
          background:
            "linear-gradient(160deg, hsl(210 60% 95% / 0.3) 0%, transparent 40%, transparent 60%, hsl(210 60% 95% / 0.1) 100%)",
          border: "1px solid hsl(210 40% 85% / 0.2)",
        }}
      />

      {/* Top highlight */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(210 60% 95% / 0.6) 50%, transparent 100%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={{ borderRadius: "50% / 28%" }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <GlobeScene onLocationClick={onLocationClick} />
      </Canvas>

      {/* Vignettes */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, hsl(210 40% 65% / 0.7) 0%, transparent 100%)",
          borderRadius: "0 0 50% 50% / 0 0 28% 28%",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, hsl(205 50% 80% / 0.4) 0%, transparent 100%)",
          borderRadius: "50% 50% 0 0 / 28% 28% 0 0",
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, hsl(210 40% 65% / 0.5) 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, hsl(210 40% 65% / 0.5) 0%, transparent 100%)" }}
      />
    </motion.div>
  );
};

export default GlobeMapSection;
