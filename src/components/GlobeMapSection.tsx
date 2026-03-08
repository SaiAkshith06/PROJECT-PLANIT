import { useRef, useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

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

// --- Globe Earth ---
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg");
  const bumpMap = useTexture("https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png");

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={bumpMap}
        bumpScale={0.03}
        metalness={0.1}
        roughness={0.7}
      />
    </mesh>
  );
}

// --- Atmosphere glow ---
function Atmosphere() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `;

  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  );
}

// --- Marker Pin ---
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
  const [hovered, setHovered] = useState(false);

  // Pulse animation
  useFrame((_, delta) => {
    if (!markerRef.current) return;
    if (isSelected) {
      markerRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.15);
    } else {
      markerRef.current.scale.setScalar(hovered ? 1.3 : 1);
    }
  });

  const showLabel = cameraDistance < 6;
  const showSights = isSelected && cameraDistance < 4;

  return (
    <group ref={markerRef} position={position}>
      {/* Pin dot */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? "#E67514" : "#06923E"}
          emissive={isSelected ? "#E67514" : "#06923E"}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
        />
      </mesh>

      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.045, 0.06, 32]} />
        <meshBasicMaterial
          color={isSelected ? "#E67514" : "#06923E"}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, 0.08, 0]}
          center
          distanceFactor={3}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="px-2 py-1 rounded-md text-xs font-display font-semibold whitespace-nowrap select-none"
            style={{
              background: isSelected
                ? "hsl(27 90% 49%)"
                : "hsl(0 0% 13% / 0.85)",
              color: "white",
              border: isSelected ? "1px solid hsl(27 85% 42%)" : "1px solid hsl(0 0% 30%)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              transform: "translateY(-4px)",
            }}
          >
            {dest.name}
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
    () => latLngToVector3(sight.lat, sight.lng, 2.03),
    [sight.lat, sight.lng]
  );

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.05, 0]} center distanceFactor={2.5} style={{ pointerEvents: "none" }}>
        <div
          className="px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap select-none"
          style={{
            background: "hsl(220 80% 50% / 0.9)",
            color: "white",
            boxShadow: "0 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          {sight.name}
        </div>
      </Html>
    </group>
  );
}

// --- Camera Controller ---
function CameraController({
  targetDest,
  onDistanceChange,
}: {
  targetDest: Destination | null;
  onDistanceChange: (d: number) => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);
  const animProgress = useRef(0);

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
  }, [targetDest]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const dist = camera.position.length();
    onDistanceChange(dist);

    if (isAnimating.current) {
      animProgress.current += delta * 0.8;
      const t = Math.min(animProgress.current, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease out cubic

      camera.position.lerp(targetPos.current, eased * 0.05);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      if (t >= 1) {
        isAnimating.current = false;
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
      dampingFactor={0.08}
      rotateSpeed={0.5}
      zoomSpeed={0.6}
      target={[0, 0, 0]}
    />
  );
}

// --- Scene ---
function GlobeScene({ onLocationClick }: { onLocationClick?: (name: string) => void }) {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [cameraDistance, setCameraDistance] = useState(5);

  const handleDestClick = useCallback(
    (dest: Destination) => {
      setSelectedDest(dest);
      onLocationClick?.(dest.name);
    },
    [onLocationClick]
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#E67514" />

      <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />

      <Suspense fallback={null}>
        <Earth />
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

      <CameraController targetDest={selectedDest} onDistanceChange={setCameraDistance} />
    </>
  );
}

// --- Main Component ---
const GlobeMapSection = ({ onLocationClick }: GlobeMapSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-[50%/30%] border-2 border-border"
      style={{
        height: "550px",
        background: "radial-gradient(ellipse at center, hsl(220 30% 8%) 0%, hsl(220 40% 3%) 100%)",
        boxShadow:
          "0 0 60px 10px hsl(220 60% 15% / 0.3), inset 0 0 80px 20px hsl(220 40% 5% / 0.5)",
      }}
    >
      {/* Elliptical inner glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          borderRadius: "50% / 30%",
          boxShadow: "inset 0 0 100px 30px hsl(210 60% 20% / 0.2)",
        }}
      />

      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={{ borderRadius: "50% / 30%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeScene onLocationClick={onLocationClick} />
      </Canvas>

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, hsl(220 40% 3%) 0%, transparent 100%)",
          borderRadius: "0 0 50% 50% / 0 0 30% 30%",
        }}
      />
    </motion.div>
  );
};

export default GlobeMapSection;
