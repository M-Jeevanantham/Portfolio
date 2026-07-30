"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DataCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/projects')
        ]);
        if (sRes.ok) setSkills(await sRes.json());
        if (pRes.ok) setProjects(await pRes.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.15;
      coreRef.current.rotation.x = t * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Cyber Core */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <MeshDistortMaterial 
            color="#020914" 
            emissive="#00F0FF" 
            emissiveIntensity={0.4}
            distort={0.4} 
            speed={2} 
            wireframe 
          />
        </mesh>
      </Float>

      {/* Dynamic 3D Skill Nodes (Spheres orbiting the core) */}
      {skills.map((skill, index) => {
        const angle = (index / Math.max(skills.length, 1)) * Math.PI * 2;
        const radius = 4 + (index % 2) * 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index * 1.5) * 2;

        return (
          <group key={skill.id || index} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial 
                color="#00F0FF" 
                emissive="#00F0FF" 
                emissiveIntensity={0.7} 
                wireframe 
              />
            </mesh>
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.25}
              color="#e0f2fe"
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>
          </group>
        );
      })}

      {/* Dynamic 3D Project Clusters (Glowing Cubes) */}
      {projects.map((project, index) => {
        const angle = ((index + 0.5) / Math.max(projects.length, 1)) * Math.PI * 2;
        const radius = 6 + (index % 3);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.cos(index * 2) * 2.5;

        return (
          <group key={project.id || index} position={[x, y, z]}>
            <mesh>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial 
                color="#000000" 
                emissive="#00F0FF" 
                emissiveIntensity={0.9}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <Text
              position={[0, 0.8, 0]}
              fontSize={0.28}
              color="#00F0FF"
              anchorX="center"
              anchorY="middle"
            >
              {project.title}
            </Text>
          </group>
        );
      })}

      {/* Ambient Floating Electric Cyan Particle Atmosphere */}
      <Sparkles 
        count={350} 
        scale={20} 
        size={3} 
        speed={0.5} 
        color="#00F0FF" 
        opacity={0.7}
      />
    </group>
  );
}
