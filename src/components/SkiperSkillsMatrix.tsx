"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiency?: number;
  icon?: string;
}

const DEFAULT_SKILLS: SkillItem[] = [
  { id: "1", name: "React.js", category: "Frontend", proficiency: 95 },
  { id: "2", name: "Next.js", category: "Frontend", proficiency: 95 },
  { id: "3", name: "Node.js", category: "Backend", proficiency: 92 },
  { id: "4", name: "Express.js", category: "Backend", proficiency: 90 },
  { id: "5", name: "TypeScript", category: "Languages", proficiency: 90 },
  { id: "6", name: "Java", category: "Languages", proficiency: 88 },
  { id: "7", name: "PostgreSQL", category: "Databases", proficiency: 88 },
  { id: "8", name: "MongoDB", category: "Databases", proficiency: 85 },
  { id: "9", name: "Flutter", category: "Mobile", proficiency: 85 },
  { id: "10", name: "Docker", category: "DevOps & Cloud", proficiency: 85 },
  { id: "11", name: "Git & GitHub", category: "Tools & Platforms", proficiency: 92 },
];

function getCategoryIconUrl(categoryName: string, sampleSkillName?: string): string {
  const c = categoryName.toLowerCase().trim();
  const s = sampleSkillName ? sampleSkillName.toLowerCase().trim() : "";

  if (c.includes("frontend")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
  if (c.includes("backend")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg";
  if (c.includes("lang")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg";
  if (c.includes("data") || c.includes("db")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg";
  if (c.includes("mobile") || c.includes("app")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg";
  if (c.includes("devops") || c.includes("cloud")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg";
  if (c.includes("tool") || c.includes("platform")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg";

  if (s.includes("react")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
  if (s.includes("node")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg";
  if (s.includes("java") && !s.includes("script")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg";
  if (s.includes("python")) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg";

  return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
}

export interface SkiperSkillsMatrixProps {
  skills?: SkillItem[];
}

export function SkiperSkillsMatrix({ skills = DEFAULT_SKILLS }: SkiperSkillsMatrixProps) {
  const rawSkills = skills.length > 0 ? skills : DEFAULT_SKILLS;
  const isMouseHovering = useRef(false);
  const matrixContainerRef = useRef<HTMLDivElement>(null);

  // Group backend-stored skills into EXACTLY 7 Categories
  const categoriesData = useMemo(() => {
    const map = new Map<string, SkillItem[]>();

    rawSkills.forEach((s) => {
      const cat = s.category ? s.category.trim() : "General";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      const existing = map.get(cat)!;
      if (!existing.some((item) => item.name.toLowerCase().trim() === s.name.toLowerCase().trim())) {
        existing.push(s);
      }
    });

    const entries = Array.from(map.entries()).slice(0, 7);

    return entries.map(([categoryName, items], index) => {
      const iconUrl = getCategoryIconUrl(categoryName, items[0]?.name);
      return {
        id: `cat-${index}`,
        name: categoryName,
        iconUrl,
        items,
      };
    });
  }, [rawSkills]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  // Scroll Driven Category Switcher
  useEffect(() => {
    let scrollTriggerInstance: any;
    const initScrollAnimation = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!matrixContainerRef.current) return;

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: matrixContainerRef.current,
        start: "top 75%",
        end: "bottom 25%",
        onUpdate: (self) => {
          if (isMouseHovering.current) return;
          const count = categoriesData.length;
          if (count === 0) return;
          const idx = Math.min(count - 1, Math.floor(self.progress * count));
          setHoveredIndex((prev) => (prev !== idx ? idx : prev));
        },
      });
    };

    initScrollAnimation();
    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, [categoriesData]);

  const activeCategory = hoveredIndex !== null && categoriesData[hoveredIndex] ? categoriesData[hoveredIndex] : categoriesData[0];
  const activeTitle = activeCategory ? activeCategory.name.toUpperCase() : "SKILLS MATRIX";

  return (
    <div
      ref={matrixContainerRef}
      onMouseEnter={() => { isMouseHovering.current = true; }}
      onMouseLeave={() => { isMouseHovering.current = false; }}
      className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center space-y-10 select-none py-6"
    >
      
      {/* Top EXACTLY 7 Category Logos Row */}
      <div className="flex items-center justify-center gap-3.5 sm:gap-5 md:gap-6 z-20 px-4">
        {categoriesData.map((cat, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={cat.id || idx}
              onMouseEnter={() => {
                isMouseHovering.current = true;
                setHoveredIndex(idx);
              }}
              whileHover={{ scale: 1.25, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl p-3.5 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isHovered
                  ? "bg-white/20 border-2 border-white shadow-[0_0_40px_rgba(255,255,255,0.45)] backdrop-blur-xl scale-110"
                  : "bg-white/[0.04] border border-white/12 hover:bg-white/10 backdrop-blur-md opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={cat.iconUrl}
                alt={cat.name}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Center Giant Animated Text with Dynamic Scaled Display Size */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[160px] md:min-h-[220px] px-2 py-4">
        <AnimatePresence mode="wait">
          {(() => {
            const len = activeTitle.length;
            const fontClass =
              len > 15
                ? "text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight"
                : len > 11
                ? "text-4xl sm:text-6xl md:text-8xl lg:text-[8rem] tracking-tight"
                : len > 8
                ? "text-5xl sm:text-7xl md:text-[8.5rem] lg:text-[9.5rem] tracking-tighter"
                : "text-6xl sm:text-8xl md:text-[9.5rem] lg:text-[11rem] tracking-tighter";

            return (
              <motion.h2
                key={activeTitle}
                initial={{ opacity: 0, y: 35, filter: "blur(12px)", scale: 0.96 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1.0 }}
                exit={{ opacity: 0, y: -35, filter: "blur(12px)", scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`font-black uppercase text-white leading-none text-center select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-w-full whitespace-nowrap overflow-visible ${fontClass}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {activeTitle}
              </motion.h2>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* Backend Stored Skills Display for Hovered Category */}
      <div className="min-h-[80px] w-full max-w-4xl px-4 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2.5"
            >
              {activeCategory.items.map((skill) => (
                <span
                  key={skill.id || skill.name}
                  className="px-4 py-2 bg-white/[0.05] border border-white/15 hover:border-white/35 rounded-xl text-white text-xs md:text-sm font-semibold tracking-wide backdrop-blur-md inline-flex items-center gap-2 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {skill.name}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default SkiperSkillsMatrix;
