"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Building2, Calendar, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { useLenis } from "lenis/react";

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
    description:
      "Engineered 30+ enterprise UI micro-components and 10+ high-throughput REST API microservices in a fast-paced Agile sprint environment.\nOptimized database query execution and caching layer, reducing API latency by 40%.\nIntegrated automated CI/CD deployment pipelines, code review gates, and production telemetry monitoring.",
    skillsUsed: "React, Next.js, Node.js, Express, PostgreSQL, TypeScript, Docker, Git",
  },
  {
    id: "2",
    company: "Enterprise Software & Systems Architecture",
    role: "Lead Full-Stack Systems Builder",
    period: "2024 – 2025",
    location: "Remote / Independent",
    description:
      "Built and shipped enterprise SaaS applications end-to-end including ServeSync (GPS Geofenced Workforce Marketplace).\nDesigned 14-module clean architecture business systems with zero downtime database migrations and offline-first data synchronization.",
    skillsUsed: "Next.js, TypeScript, PostgreSQL, Flutter, Payment APIs, Redis, System Design",
  },
  {
    id: "3",
    company: "Freelance & Independent Client Work",
    role: "Freelance Web Developer",
    period: "2024 – Present (1 Year)",
    location: "Remote / Global Clients",
    description:
      "Delivered 10+ custom full-stack web applications, dynamic business portfolios, and high-conversion e-commerce stores for clients worldwide.\nEngineered responsive frontend interfaces using Next.js, React, and Tailwind CSS with custom smooth animations and accessibility standards.\nBuilt scalable Node.js/Express REST APIs, database schemas, payment processing webhooks, and SEO optimizations.",
    skillsUsed: "Next.js, React, Node.js, Express, Tailwind CSS, PostgreSQL, MongoDB, Stripe, SEO",
  },
  {
    id: "4",
    company: "Full-Stack Web Development",
    role: "Backend & Systems Specialist",
    period: "2023 – 2024",
    location: "Tamil Nadu, India",
    description:
      "Architected microservice REST APIs, database schemas, and responsive web clients for scalable business applications.\nImplemented robust user authentication, JWT session management, role-based access control, and payment gateway webhooks.",
    skillsUsed: "React, Node.js, Express, MySQL, MongoDB, Tailwind CSS, REST APIs",
  },
];

export interface Skiper80Props {
  items?: ExperienceItem[];
}

/**
 * Individual Card Component that reacts continuously to scroll progress
 */
function ExperienceCard({
  item,
  index,
  totalItems,
  scrollYProgress,
}: {
  item: ExperienceItem;
  index: number;
  totalItems: number;
  scrollYProgress: any;
}) {
  const segment = 1 / Math.max(1, totalItems - 1);
  const center = index * segment;

  const fadeInStart = Math.max(0, center - segment * 0.7);
  const fadeInEnd = center;
  const fadeOutStart = Math.min(1, center + segment * 0.5);
  const fadeOutEnd = Math.min(1, center + segment * 0.9);

  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0, fadeOutStart, fadeOutEnd]
      : index === totalItems - 1
      ? [fadeInStart, fadeInEnd, 1, 1]
      : [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    index === 0
      ? [1, 1, 0, 0]
      : index === totalItems - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0, fadeOutStart, fadeOutEnd]
      : index === totalItems - 1
      ? [fadeInStart, fadeInEnd, 1, 1]
      : [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    index === 0
      ? [0, 0, -30, -50]
      : index === totalItems - 1
      ? [40, 0, 0, 0]
      : [40, 0, 0, -40]
  );

  const scale = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutEnd],
    [0.96, 1, 0.97]
  );

  const pointerEvents = useTransform(opacity, (o) => (o > 0.4 ? "auto" : "none"));

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
      }}
      className="absolute inset-0 w-full bg-[#0c0d14]/95 border border-white/20 rounded-[2.5rem] p-7 sm:p-9 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden transform-gpu will-change-transform flex flex-col justify-between"
    >
      {/* Ambient Glow */}
      <div className="absolute -top-28 -left-28 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      {/* Top Silver Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-400 via-white to-zinc-500" />
      {/* Ghost Watermark Index */}
      <div
        className="text-white/[0.04] text-[9rem] md:text-[13rem] font-black absolute bottom-[-4rem] right-4 leading-none select-none pointer-events-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        0{index + 1}
      </div>

      <div className="relative z-10 space-y-5">
        {/* Header Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 border border-white/20 px-4 py-1.5 rounded-full bg-white/[0.06] text-white text-xs font-mono font-medium">
              <Building2 className="w-3.5 h-3.5 text-zinc-300" />
              {item.company}
            </span>
            <span className="inline-flex items-center gap-1.5 border border-white/20 px-4 py-1.5 rounded-full bg-white/[0.06] text-white/70 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-white/50" />
              {item.period}
            </span>
          </div>

          <h3
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight pt-1 leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {item.role}
          </h3>

          {item.location && (
            <p className="text-white/50 text-xs font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {item.location}
            </p>
          )}
        </div>

        {/* Bullet Points */}
        <div className="space-y-2.5 pt-3 border-t border-white/10 text-white/90 text-xs sm:text-sm font-light leading-relaxed max-h-[35vh] overflow-y-auto">
          {item.description.split("\n").map((line, lIdx) => (
            <div key={lIdx} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-zinc-300 mt-0.5 flex-shrink-0" />
              <span>{line.replace(/^•\s*/, "")}</span>
            </div>
          ))}
        </div>

        {/* Skills Used */}
        {item.skillsUsed && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <p className="text-white/40 text-[11px] font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" /> Technologies & Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {item.skillsUsed.split(",").map((skill, sIdx) => (
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
  );
}

/**
 * Subcomponent for right-side navigation item (complies with Rules of Hooks)
 */
function ExperienceNavTitle({
  item,
  idx,
  activeFloat,
  onClick,
}: {
  item: ExperienceItem;
  idx: number;
  activeFloat: any;
  onClick: () => void;
}) {
  const itemOpacity = useTransform(activeFloat, (val: number) => {
    const diff = Math.abs(val - idx);
    return Math.max(0.25, 1 - diff * 0.75);
  });

  const itemColor = useTransform(activeFloat, (val: number) => {
    const isCurrent = Math.round(val) === idx;
    return isCurrent ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.25)";
  });

  const borderOpacity = useTransform(activeFloat, (val: number) => {
    const isCurrent = Math.round(val) === idx;
    return isCurrent ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.08)";
  });

  const translateX = useTransform(activeFloat, (val: number) => {
    const isCurrent = Math.round(val) === idx;
    return isCurrent ? 6 : 0;
  });

  return (
    <motion.div
      onClick={onClick}
      style={{
        borderColor: borderOpacity,
        x: translateX,
      }}
      className="group cursor-pointer py-3 border-l-2 pl-5 transition-all duration-200"
    >
      <span className="block text-white/25 text-[10px] font-mono mb-0.5">
        {String(idx + 1).padStart(2, "0")} · {item.period}
      </span>
      <motion.h3
        style={{
          color: itemColor,
          opacity: itemOpacity,
        }}
        className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight uppercase leading-tight transition-colors duration-200"
      >
        {item.role}
      </motion.h3>
      <span className="block text-xs font-mono mt-0.5 text-white/35">
        {item.company}
      </span>
    </motion.div>
  );
}

/**
 * Subcomponent for progress dot (complies with Rules of Hooks)
 */
function ExperienceProgressDot({
  idx,
  activeFloat,
  onClick,
}: {
  idx: number;
  activeFloat: any;
  onClick: () => void;
}) {
  const width = useTransform(activeFloat, (val: number) => (Math.round(val) === idx ? 24 : 8));
  const backgroundColor = useTransform(activeFloat, (val: number) => (Math.round(val) === idx ? "#ffffff" : "rgba(255,255,255,0.2)"));

  return (
    <button onClick={onClick} className="py-1 cursor-pointer focus:outline-none">
      <motion.div
        style={{
          width,
          backgroundColor,
        }}
        className="h-1 rounded-full transition-colors duration-200"
      />
    </button>
  );
}

/**
 * Skiper80ExperienceShowcase Component
 *
 * Uses Framer Motion's continuous scroll-linked transforms for butter-smooth card transitions.
 * Strict compliance with React's Rules of Hooks.
 */
export function Skiper80ExperienceShowcase({ items = DEFAULT_EXPERIENCE }: Skiper80Props) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_EXPERIENCE;
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Track overall scroll progress inside this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Calculate current active index (0 to displayItems.length - 1)
  const activeFloat = useTransform(smoothProgress, [0, 1], [0, displayItems.length - 1]);

  const scrollToExperience = (idx: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const sectionTop = rect.top + scrollTop;
    const sectionHeight = rect.height - window.innerHeight;
    const targetY = sectionTop + (idx / Math.max(1, displayItems.length - 1)) * sectionHeight;

    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  return (
    /* Outer container: height = (items.length * 110vh) for ample scroll depth */
    <div
      ref={sectionRef}
      style={{ height: `${Math.max(2, displayItems.length) * 110}vh` }}
      className="relative w-full"
    >
      {/* Sticky Inner Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-6 py-8 md:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative">

          {/* Section Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="block w-6 h-px bg-white/30" />
                <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">04</span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Experience
              </h2>
            </div>

            {/* Desktop progress cue */}
            <div className="hidden lg:flex flex-col items-end gap-2">
              <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
                Scroll to explore ↓
              </span>
            </div>
          </div>

          {/* Split Layout: Left Stacked Cards + Right Title Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center min-h-[62vh]">

            {/* LEFT COLUMN: Stacked Cards Container */}
            <div className="lg:col-span-7 w-full relative h-[60vh] sm:h-[62vh] md:h-[65vh]">
              {displayItems.map((item, index) => (
                <ExperienceCard
                  key={item.id || index}
                  item={item}
                  index={index}
                  totalItems={displayItems.length}
                  scrollYProgress={smoothProgress}
                />
              ))}
            </div>

            {/* RIGHT COLUMN: Interactive Titles List with Real-Time Smooth Progress (Hidden on mobile, visible on tablet/laptop/PC) */}
            <div className="hidden sm:flex lg:col-span-5 flex-col space-y-4 lg:pl-4 justify-center">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-white/40 text-xs font-mono tracking-widest uppercase font-bold">MY EXPERIENCE</span>
                <span className="block w-32 h-px bg-white/20" />
              </div>

              <div className="space-y-3">
                {displayItems.map((item, idx) => (
                  <ExperienceNavTitle
                    key={item.id || idx}
                    item={item}
                    idx={idx}
                    activeFloat={activeFloat}
                    onClick={() => scrollToExperience(idx)}
                  />
                ))}
              </div>

              {/* Progress Bar & Counter */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-1.5 items-center">
                  {displayItems.map((_, idx) => (
                    <ExperienceProgressDot
                      key={idx}
                      idx={idx}
                      activeFloat={activeFloat}
                      onClick={() => scrollToExperience(idx)}
                    />
                  ))}
                </div>
                <span className="text-white/30 text-[10px] font-mono ml-2">scroll to advance ↓</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Skiper80ExperienceShowcase;
