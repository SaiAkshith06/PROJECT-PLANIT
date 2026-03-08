import { useRef, useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Destination {
  name: string;
  description: string;
  lat: number;
  lng: number;
  sights?: { name: string; lat: number; lng: number }[];
}

interface GlobeMapSectionProps {
  onLocationClick?: (name: string) => void;
}

// --- Data ---
const destinations: Destination[] = [
  {
    name: "Goa",
    description: "Beach paradise with vibrant nightlife.",
    lat: 15.2993,
    lng: 74.124,
    sights: [
      { name: "Baga Beach", lat: 15.5554, lng: 73.7514 },
      { name: "Fort Aguada", lat: 15.4923, lng: 73.7736 },
      { name: "Basilica of Bom Jesus", lat: 15.5009, lng: 73.9116 },
    ],
  },
  {
    name: "Manali",
    description: "Mountain town for adventure lovers.",
    lat: 32.2396,
    lng: 77.1887,
    sights: [
      { name: "Solang Valley", lat: 32.3167, lng: 77.1567 },
      { name: "Rohtang Pass", lat: 32.3722, lng: 77.2478 },
      { name: "Hadimba Temple", lat: 32.2427, lng: 77.1695 },
    ],
  },
  {
    name: "Kerala",
    description: "God's Own Country — backwaters & spice gardens.",
    lat: 10.8505,
    lng: 76.2711,
    sights: [
      { name: "Alleppey Backwaters", lat: 9.4981, lng: 76.3388 },
      { name: "Munnar Tea Gardens", lat: 10.0889, lng: 77.0595 },
      { name: "Fort Kochi", lat: 9.9658, lng: 76.2421 },
    ],
  },
  {
    name: "Delhi",
    description: "Capital city rich in Mughal heritage.",
    lat: 28.6139,
    lng: 77.209,
    sights: [
      { name: "Red Fort", lat: 28.6562, lng: 77.241 },
      { name: "Qutub Minar", lat: 28.5245, lng: 77.1855 },
      { name: "India Gate", lat: 28.6129, lng: 77.2295 },
    ],
  },
  {
    name: "Mumbai",
    description: "City of dreams and Bollywood.",
    lat: 19.076,
    lng: 72.8777,
    sights: [
      { name: "Gateway of India", lat: 18.9219, lng: 72.8347 },
      { name: "Marine Drive", lat: 18.9432, lng: 72.8235 },
      { name: "Elephanta Caves", lat: 18.9633, lng: 72.9315 },
    ],
  },
  {
    name: "Agra",
    description: "Home of the iconic Taj Mahal.",
    lat: 27.1767,
    lng: 78.0081,
    sights: [
      { name: "Taj Mahal", lat: 27.1751, lng: 78.0421 },
      { name: "Agra Fort", lat: 27.1795, lng: 78.0211 },
      { name: "Fatehpur Sikri", lat: 27.0945, lng: 77.661 },
    ],
  },
  {
    name: "Jaipur",
    description: "The Pink City of royal palaces.",
    lat: 26.9124,
    lng: 75.7873,
    sights: [
      { name: "Hawa Mahal", lat: 26.9239, lng: 75.8267 },
      { name: "Amber Fort", lat: 26.9855, lng: 75.8513 },
      { name: "City Palace", lat: 26.9258, lng: 75.8237 },
    ],
  },
  {
    name: "Bali",
    description: "Island of the Gods — temples & rice terraces.",
    lat: -8.3405,
    lng: 115.092,
    sights: [
      { name: "Uluwatu Temple", lat: -8.8291, lng: 115.0849 },
      { name: "Tegallalang Rice Terrace", lat: -8.4312, lng: 115.2793 },
      { name: "Tanah Lot", lat: -8.6213, lng: 115.0868 },
    ],
  },
  {
    name: "Paris",
    description: "The City of Light — art, fashion & romance.",
    lat: 48.8566,
    lng: 2.3522,
    sights: [
      { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945 },
      { name: "Louvre Museum", lat: 48.8606, lng: 2.3376 },
      { name: "Notre-Dame", lat: 48.853, lng: 2.3499 },
    ],
  },
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

function latLngToSpherical(lat: number, lng: number): { phi: number; theta: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return { phi, theta };
}

// --- Globe Earth with slow auto-rotate ---
function Earth({ autoRotate }: { autoRotate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg");
  const bumpMap = useTexture("https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png");

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
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

// --- Atmosphere glow (multi-layer) ---
function Atmosphere() {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
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

// --- Glowing Marker Pin ---
function MarkerPin({
  dest,
  isSelected,
  onClick,
  cameraDistance,
}: {
  dest: Destination;
  isSelected: boolean;
  onClick: () => void;
  cameraDistance: number;
}) {
  const position = useMemo(
    () => latLngToVector3(dest.lat, dest.lng, 2.02),
    [dest.lat, dest.lng]
  );

  const markerRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const outerPulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulse + glow animation
  useFrame(() => {
    if (!markerRef.current) return;
    const t = Date.now() * 0.004;
    const pulse = 1 + Math.sin(t) * 0.12;

    if (isSelected) {
      markerRef.current.scale.setScalar(pulse * 1.15);
    } else if (hovered) {
      markerRef.current.scale.setScalar(1.4);
    } else {
      markerRef.current.scale.setScalar(1);
    }

    // Outer pulse ring
    if (pulseRef.current) {
      const ringScale = 1 + Math.sin(t * 1.2) * 0.3;
      pulseRef.current.scale.setScalar(ringScale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 - Math.sin(t * 1.2) * 0.25;
    }

    if (outerPulseRef.current) {
      const outerScale = 1.2 + Math.sin(t * 0.8) * 0.5;
      outerPulseRef.current.scale.setScalar(outerScale);
      (outerPulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 - Math.sin(t * 0.8) * 0.1;
    }
  });

  const showLabel = cameraDistance < 6;
  const showSights = isSelected && cameraDistance < 4;
  const baseColor = isSelected ? "#E67514" : "#06923E";

  return (
    <group ref={markerRef} position={position}>
      {/* Outer glow pulse */}
      <mesh ref={outerPulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.1, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner pulse ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.065, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core glowing pin */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1.0 : 0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Pin highlight */}
      <mesh position={[0, 0.01, 0]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="white" transparent opacity={0.7} />
      </mesh>

      {/* Tooltip / Label */}
      {(showLabel || hovered) && (
        <Html
          position={[0, 0.1, 0]}
          center
          distanceFactor={3}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: isSelected
                ? "linear-gradient(135deg, hsl(27 90% 49%), hsl(27 85% 38%))"
                : hovered
                ? "linear-gradient(135deg, hsl(153 90% 30%), hsl(153 80% 22%))"
                : "hsl(0 0% 10% / 0.88)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "'Alfa Slab One', serif",
              whiteSpace: "nowrap",
              boxShadow: isSelected
                ? "0 4px 20px hsl(27 90% 49% / 0.5), 0 0 10px hsl(27 90% 49% / 0.3)"
                : "0 4px 16px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              transform: "translateY(-8px)",
              transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {dest.name}
            {hovered && !isSelected && (
              <span style={{ opacity: 0.6, fontSize: "9px", marginLeft: 6 }}>
                Click to explore
              </span>
            )}
          </div>
        </Html>
      )}

      {/* Sightseeing markers */}
      {showSights &&
        dest.sights?.map((sight) => (
          <SightMarker key={sight.name} sight={sight} />
        ))}
    </group>
  );
}

// --- Sight Marker ---
function SightMarker({ sight }: { sight: { name: string; lat: number; lng: number } }) {
  const position = useMemo(
    () => latLngToVector3(sight.lat, sight.lng, 2.035),
    [sight.lat, sight.lng]
  );
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (pulseRef.current) {
      const t = Date.now() * 0.005;
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 + Math.sin(t) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.01, 12, 12]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
      <Html position={[0, 0.045, 0]} center distanceFactor={2.5} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "linear-gradient(135deg, hsl(220 80% 50% / 0.92), hsl(220 70% 40% / 0.92))",
            color: "white",
            padding: "3px 8px",
            borderRadius: "6px",
            fontSize: "9px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 10px rgba(59,130,246,0.4)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          {sight.name}
        </div>
      </Html>
    </group>
  );
}

// --- Camera Controller with cinematic fly-in ---
function CameraController({
  targetDest,
  onDistanceChange,
  onInteracting,
}: {
  targetDest: Destination | null;
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
    if (!targetDest) return;

    const { phi, theta } = latLngToSpherical(targetDest.lat, targetDest.lng);
    const dist = 3.2;
    targetPos.current.set(
      -(dist * Math.sin(phi) * Math.cos(theta)),
      dist * Math.cos(phi),
      dist * Math.sin(phi) * Math.sin(theta)
    );
    isAnimating.current = true;
    animProgress.current = 0;
    onInteracting(true);
  }, [targetDest]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const dist = camera.position.length();
    onDistanceChange(dist);

    if (isAnimating.current) {
      animProgress.current += delta * 0.6;
      const t = Math.min(animProgress.current, 1);
      // Smooth ease-in-out for cinematic feel
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
function GlobeScene({ onLocationClick }: { onLocationClick?: (name: string) => void }) {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [cameraDistance, setCameraDistance] = useState(5);
  const [isInteracting, setIsInteracting] = useState(false);

  const handleDestClick = useCallback(
    (dest: Destination) => {
      setSelectedDest(dest);
      onLocationClick?.(dest.name);
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
        <Earth autoRotate={!isInteracting && !selectedDest} />
      </Suspense>
      <Atmosphere />

      {destinations.map((dest) => (
        <MarkerPin
          key={dest.name}
          dest={dest}
          isSelected={selectedDest?.name === dest.name}
          onClick={() => handleDestClick(dest)}
          cameraDistance={cameraDistance}
        />
      ))}

      <CameraController
        targetDest={selectedDest}
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
        background: "radial-gradient(ellipse at 50% 40%, hsl(205 60% 85%) 0%, hsl(210 50% 72%) 50%, hsl(215 40% 60%) 100%)",
        boxShadow: [
          "0 0 80px 20px hsl(210 40% 70% / 0.3)",
          "0 20px 60px -10px hsl(210 30% 50% / 0.3)",
          "inset 0 0 100px 30px hsl(210 50% 90% / 0.2)",
        ].join(", "),
        border: "1px solid hsl(210 30% 80% / 0.6)",
      }}
    >
      {/* Glassmorphism rim highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          borderRadius: "50% / 28%",
          background: "linear-gradient(160deg, hsl(210 60% 95% / 0.3) 0%, transparent 40%, transparent 60%, hsl(210 60% 95% / 0.1) 100%)",
          border: "1px solid hsl(210 40% 85% / 0.2)",
        }}
      />

      {/* Top highlight reflection */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(210 60% 95% / 0.6) 50%, transparent 100%)",
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

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, hsl(210 40% 65% / 0.7) 0%, transparent 100%)",
          borderRadius: "0 0 50% 50% / 0 0 28% 28%",
        }}
      />

      {/* Top vignette */}
      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, hsl(205 50% 80% / 0.4) 0%, transparent 100%)",
          borderRadius: "50% 50% 0 0 / 28% 28% 0 0",
        }}
      />

      {/* Side vignettes */}
      <div
        className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, hsl(210 40% 65% / 0.5) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to left, hsl(210 40% 65% / 0.5) 0%, transparent 100%)",
        }}
      />
    </motion.div>
  );
};

export default GlobeMapSection;
