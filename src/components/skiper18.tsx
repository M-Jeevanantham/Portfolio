"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  image: string;
  label: string;
}

const DEFAULT_SKILL_ICONS = [
  { label: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { label: "Next.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { label: "TypeScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { label: "Node.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { label: "PostgreSQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { label: "Docker", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { label: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { label: "Flutter", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { label: "Tailwind", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { label: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { label: "Java", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { label: "Go", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" },
  { label: "MongoDB", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { label: "Redis", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { label: "GraphQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { label: "Amazon Web Services", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { label: "Linux", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
];

export interface ImageCursorTrailProps {
  children?: React.ReactNode;
  items?: { label: string; url: string }[];
  distance?: number;
  maxItems?: number;
  className?: string;
}

export function ImageCursorTrail({
  children,
  items = DEFAULT_SKILL_ICONS,
  distance = 55,
  maxItems = 8,
  className = "",
}: ImageCursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const itemIndexRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastPosRef.current) {
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < distance) return;
    }

    lastPosRef.current = { x, y };

    const currentItem = items[itemIndexRef.current % items.length];
    itemIndexRef.current += 1;

    const newItem: TrailItem = {
      id: Date.now() + Math.random(),
      x,
      y,
      rotation: (Math.random() - 0.5) * 40, // -20deg to +20deg
      scale: 0.85 + Math.random() * 0.35, // 0.85 to 1.2
      image: currentItem.url,
      label: currentItem.label,
    };

    setTrail((prev) => [...prev.slice(-maxItems + 1), newItem]);
  };

  useEffect(() => {
    if (trail.length === 0) return;
    const timer = setTimeout(() => {
      setTrail((prev) => prev.slice(1));
    }, 850);
    return () => clearTimeout(timer);
  }, [trail]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-full ${className}`}
    >
      {children}

      {/* Render Large Skiper18 Image Cursor Trail Overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.2, x: item.x - 60, y: item.y - 60, rotate: item.rotation - 15 }}
              animate={{ opacity: 1, scale: item.scale, x: item.x - 60, y: item.y - 60, rotate: item.rotation }}
              exit={{ opacity: 0, scale: 0.4, y: item.y - 80, transition: { duration: 0.4, ease: "easeInOut" } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-0 left-0 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center p-3 bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.15)]"
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ImageCursorTrail;
