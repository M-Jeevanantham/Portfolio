"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Calendar, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

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
    description: "Engineered 30+ enterprise UI micro-components and 10+ high-throughput REST API microservices in a fast-paced Agile sprint environment.\nOptimized database query execution and caching layer, reducing API latency by 40%.\nIntegrated automated CI/CD deployment pipelines, code review gates, and production telemetry monitoring.",
    skillsUsed: "React, Next.js, Node.js, Express, PostgreSQL, TypeScript, Docker, Git",
  },
  {
    id: "2",
    company: "Enterprise Software & Systems Architecture",
    role: "Lead Full-Stack Systems Builder",
    period: "2024 – 2025",
    location: "Remote / Independent",
    description: "Built and shipped enterprise SaaS applications end-to-end including Boutique (E-Commerce Platform with JWT & Payment Webhooks) and ServeSync (GPS Geofenced Workforce Marketplace).\nDesigned 14-module clean architecture business systems with zero downtime database migrations and offline-first data synchronization.",
    skillsUsed: "Next.js, TypeScript, PostgreSQL, Flutter, Payment APIs, Redis, System Design",
  },
  {
    id: "3",
    company: "Freelance & Independent Client Work",
    role: "Freelance Web Developer",
    period: "2024 – Present (1 Year)",
    location: "Remote / Global Clients",
    description: "Delivered 10+ custom full-stack web applications, dynamic business portfolios, and high-conversion e-commerce stores for clients worldwide.\nEngineered responsive frontend interfaces using Next.js, React, and Tailwind CSS with custom smooth animations and accessibility standards.\nBuilt scalable Node.js/Express REST APIs, database schemas, payment processing webhooks, and SEO optimizations.",
    skillsUsed: "Next.js, React, Node.js, Express, Tailwind CSS, PostgreSQL, MongoDB, Stripe, SEO",
  },
  {
    id: "4",
    company: "Full-Stack Web Development",
    role: "Backend & Systems Specialist",
    period: "2023 – 2024",
    location: "Tamil Nadu, India",
    description: "Architected microservice REST APIs, database schemas, and responsive web clients for scalable business applications.\nImplemented robust user authentication, JWT session management, role-based access control, and payment gateway webhooks.",
    skillsUsed: "React, Node.js, Express, MySQL, MongoDB, Tailwind CSS, REST APIs",
  },
];

export interface Skiper80Props {
  items?: ExperienceItem[];
}

export function Skiper80ExperienceShowcase({ items = DEFAULT_EXPERIENCE }: Skiper80Props) {
  const fetched = items && items.length > 0 ? items : [];
  const existingRoles = new Set(fetched.map((i) => i.role.toLowerCase().trim()));
  const extraDefaults = DEFAULT_EXPERIENCE.filter(
    (d) => !existingRoles.has(d.role.toLowerCase().trim())
  );

  const displayItems = [...fetched, ...extraDefaults];
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  const currentItem = displayItems[activeIndex] || displayItems[0];

  useEffect(() => {
    let scrollTriggerInstance: any;
    const initScrollSync = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          if (isHoveringRef.current) return;
          const count = displayItems.length;
          if (count === 0) return;
          const idx = Math.min(count - 1, Math.floor(self.progress * count));
          setActiveIndex((prev) => (prev !== idx ? idx : prev));
        },
      });
    };

    initScrollSync();
    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, [displayItems]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { isHoveringRef.current = true; }}
      onMouseLeave={() => { isHoveringRef.current = false; }}
      className="w-full max-w-7xl mx-auto py-8 select-none"
    >
      {/* Skiper80 Split Layout: Large Spacious Left Card + Right Titles List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center min-h-[560px]">
        
        {/* LEFT COLUMN: Large Spacious Card (Displays ALL details directly, no popup needed) */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 w-full z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id || activeIndex}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1.0 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#0c0d14]/95 border border-white/20 rounded-[2.5rem] p-7 sm:p-9 md:p-11 shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative overflow-hidden transform-gpu flex flex-col justify-between min-h-[500px]"
            >
              {/* Ambient Radial Glow */}
              <div className="absolute -top-28 -left-28 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Top Silver Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-400 via-white to-zinc-500" />

              {/* Ghost Index Watermark */}
              <div
                className="text-white/[0.04] text-[9rem] md:text-[13rem] font-black absolute bottom-[-4rem] right-4 leading-none select-none pointer-events-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                0{activeIndex + 1}
              </div>

              <div className="relative z-10 space-y-7">
                {/* Header Badge & Company Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 border border-white/20 px-4 py-1.5 rounded-full bg-white/[0.06] text-white text-xs font-mono font-medium">
                      <Building2 className="w-3.5 h-3.5 text-zinc-300" />
                      {currentItem.company}
                    </span>
                    <span className="inline-flex items-center gap-1.5 border border-white/20 px-4 py-1.5 rounded-full bg-white/[0.06] text-white/70 text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5 text-white/50" />
                      {currentItem.period}
                    </span>
                  </div>

                  <h3
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight pt-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {currentItem.role}
                  </h3>

                  {currentItem.location && (
                    <p className="text-white/50 text-xs font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {currentItem.location}
                    </p>
                  )}
                </div>

                {/* Full Description & Deliverables List (ALL details directly displayed) */}
                <div className="space-y-3.5 pt-4 border-t border-white/10 text-white/90 text-xs sm:text-sm font-light leading-relaxed">
                  {currentItem.description.split("\n").map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
                      <CheckCircle2 className="w-4 h-4 text-zinc-300 mt-0.5 flex-shrink-0" />
                      <span>{line.replace(/^•\s*/, "")}</span>
                    </div>
                  ))}
                </div>

                {/* Complete Tech Stack Badges */}
                {currentItem.skillsUsed && (
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <p className="text-white/40 text-[11px] font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-300" /> Technologies & Tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentItem.skillsUsed.split(",").map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 bg-white/[0.08] border border-white/15 rounded-xl text-white font-mono text-xs font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Titles List (Hover/Click updates the spacious left card) */}
        <div className="lg:col-span-5 flex flex-col space-y-5 lg:pl-4 justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white/40 text-xs font-mono tracking-widest uppercase font-bold">
              MY EXPERIENCE
            </span>
            <span className="block w-40 h-px bg-white/20" />
          </div>

          <div className="space-y-4">
            {displayItems.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div
                  key={item.id || idx}
                  onMouseEnter={() => {
                    setActiveIndex(idx);
                  }}
                  onClick={() => {
                    setActiveIndex(idx);
                  }}
                  className="group cursor-pointer py-2 transition-all duration-300"
                >
                  <h3
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight uppercase leading-tight transition-all duration-300 ${
                      isActive
                        ? "text-white translate-x-2 opacity-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        : "text-white/30 hover:text-white/60 opacity-40"
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.role} {isActive && <span className="text-white font-normal"> ·</span>}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Skiper80ExperienceShowcase;
