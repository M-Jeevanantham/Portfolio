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

// ── Category SVG Icons — concept-based, not library logos ──────────────────
function CategoryIcon({ category, size = 32 }: { category: string; size?: number }) {
  const c = category.toLowerCase().trim();
  const s = size;
  const strokeProps = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  // Frontend — Monitor / browser window
  if (c.includes("frontend") || c.includes("ui") || c.includes("web")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l3 3-3 3" />
        <path d="M13 14h4" />
      </svg>
    );
  }

  // Backend — Server stack
  if (c.includes("backend") || c.includes("server") || c.includes("api")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <rect x="2" y="3" width="20" height="5" rx="1.5" />
        <rect x="2" y="10" width="20" height="5" rx="1.5" />
        <rect x="2" y="17" width="20" height="5" rx="1.5" />
        <circle cx="18" cy="5.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="12.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="19.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  // Languages — Code brackets / terminal
  if (c.includes("lang") || c.includes("program") || c.includes("script")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    );
  }

  // Databases — Cylinder / database
  if (c.includes("data") || c.includes("db") || c.includes("sql") || c.includes("database")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 5v7c0 1.66-4.03 3-9 3s-9-1.34-9-3V5" />
        <path d="M21 12v7c0 1.66-4.03 3-9 3s-9-1.34-9-3v-7" />
      </svg>
    );
  }

  // Mobile — Smartphone
  if (c.includes("mobile") || c.includes("app") || c.includes("android") || c.includes("ios")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5} strokeLinecap="round" />
        <line x1="9" y1="6" x2="15" y2="6" />
      </svg>
    );
  }

  // DevOps / Cloud — Cloud upload / deploy
  if (c.includes("devops") || c.includes("cloud") || c.includes("infra") || c.includes("ci") || c.includes("cd")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9Z" />
        <path d="m12 13-3 3 3 3M12 13l3 3-3 3" />
        <line x1="12" y1="13" x2="12" y2="22" />
      </svg>
    );
  }

  // Tools / Platforms / Version Control — Wrench & settings
  if (c.includes("tool") || c.includes("platform") || c.includes("version") || c.includes("git")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }

  // Testing / QA — checkmark shield
  if (c.includes("test") || c.includes("qa") || c.includes("quality")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    );
  }

  // Design / UI/UX — pen tool
  if (c.includes("design") || c.includes("ux") || c.includes("figma") || c.includes("visual")) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    );
  }

  // Default — star / general
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...strokeProps}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
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
      return {
        id: `cat-${index}`,
        name: categoryName,
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

      {/* Top 7 Category Icons Row — concept SVG icons */}
      <div className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-5 md:gap-6 z-20 px-2 w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2">
        {categoriesData.map((cat, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={cat.id || idx}
              onMouseEnter={() => {
                isMouseHovering.current = true;
                setHoveredIndex(idx);
              }}
              whileHover={{ scale: 1.2, y: -6 }}
              whileTap={{ scale: 0.95 }}
              className={`w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center cursor-pointer transition-all duration-300 flex-shrink-0 ${
                isHovered
                  ? "bg-white/20 border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.45)] backdrop-blur-xl scale-105 text-white"
                  : "bg-white/[0.04] border border-white/12 hover:bg-white/10 backdrop-blur-md opacity-60 hover:opacity-100 text-white/70"
              }`}
            >
              <CategoryIcon category={cat.name} size={24} />
            </motion.div>
          );
        })}
      </div>

      {/* Center Giant Animated Category Name */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[120px] md:min-h-[220px] px-2 py-2">
        <AnimatePresence mode="wait">
          {(() => {
            const len = activeTitle.length;
            const fontClass =
              len > 15
                ? "text-2xl sm:text-4xl md:text-7xl lg:text-[6.5rem] tracking-tight"
                : len > 11
                ? "text-3xl sm:text-5xl md:text-8xl lg:text-[8rem] tracking-tight"
                : len > 8
                ? "text-3xl sm:text-6xl md:text-[8.5rem] lg:text-[9.5rem] tracking-tighter"
                : "text-4xl sm:text-7xl md:text-[9.5rem] lg:text-[11rem] tracking-tighter";

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

      {/* Skills for Active Category */}
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
