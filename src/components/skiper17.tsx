"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

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
  images?: string[];
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
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop"
    ],
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
  
  // Resolve all images available for this project
  const allImages: string[] = (project.images && project.images.length > 0)
    ? project.images
    : project.image
    ? [project.image]
    : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop"];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Auto-play slides if multiple images
  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  const padIndex = String(index + 1).padStart(2, "0");
  const padTotal = String(totalCards).padStart(2, "0");

  const currentBgImage = allImages[activeImgIndex] || allImages[0];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen sticky top-0 flex items-center justify-center p-3 sm:p-4"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(4% + ${index * 16}px)`,
        }}
        className="relative w-full max-w-[1200px] h-[78vh] sm:h-[75vh] md:h-[76vh] rounded-[1.8rem] sm:rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl bg-zinc-900 p-4 sm:p-6 md:p-10 flex flex-col justify-between transform-gpu will-change-transform hover:border-white/40 transition-colors duration-300"
      >
        {/* Background Image Carousel with Smooth Fade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentBgImage}
            src={currentBgImage}
            alt={`${project.title} - Image ${activeImgIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover brightness-75 -z-10"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          />
        </AnimatePresence>

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none -z-10" />

        {/* Card Content Header */}
        <div className="flex items-center justify-between z-10 border-b border-white/15 pb-2.5 sm:pb-4 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-300 bg-black/70 px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 whitespace-nowrap">
              0{padIndex} / 0{padTotal}
            </span>
            {allImages.length > 1 && (
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-400/20 flex items-center gap-1 font-semibold whitespace-nowrap">
                <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {activeImgIndex + 1}/{allImages.length}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-zinc-400 font-medium hidden xs:inline">Scroll Stack</span>
        </div>

        {/* Multiple Images Carousel Controls (Positioned at top 35% so they never cover title) */}
        {allImages.length > 1 && (
          <div className="absolute top-[35%] inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none z-20 -translate-y-1/2">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="pointer-events-auto p-2 sm:p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="pointer-events-auto p-2 sm:p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md shadow-lg active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Card Content Footer */}
        <div className="z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl space-y-2 sm:space-y-3">
          
          {/* Multiple Image Thumbnail Indicator Bar */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
              {allImages.map((img, imgIdx) => (
                <button
                  key={imgIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIndex(imgIdx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeImgIndex === imgIdx
                      ? "w-6 sm:w-8 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Select image ${imgIdx + 1}`}
                />
              ))}
            </div>
          )}

          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {project.title}
          </h2>
          <p className="text-zinc-300 text-[11px] sm:text-xs md:text-sm font-light leading-relaxed max-w-4xl line-clamp-2 md:line-clamp-3">
            {project.description}
          </p>

          <div className="pt-2 sm:pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
            <div className="flex flex-wrap gap-1 sm:gap-1.5 max-w-2xl max-h-16 sm:max-h-none overflow-hidden">
              {tagsList.slice(0, 6).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/[0.08] border border-white/15 rounded-md sm:rounded-lg text-zinc-200 text-[10px] sm:text-xs font-mono font-medium whitespace-nowrap"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-black/70 border border-white/20 hover:border-white/50 rounded-lg sm:rounded-xl text-white text-[11px] sm:text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
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
                  className="px-3 py-1.5 bg-white text-black font-extrabold rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono flex items-center gap-1 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]"
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
  projects,
}: Skiper17Props) {
  const displayProjects = projects !== undefined ? projects : DEFAULT_PROJECTS;

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
