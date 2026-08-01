"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  image?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    title: "H-TRACKER (KHM_TRACKER)",
    category: "Flutter & Mobile",
    description: "Gamified habit, task, and goal-tracking app that turns daily productivity into an RPG-style game. Users earn XP, level up by completing habits, maintain streaks with visual heatmaps, unlock achievements, redeem custom rewards, and compete on leaderboards. Includes analytics dashboards, habit timers, and push notifications.",
    tags: "Flutter, Dart, Firebase, Firestore, Riverpod, GoRouter, Firebase Auth, Cloud Messaging",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "ServeSync — GPS Geofenced Workforce Marketplace",
    category: "Full-Stack System",
    description: "Enterprise multi-role platform with GPS geofencing, real-time socket tracking, automated booking engine, and JWT authentication. Engineered 14 business modules with offline-first state sync.",
    tags: "Next.js, TypeScript, PostgreSQL, Flutter, Socket.io, Tailwind CSS, Redis",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Boutique — Enterprise E-Commerce Platform",
    category: "Web Application",
    description: "Architected high-conversion full-stack store with payment webhooks integration, dynamic cart state management, zero-downtime database schema, and custom administrative telemetry dashboard.",
    tags: "React, Node.js, Express, PostgreSQL, Prisma, Stripe API, Redis",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Nexus AI — Autonomous Agent Platform",
    category: "AI & Systems Architecture",
    description: "Next-gen distributed AI orchestration pipeline connecting LLM function tools, vector search databases, real-time streaming sockets, and automated code review workflows.",
    tags: "TypeScript, Python, FastAPI, Next.js, LangChain, Pinecone, Tailwind",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
  },
];

export interface Skiper17Props {
  projects?: ProjectItem[];
}

function StackedCard({
  project,
  index,
  totalCards,
}: {
  project: ProjectItem;
  index: number;
  totalCards: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const tagsList = project.tags ? project.tags.split(",") : [project.category];
  const bgImageUrl = project.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop";

  const padIndex = String(index + 1).padStart(2, "0");
  const padTotal = String(totalCards).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      className="h-screen sticky top-0 flex items-center justify-center p-4"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(7% + ${index * 25}px)`,
        }}
        className="relative w-full max-w-[1200px] h-[72vh] md:h-[76vh] rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl bg-zinc-900 p-6 md:p-10 flex flex-col justify-between transform-gpu will-change-transform hover:border-white/40 transition-colors duration-300"
      >
        {/* Background Image with Dark Vignette */}
        <img
          src={bgImageUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover brightness-50 -z-10"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = "none";
          }}
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none -z-10" />

        {/* Card Content Header */}
        <div className="flex justify-between items-center z-10 border-b border-white/15 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 bg-black/70 px-3.5 py-1 rounded-full border border-white/10">
            0{padIndex} / 0{padTotal}
          </span>
          <span className="text-xs font-mono text-zinc-400 font-medium">Scroll Stack</span>
        </div>

        {/* Card Content Footer */}
        <div className="z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 md:p-6 rounded-2xl space-y-3">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {project.title}
          </h2>
          <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed max-w-4xl line-clamp-2 md:line-clamp-3">
            {project.description}
          </p>

          <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5 max-w-2xl">
              {tagsList.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 bg-white/[0.08] border border-white/15 rounded-lg text-zinc-200 text-xs font-mono font-medium"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-black/70 border border-white/20 hover:border-white/50 rounded-xl text-white text-xs font-mono font-semibold flex items-center gap-2 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white text-black font-extrabold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Skiper17ProjectCardStack({
  projects = DEFAULT_PROJECTS,
}: Skiper17Props) {
  const fetched = projects && projects.length > 0 ? projects : [];
  const existingTitles = new Set(fetched.map((p) => p.title.toLowerCase().trim()));
  const extraDefaults = DEFAULT_PROJECTS.filter(
    (d) => !existingTitles.has(d.title.toLowerCase().trim())
  );
  
  const displayProjects = [...fetched, ...extraDefaults];

  return (
    <div className="relative pb-[20vh]">
      {displayProjects.map((project, index) => (
        <StackedCard
          key={project.id || index}
          project={project}
          index={index}
          totalCards={displayProjects.length}
        />
      ))}
    </div>
  );
}

export default Skiper17ProjectCardStack;
