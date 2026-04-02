import React from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float, Sparkles } from '@react-three/drei';

export default function KnowledgePool({ isRacing, isConverging }) {
  // If converging (winner found), flash bright!
  const color = isConverging ? "#6ee7b7" : isRacing ? "#10b981" : "#065f46";
  const distort = isRacing ? 0.7 : 0.3;
  const speed = isRacing ? 5 : 1;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#34d399" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#047857" />
        <Environment preset="city" />
        
        <Float speed={isRacing ? 3 : 1} rotationIntensity={isRacing ? 2 : 0.5} floatIntensity={1}>
          <Sphere args={[2, 64, 64]}>
            <MeshDistortMaterial 
              color={color} 
              distort={distort} 
              speed={speed} 
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </Sphere>
        </Float>

        {isRacing && (
          <Sparkles count={100} scale={6} size={2} speed={0.4} opacity={0.6} color="#34d399" />
        )}

        {isConverging && (
          <Sphere args={[2.2, 32, 32]}>
            <meshBasicMaterial color="#a7f3d0" transparent opacity={0.2} wireframe />
          </Sphere>
        )}
      </Canvas>
    </div>
  );
}
