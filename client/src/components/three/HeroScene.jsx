import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Rough longitude/latitude coordinates for stylized Earth continents
const CONTINENTS = [
  // North America
  [
    [-168, 66], [-120, 70], [-80, 75], [-60, 75], [-50, 50],
    [-80, 25], [-100, 15], [-105, 20], [-120, 35], [-125, 48],
    [-125, 60], [-160, 60]
  ],
  // Central/South America
  [
    [-80, 12], [-72, 10], [-60, 5], [-35, -5], [-35, -8],
    [-40, -20], [-70, -55], [-75, -50], [-75, -40], [-80, -20],
    [-82, 0]
  ],
  // Africa
  [
    [-17, 32], [10, 30], [35, 30], [50, 12], [40, -15],
    [22, -35], [18, -35], [10, -10], [-15, 5], [-17, 15]
  ],
  // Eurasia
  [
    [-10, 60], [30, 70], [60, 75], [100, 75], [140, 75],
    [170, 70], [170, 60], [140, 35], [120, 15], [100, 5],
    [105, 20], [98, 20], [80, 10], [75, 25], [65, 30],
    [40, 15], [30, 30], [15, 40], [-5, 40]
  ],
  // Australia
  [
    [113, -20], [153, -15], [153, -35], [140, -38], [115, -33]
  ],
  // Greenland
  [
    [-70, 80], [-30, 80], [-40, 60], [-60, 65]
  ],
  // Madagascar
  [
    [45, -12], [50, -15], [48, -25], [43, -25]
  ]
];

function EarthMesh() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const glowRef = useRef();

  // Create a high-tech procedural Earth texture using Canvas
  const earthTexture = useMemo(() => {
    const width = 1024;
    const height = 512;
    
    // Create mask canvas to determine land vs water
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const mCtx = maskCanvas.getContext('2d');
    
    mCtx.fillStyle = '#000000';
    mCtx.fillRect(0, 0, width, height);
    
    // Convert lat/long to X/Y
    const toX = (lon) => (lon + 180) * (width / 360);
    const toY = (lat) => (90 - lat) * (height / 180);
    
    // Draw filled continents in white on mask
    mCtx.fillStyle = '#ffffff';
    CONTINENTS.forEach(poly => {
      mCtx.beginPath();
      poly.forEach(([lon, lat], idx) => {
        const px = toX(lon);
        const py = toY(lat);
        if (idx === 0) mCtx.moveTo(px, py);
        else mCtx.lineTo(px, py);
      });
      mCtx.closePath();
      mCtx.fill();
    });

    // Create main drawing canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Deep blue ocean background (made pure black to match theme)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw latitude/longitude grids
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 64) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }
    
    // Draw dot-matrix land
    const maskData = mCtx.getImageData(0, 0, width, height).data;
    const step = 4; // Grid dot spacing
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (maskData[idx] > 127) { // If white (land) in mask
          ctx.fillStyle = 'rgba(0, 212, 255, 0.7)';
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
    }
    
    // Draw glowing cyan outlines for the continents
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.45)';
    ctx.lineWidth = 1.5;
    CONTINENTS.forEach(poly => {
      ctx.beginPath();
      poly.forEach(([lon, lat], idx) => {
        const px = toX(lon);
        const py = toY(lat);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.06;
    if (glowRef.current) glowRef.current.rotation.y = -t * 0.015;
  });

  return (
    <group>
      {/* Procedural Dot-Matrix Earth Globe */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.4}
          metalness={0.2}
          emissive={new THREE.Color('#002244')}
          emissiveIntensity={0.15}
        />
      </Sphere>

      {/* Cyber Grid Cloud/Atmosphere Layer */}
      <Sphere args={[2.03, 48, 48]} ref={cloudsRef}>
        <meshPhongMaterial
          color={new THREE.Color('#00ff88')}
          transparent
          opacity={0.15}
          wireframe={true}
          emissive={new THREE.Color('#004422')}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Atmosphere glow effect */}
      <Sphere args={[2.08, 64, 64]} ref={glowRef}>
        <meshPhongMaterial
          color={new THREE.Color('#00d4ff')}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          emissive={new THREE.Color('#0066cc')}
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Outer haze layer */}
      <Sphere args={[2.22, 32, 32]}>
        <meshPhongMaterial
          color={new THREE.Color('#0044aa')}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          emissive={new THREE.Color('#0033aa')}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  );
}

function SatelliteModel({ radius, speed, offset, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t * 0.5) * radius * 0.25;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.rotation.y = t * 2;
      ref.current.rotation.z = Math.sin(t) * 0.3;
    }
  });

  const c = new THREE.Color(color);
  return (
    <group ref={ref}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.09, 0.09]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left panel */}
      <mesh position={[0.28, 0, 0]}>
        <boxGeometry args={[0.22, 0.001, 0.13]} />
        <meshStandardMaterial color={new THREE.Color('#112244')} emissive={new THREE.Color('#002266')} emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right panel */}
      <mesh position={[-0.28, 0, 0]}>
        <boxGeometry args={[0.22, 0.001, 0.13]} />
        <meshStandardMaterial color={new THREE.Color('#112244')} emissive={new THREE.Color('#002266')} emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Dish antenna */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.06, 0.08, 8]} />
        <meshStandardMaterial color={new THREE.Color('#aaaaaa')} metalness={0.95} roughness={0.05} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, tilt = 0, opacity = 0.07 }) {
  return (
    <Ring args={[radius - 0.006, radius + 0.006, 128]} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <meshBasicMaterial color="#00d4ff" transparent opacity={opacity} side={THREE.DoubleSide} />
    </Ring>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 7.5], fov: 42 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.2} color="#ffffff" />
        {/* Sun-like directional light */}
        <directionalLight position={[8, 4, 6]} intensity={2.5} color="#fff8e1" castShadow />
        {/* Fill light — blue space ambiance */}
        <pointLight position={[-10, -5, -8]} intensity={0.6} color="#002266" />
        {/* Cyan accent from front */}
        <pointLight position={[0, 3, 9]} intensity={0.4} color="#00d4ff" />
        {/* Nebula purple from side */}
        <pointLight position={[-8, 4, -2]} intensity={0.3} color="#4400aa" />

        {/* Stars */}
        <Stars radius={90} depth={60} count={4000} factor={3} saturation={0.3} fade speed={0.4} />

        {/* Earth */}
        <EarthMesh />

        {/* Orbit rings */}
        <OrbitRing radius={3.0} tilt={0.08} opacity={0.10} />
        <OrbitRing radius={3.8} tilt={0.45} opacity={0.08} />
        <OrbitRing radius={4.6} tilt={-0.18} opacity={0.06} />
        <OrbitRing radius={3.4} tilt={0.7} opacity={0.05} />

        {/* Satellites */}
        <SatelliteModel radius={3.0} speed={0.55}  offset={0}               color="#00d4ff" />
        <SatelliteModel radius={3.8} speed={0.38}  offset={Math.PI}         color="#00ff88" />
        <SatelliteModel radius={4.6} speed={0.28}  offset={Math.PI * 0.6}   color="#ffd700" />
        <SatelliteModel radius={3.4} speed={0.48}  offset={Math.PI * 1.4}   color="#7b2fff" />
        <SatelliteModel radius={4.2} speed={0.32}  offset={Math.PI * 0.3}   color="#ff6b35" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      </Suspense>
    </Canvas>
  );
}
