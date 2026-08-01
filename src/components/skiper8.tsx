"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Hello",          // English
  "Guten Tag",       // German
  "Bonjour",         // French
  "Ciao",            // Italian
  "Olá",             // Portuguese
  "नमस्ते",          // Hindi
  "வணக்கம்",          // Tamil
];

export interface Skiper8PreloaderProps {
  onComplete?: () => void;
}

export function Skiper8Preloader({ onComplete }: Skiper8PreloaderProps) {
  const [phase, setPhase] = useState<"words" | "signature" | "exit">("words");
  const [wordIndex, setWordIndex] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Step 1: Word cycling greetings animation
  useEffect(() => {
    if (phase !== "words") return;

    if (wordIndex === words.length - 1) {
      // Once "வணக்கம்" displays, pause 250ms then switch to SVG signature phase
      const timer = setTimeout(() => {
        setPhase("signature");
      }, 250);
      return () => clearTimeout(timer);
    }

    const timeout = setTimeout(() => {
      setWordIndex((prev) => prev + 1);
    }, 140);

    return () => clearTimeout(timeout);
  }, [wordIndex, phase]);

  // Step 2: SVG self-drawing signature animation
  useEffect(() => {
    if (phase !== "signature") return;
    const run = async () => {
      const { gsap } = await import("gsap");
      const paths = svgRef.current?.querySelectorAll<SVGPathElement>(".jeeva-stroke");
      if (!paths?.length) return;

      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
        p.style.opacity = "1";
      });

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.14,
        onComplete: () => {
          if (captionRef.current) {
            gsap.fromTo(
              captionRef.current,
              { opacity: 0, y: 10, letterSpacing: "0.5em" },
              { opacity: 1, y: 0, letterSpacing: "0.35em", duration: 0.8, ease: "power3.out" }
            );
          }
          // After drawing finishes, trigger exit to home page
          setTimeout(() => {
            setPhase("exit");
            if (onComplete) onComplete();
          }, 800);
        },
      });
    };

    run();
  }, [phase, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {phase !== "exit" && (
        <motion.div
          key="preloader"
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 text-white select-none overflow-hidden"
        >
          {/* Phase 1: Word cycling greetings */}
          {phase === "words" && (
            <motion.div
              key={words[wordIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.08, ease: "easeInOut" }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-neutral-100 flex items-center gap-4 font-sans"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span>{words[wordIndex]}</span>
            </motion.div>
          )}

          {/* Phase 2: SVG Self-Drawing JEEVA'S PORTFOLIO signature */}
          {phase === "signature" && (
            <div className="flex flex-col items-center justify-center text-center gap-8 w-full px-4">
              <svg
                ref={svgRef}
                viewBox="0 0 840 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "clamp(300px, 85vw, 920px)", height: "auto", overflow: "visible" }}
                className="mx-auto"
              >
                {/* J */}
                <path className="jeeva-stroke" d="M 25 15 L 25 70 Q 25 88 12 88 Q 4 88 4 82" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* E */}
                <path className="jeeva-stroke" d="M 45 15 L 45 88 M 45 15 L 75 15 M 45 51 L 68 51 M 45 88 L 75 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* E2 */}
                <path className="jeeva-stroke" d="M 95 15 L 95 88 M 95 15 L 125 15 M 95 51 L 118 51 M 95 88 L 125 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* V */}
                <path className="jeeva-stroke" d="M 145 15 L 175 88 L 205 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* A */}
                <path className="jeeva-stroke" d="M 225 88 L 255 15 L 285 88 M 235 62 L 275 62" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* Apostrophe ' */}
                <path className="jeeva-stroke" d="M 298 15 L 294 32" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" style={{ opacity: 0 }} />
                {/* S */}
                <path className="jeeva-stroke" d="M 345 25 Q 315 15 315 38 Q 315 55 345 62 Q 345 88 315 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* P */}
                <path className="jeeva-stroke" d="M 380 15 L 380 88 M 380 15 L 402 15 Q 415 15 415 33 Q 415 51 402 51 L 380 51" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* O */}
                <path className="jeeva-stroke" d="M 450 15 Q 430 15 430 51.5 Q 430 88 450 88 Q 470 88 470 51.5 Q 470 15 450 15 Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* R */}
                <path className="jeeva-stroke" d="M 490 15 L 490 88 M 490 15 L 512 15 Q 525 15 525 33 Q 525 51 512 51 L 490 51 M 508 51 L 525 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* T */}
                <path className="jeeva-stroke" d="M 545 15 L 585 15 M 565 15 L 565 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* F */}
                <path className="jeeva-stroke" d="M 605 15 L 605 88 M 605 15 L 635 15 M 605 51 L 628 51" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* O2 */}
                <path className="jeeva-stroke" d="M 675 15 Q 655 15 655 51.5 Q 655 88 675 88 Q 695 88 695 51.5 Q 695 15 675 15 Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* L */}
                <path className="jeeva-stroke" d="M 715 15 L 715 88 L 745 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* I */}
                <path className="jeeva-stroke" d="M 765 15 L 765 88" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
                {/* O3 */}
                <path className="jeeva-stroke" d="M 805 15 Q 785 15 785 51.5 Q 785 88 805 88 Q 825 88 825 51.5 Q 825 15 805 15 Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
              </svg>

              {/* Portfolio caption */}
              <p
                ref={captionRef}
                style={{
                  opacity: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(0.65rem, 1.5vw, 0.9rem)",
                  letterSpacing: "0.45em",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                Jeeva's Portfolio &nbsp;·&nbsp; Full-Stack &amp; Systems Engineer
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Skiper8Preloader;
