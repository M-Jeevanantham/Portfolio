"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SkillHoverItem {
  id: string | number;
  name: string;
  category: string;
  iconUrl: string;
  description?: string;
}

const DEFAULT_SKILLS: SkillHoverItem[] = [
  { id: "1", name: "Next.js & React", category: "Frontend Systems", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", description: "SSR, ISR, Server Components & Micro-frontends" },
  { id: "2", name: "TypeScript & JavaScript", category: "Languages", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", description: "Strict Type Safety & Async Runtime Optimization" },
  { id: "3", name: "Node.js & Express", category: "Backend Architecture", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", description: "High-throughput REST API & WebSockets Microservices" },
  { id: "4", name: "PostgreSQL & Prisma", category: "Database & Storage", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", description: "Complex Query Optimization & Zero-Downtime Migrations" },
  { id: "5", name: "Docker & Containerization", category: "DevOps & Cloud", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", description: "Multi-stage Docker Builds & Automated CI/CD Pipelines" },
  { id: "6", name: "Flutter & Mobile SDE", category: "Mobile Apps", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", description: "Cross-platform iOS & Android Offline-first Architecture" },
  { id: "7", name: "Python & System Design", category: "Backend & Systems", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", description: "Distributed Systems, Caching & Data Structures" },
];

export interface Skiper6Props {
  items?: SkillHoverItem[];
  className?: string;
}

export function Skiper6HoverMember({ items = DEFAULT_SKILLS, className = "" }: Skiper6Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
      className={`relative w-full max-w-5xl mx-auto ${className}`}
    >
      {/* Floating Spotlight Preview Card following cursor */}
      <AnimatePresence>
        {hoveredIndex !== null && items[hoveredIndex] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: (cursorPos.x % 15) - 7.5,
              x: cursorPos.x - 110,
              y: cursorPos.y - 110,
            }}
            exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="pointer-events-none absolute top-0 left-0 z-40 w-52 h-52 bg-[#121218]/90 border border-white/20 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center text-center space-y-3"
          >
            <img
              src={items[hoveredIndex].iconUrl}
              alt={items[hoveredIndex].name}
              className="w-20 h-20 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
            <div>
              <p className="text-white text-xs font-mono font-bold uppercase tracking-wider">
                {items[hoveredIndex].name}
              </p>
              <p className="text-white/40 text-[10px] font-mono mt-0.5">
                {items[hoveredIndex].category}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive List Items */}
      <div className="divide-y divide-white/10 border-y border-white/10">
        {items.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <motion.div
              key={item.id || idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              className="group relative py-7 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-colors duration-300"
            >
              {/* Active Background Glow */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 pointer-events-none rounded-2xl ${
                  isHovered ? "bg-white/[0.04] opacity-100" : "opacity-0"
                }`}
              />

              <div className="relative z-10 flex items-center gap-6">
                <span className="text-white/25 text-xs font-mono tracking-widest uppercase">
                  0{idx + 1}
                </span>
                <h3
                  className={`text-2xl md:text-4xl font-extrabold uppercase tracking-tight transition-all duration-300 ${
                    isHovered ? "text-white translate-x-3 scale-[1.02]" : "text-white/50"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.name}
                </h3>
              </div>

              <div className="relative z-10 mt-2 md:mt-0 flex items-center gap-4">
                <span className="text-xs font-mono uppercase tracking-widest text-white/30 group-hover:text-emerald-400 transition-colors">
                  {item.category}
                </span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  className="text-white/40 group-hover:text-white transition-colors"
                >
                  ↗
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Skiper6HoverMember;
