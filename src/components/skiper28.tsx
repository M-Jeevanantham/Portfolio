"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, MapPin, Sparkles, Building2, ExternalLink } from "lucide-react";

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  skillsUsed?: string;
}

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: "1",
    company: "Axexa Technology Solutions",
    role: "Software Development Engineer Intern",
    period: "Jul 2025 – Present",
    location: "Tamil Nadu, India",
    description: "• Engineered 30+ enterprise UI micro-components and 10+ high-throughput REST API microservices in a fast-paced Agile sprint environment.\n• Optimized database query execution and caching layer, reducing API latency by 40%.\n• Integrated automated CI/CD deployment pipelines, code review gates, and production telemetry monitoring.",
    skillsUsed: "React, Next.js, Node.js, Express, PostgreSQL, TypeScript, Docker, Git",
  },
  {
    id: "2",
    company: "Enterprise Software & Systems Architecture",
    role: "Lead Full-Stack Systems Builder",
    period: "2024 – 2025",
    location: "Remote / Independent",
    description: "• Built and shipped enterprise SaaS applications end-to-end including Boutique (E-Commerce Platform with JWT & Payment Webhooks) and ServeSync (GPS Geofenced Workforce Marketplace).\n• Designed 14-module clean architecture business systems with zero downtime database migrations and offline-first data synchronization.",
    skillsUsed: "Next.js, TypeScript, PostgreSQL, Flutter, Payment APIs, Redis, System Design",
  },
];

export interface Skiper28PerspectiveScrollProps {
  items?: ExperienceItem[];
}

function PerspectiveExperienceCard({
  item,
  index,
  total,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // 3D Perspective Transforms for Skiper28
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [22, 0, 0, -18]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.88, 1, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.3, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [60, 0, 0, -40]);

  return (
    <div
      ref={cardRef}
      className="w-full my-12 md:my-20"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: "preserve-3d",
        }}
        className="w-full bg-[#0d0d14]/95 border border-white/15 rounded-3xl p-8 md:p-12 shadow-[0_35px_100px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative overflow-hidden transition-all duration-300 group hover:border-white/35 hover:shadow-[0_40px_110px_rgba(255,255,255,0.08)]"
      >
        {/* Subtle Glowing Radial Background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
        
        {/* Top Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

        {/* Ghost Index Number */}
        <div
          className="text-white/[0.03] text-[9rem] md:text-[14rem] font-black absolute bottom-[-4rem] right-4 leading-none select-none pointer-events-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          0{index + 1}
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-white/[0.06] border border-white/12 text-emerald-400 shadow-inner">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
                  EXPERIENCE 0{index + 1} OF 0{total}
                </span>
              </div>
              <h3
                className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.role}
              </h3>
              <p className="text-emerald-400 font-semibold text-base md:text-lg">
                {item.company}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs font-mono text-white/70">
              <span className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-white/50" />
                {item.period}
              </span>
              {item.location && (
                <span className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-white/50" />
                  {item.location}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-white/80 text-sm md:text-base font-light leading-relaxed whitespace-pre-line">
            {item.description}
          </div>

          {/* Technologies & Skills Used Badges */}
          {item.skillsUsed && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Technologies & Architecture
              </p>
              <div className="flex flex-wrap gap-2">
                {item.skillsUsed.split(",").map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3.5 py-1.5 bg-white/[0.05] border border-white/10 hover:border-white/25 rounded-xl text-white/90 text-xs font-mono font-medium transition-all"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function Skiper28PerspectiveScroll({ items = DEFAULT_EXPERIENCE }: Skiper28PerspectiveScrollProps) {
  const displayItems = items.length > 0 ? items : DEFAULT_EXPERIENCE;

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      {displayItems.map((item, idx) => (
        <PerspectiveExperienceCard
          key={item.id || idx}
          item={item}
          index={idx}
          total={displayItems.length}
        />
      ))}
    </div>
  );
}

export default Skiper28PerspectiveScroll;
