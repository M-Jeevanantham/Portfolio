"use client";

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { ReactNode } from 'react';

export default function Scene({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00F0FF" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#050b14" />
        
        {children}
        
        <Preload all />
      </Canvas>
    </div>
  );
}
