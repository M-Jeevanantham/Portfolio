"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, MapPin, Sparkles, Building2, CheckCircle2 } from "lucide-react";

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

export interface Skiper16CardStackScrollProps {
  items?: ExperienceItem[];
}

function ExperienceCard({
  item,
  index,
  total,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <div
      ref={containerRef}
      className="sticky top-28 md:top-36 w-full mb-12 last:mb-0"
      style={{
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full bg-[#0d0d12]/95 border border-white/15 rounded-3xl p-8 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300 relative overflow-hidden group hover:border-white/30"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Ghost Index Number */}
        <div
          className="text-white/[0.03] text-[9rem] md:text-[13rem] font-black absolute bottom-[-4rem] right-4 leading-none select-none pointer-events-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          0{index + 1}
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-white/50 text-xs font-mono tracking-widest uppercase">
                  EXPERIENCE 0{index + 1} OF 0{total}
                </span>
              </div>
              <h3
                className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.role}
              </h3>
              <p className="text-emerald-400 font-semibold text-base md:text-lg flex items-center gap-2">
                <span>{item.company}</span>
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs font-mono text-white/60">
              <span className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-full bg-white/[0.04]">
                <Calendar className="w-3.5 h-3.5 text-white/50" />
                {item.period}
              </span>
              {item.location && (
                <span className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-full bg-white/[0.04]">
                  <MapPin className="w-3.5 h-3.5 text-white/50" />
                  {item.location}
                </span>
              )}
            </div>
          </div>

          {/* Description Points */}
          <div className="space-y-3 text-white/80 text-sm md:text-base font-light leading-relaxed whitespace-pre-line">
            {item.description}
          </div>

          {/* Skills Used Badges */}
          {item.skillsUsed && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Technologies & Architecture
              </p>
              <div className="flex flex-wrap gap-2">
                {item.skillsUsed.split(",").map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3.5 py-1.5 bg-white/[0.05] border border-white/10 hover:border-white/25 rounded-lg text-white/90 text-xs font-mono font-medium transition-all"
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

export function Skiper16CardStackScroll({ items = DEFAULT_EXPERIENCE }: Skiper16CardStackScrollProps) {
  const displayItems = items.length > 0 ? items : DEFAULT_EXPERIENCE;

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      {displayItems.map((item, idx) => (
        <ExperienceCard key={item.id || idx} item={item} index={idx} total={displayItems.length} />
      ))}
    </div>
  );
}

export default Skiper16CardStackScroll;
