"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  Download, Send, ExternalLink, Code2, Globe,
  GitBranch, ArrowUpRight, CheckCircle, ChevronDown,
  Mail, MapPin, Trophy, Award, GraduationCap, Compass, Calendar, Building, Terminal
} from "lucide-react";
import ImageCursorTrail from "@/components/skiper18";
import Skiper6HoverMember from "@/components/skiper6";
import SkiperSkillsMatrix from "@/components/SkiperSkillsMatrix";
import Skiper16CardStackScroll from "@/components/skiper16";
import Skiper28PerspectiveScroll from "@/components/skiper28";
import Skiper80ExperienceShowcase from "@/components/skiper80";
import Skiper17ProjectCardStack from "@/components/skiper17";
import Skiper52Certifications from "@/components/skiper52";
import Skiper8Preloader from "@/components/skiper8";


// ─── Inline Brand SVG Icons ──────────────────────────────
const Github = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────
interface AboutData { title?: string; bio?: string; githubUsername?: string; leetcodeUsername?: string; location?: string; email?: string; linkedinUrl?: string; instagramUrl?: string; avatarUrl?: string; }
interface Project { id: string; title: string; description: string; techStack: string; liveUrl?: string; githubUrl?: string; imageUrl?: string; featured?: boolean; }
interface Skill { id: string; name: string; category: string; proficiency: number; }
interface Experience { id: string; role: string; company: string; period: string; description: string; location?: string; skillsUsed?: string; }
interface Education { id: string; degree: string; institution: string; period: string; grade?: string; }
interface Achievement { id: string; title: string; platform: string; stats: string; linkUrl?: string; }
interface Certification { id: string; title: string; issuer: string; issueDate: string; credentialId?: string; credentialUrl?: string; imageUrl?: string; }
interface Resume { fileUrl: string; fileName: string; }

// ─── Loading Screen with Word Cycling Preloader ───
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return <Skiper8Preloader onComplete={onComplete} />;
}

// ─── Utility: Number counter animation ───────────────────
function CountUp({ target, suffix = "", trigger }: { target: number; suffix?: string; trigger: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (1800 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, trigger]);
  return <>{count}{suffix}+</>;
}

// ─── Empty State ─────────────────────────────────────────
function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center reveal">
      <p className="text-white/20 text-sm">{text}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════
export default function Home() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [githubStats, setGithubStats] = useState<any>(null);
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);

  // ─── Fetch data ─────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [abRes, pRes, sRes, eRes, edRes, aRes, cRes, rRes] = await Promise.all([
          fetch("/api/about"), fetch("/api/projects"), fetch("/api/skills"),
          fetch("/api/experience"), fetch("/api/education"),
          fetch("/api/achievements"), fetch("/api/certifications"), fetch("/api/resume"),
        ]);
        const abData = abRes.ok ? await abRes.json() : null;
        if (abData) setAbout(abData);

        const ghUser = abData?.githubUsername || "M-Jeevanantham";
        const lcUser = abData?.leetcodeUsername || "M-Jeevanantham";

        fetch(`/api/github-stats?username=${ghUser}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d && setGithubStats(d))
          .catch(() => null);

        fetch(`/api/leetcode-stats?username=${lcUser}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d && setLeetcodeStats(d))
          .catch(() => null);
        if (pRes.ok) setProjects(await pRes.json());
        if (sRes.ok) setSkills(await sRes.json());
        if (eRes.ok) setExperience(await eRes.json());
        if (edRes.ok) setEducation(await edRes.json());
        if (aRes.ok) setAchievements(await aRes.json());
        if (cRes.ok) setCertifications(await cRes.json());
        if (rRes.ok) setResume(await rRes.json());
      } catch (err) { console.error(err); }
      finally { setDataLoaded(true); }
    };
    fetchData();
  }, []);

  // ─── Show content only after both loading screen done + data ready ──
  const isReady = loadingDone && dataLoaded;

  // Reset scroll to top (#hero) immediately when loader completes
  useEffect(() => {
    if (!isReady) return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [isReady]);

  // ─── Custom Cursor ───────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    let fx = 0, fy = 0;
    let rafId: number;
    const move = (e: MouseEvent) => {
      if (cursorRef.current) { cursorRef.current.style.left = `${e.clientX}px`; cursorRef.current.style.top = `${e.clientY}px`; }
      fx += (e.clientX - fx) * 0.1;
      fy += (e.clientY - fy) * 0.1;
    };
    const animate = () => {
      if (followerRef.current) { followerRef.current.style.left = `${fx}px`; followerRef.current.style.top = `${fy}px`; }
      fx += (parseFloat(cursorRef.current?.style.left || "0") - fx) * 0.1;
      fy += (parseFloat(cursorRef.current?.style.top || "0") - fy) * 0.1;
      rafId = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    rafId = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(rafId); };
  }, [isReady]);

// ─── Interactive Effects (Spotlight, 3D Tilt, Magnetic, Cursor Labels) ───
  useEffect(() => {
    if (!isReady) return;
    const cleanupFns: Array<() => void> = [];

    // 1. Spotlight Torch Effect
    document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((el) => {
      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
      };
      el.addEventListener("mousemove", handleMove);
      cleanupFns.push(() => el.removeEventListener("mousemove", handleMove));
    });

    // 2. 3D Mouse Tilt Effect
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const strength = parseFloat(el.dataset.tiltStrength || "12");
      const handleMove = async (e: MouseEvent) => {
        const { gsap } = await import("gsap");
        const rect = el.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        gsap.to(el, {
          rotateX: -ny * strength,
          rotateY: nx * strength,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const handleLeave = async () => {
        const { gsap } = await import("gsap");
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
      };
      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      cleanupFns.push(() => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
      });
    });

    // 3. Magnetic Hover Pull Buttons
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength || "0.35");
      const handleMove = async (e: MouseEvent) => {
        const { gsap } = await import("gsap");
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
      };
      const handleLeave = async () => {
        const { gsap } = await import("gsap");
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      };
      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      cleanupFns.push(() => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
      });
    });

    // 4. Cursor Morph Labels
    document.querySelectorAll<HTMLElement>("[data-cursor]").forEach((el) => {
      const label = el.dataset.cursor || "";
      const handleEnter = async () => {
        const { gsap } = await import("gsap");
        if (cursorRef.current) {
          cursorRef.current.setAttribute("data-label", label);
          cursorRef.current.classList.add("cursor--label");
          gsap.to(cursorRef.current, { width: 70, height: 70, duration: 0.3, ease: "power2.out" });
        }
      };
      const handleLeave = async () => {
        const { gsap } = await import("gsap");
        if (cursorRef.current) {
          cursorRef.current.removeAttribute("data-label");
          cursorRef.current.classList.remove("cursor--label");
          gsap.to(cursorRef.current, { width: 12, height: 12, duration: 0.3, ease: "power2.out" });
        }
      };
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      cleanupFns.push(() => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, [isReady]);

  // ─── GSAP Master Animation Init ──────────────────────
  useEffect(() => {
    if (!isReady) return;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ── HERO: Camera Zoom-In Entrance + Char Stagger ───────────
      gsap.fromTo("#hero-zoom-container",
        { scale: 1.05, opacity: 1 },
        { scale: 1.0, opacity: 1, duration: 1.0, ease: "power3.out", clearProps: "transform" }
      );
      gsap.fromTo(".hero-char",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.02, delay: 0.1, clearProps: "opacity,transform" }
      );
      gsap.fromTo(".hero-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.4, clearProps: "opacity,transform" }
      );
      // Parallax on hero content
      gsap.to(".hero-content", {
        y: 120,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
      });


      // ── ABOUT: Clip-path horizontal wipe ────────────────
      if (document.querySelector(".about-num")) {
        gsap.fromTo(".about-num",
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power4.out",
            scrollTrigger: { trigger: "#about", start: "top 75%" } }
        );
      }
      if (document.querySelector(".about-line")) {
        gsap.fromTo(".about-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: "power4.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: "#about", start: "top 70%" } }
        );
      }
      if (document.querySelector(".about-text")) {
        gsap.fromTo(".about-text",
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.2, ease: "power4.inOut",
            scrollTrigger: { trigger: "#about", start: "top 70%" } }
        );
      }
      if (document.querySelector(".about-links")) {
        const links = document.querySelectorAll(".about-links > *");
        if (links.length > 0) {
          gsap.fromTo(links,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
              scrollTrigger: { trigger: ".about-links", start: "top 85%" } }
          );
        }
      }

      // ── EDUCATION: Smooth Scroll Reveal ──
      if (document.querySelector(".edu-title")) {
        gsap.fromTo(".edu-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: "#education", start: "top 85%" } }
        );
      }
      // Simple line reveal — no scrub to avoid jank
      const eduLine = document.querySelector<HTMLElement>(".edu-journey-line");
      if (eduLine) {
        gsap.fromTo(eduLine,
          { scaleY: 0 },
          {
            scaleY: 1, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: "#education", start: "top 80%" }
          }
        );
      }
      document.querySelectorAll<HTMLElement>(".edu-card").forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" }
          }
        );
      });

      // ── SKILLS: Ultra-Smooth Bottom-to-Top Scroll Move Animation ──
      const skillsSection = document.querySelector("#skills");
      if (skillsSection) {
        gsap.fromTo(skillsSection,
          { opacity: 0, y: 120, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#skills",
              start: "top 85%",
              end: "top 25%",
              scrub: 1.2,
            }
          }
        );
      }
      // Skills progress bars
      if (skillsRef.current) {
        ScrollTrigger.create({
          trigger: skillsRef.current,
          start: "top 75%",
          onEnter: () => {
            setSkillsVisible(true);
            setTimeout(() => {
              document.querySelectorAll<HTMLElement>(".progress-fill").forEach(bar => {
                const w = bar.getAttribute("data-width") || "0";
                bar.style.transform = `scaleX(${parseFloat(w) / 100})`;
              });
            }, 150);
          },
        });
      }

      // ── EXPERIENCE: Scrollytelling Glowing Laser Timeline ───
      if (document.querySelector(".exp-title")) {
        gsap.fromTo(".exp-title",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: "#experience", start: "top 80%" } }
        );
      }
      const expItems = document.querySelectorAll<HTMLElement>(".exp-item");
      expItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: -50, scale: 0.97 },
          { opacity: 1, x: 0, scale: 1, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" }
          }
        );
      });
      // Timeline line draw
      if (document.querySelector(".timeline-vert")) {
        gsap.fromTo(".timeline-vert",
          { scaleY: 0 },
          { scaleY: 1, duration: 2, ease: "power2.inOut", transformOrigin: "top",
            scrollTrigger: { trigger: "#experience", start: "top 70%", end: "bottom 80%", scrub: true }
          }
        );
      }

      // ── ACHIEVEMENTS: Elastic Bounce Drop ───────────────
      gsap.fromTo(".ach-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: "#achievements", start: "top 80%" } }
      );
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 75%",
          onEnter: () => setStatsVisible(true),
        });
      }
      const achCards = document.querySelectorAll<HTMLElement>(".ach-stat");
      achCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, scale: 0.5, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.6)",
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" }
          }
        );
      });

      // ── PROJECTS: Curtain Lift & Parallax Reveal ───────────
      gsap.fromTo(".proj-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: "#projects", start: "top 80%" } }
      );
      const projCards = document.querySelectorAll<HTMLElement>(".proj-card");
      projCards.forEach((card, i) => {
        gsap.fromTo(card,
          { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 40 },
          { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: 1, ease: "power4.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" }
          }
        );
      });

      // ── CERTIFICATIONS: 3D Horizontal Flip ─────────────────
      gsap.fromTo(".cert-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: "#certifications", start: "top 80%" } }
      );
      const certCards = document.querySelectorAll<HTMLElement>(".cert-card");
      certCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, rotateY: -90, scale: 0.8 },
          { opacity: 1, rotateY: 0, scale: 1, duration: 1, ease: "back.out(1.3)",
            delay: i * 0.1,
            scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" }
          }
        );
      });

      // ── CONTACT: Simultaneous reveal (no stagger delay so fields appear together) ──
      gsap.fromTo(".contact-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: "#contact", start: "top 85%" } }
      );
      gsap.fromTo(".contact-form-wrap",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: "#contact", start: "top 75%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".contact-info-panel",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: "#contact", start: "top 75%", toggleActions: "play none none none" } }
      );
    };
    init();
  }, [isReady]);

  // ─── Contact form ────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setSentSuccess(true); setFormData({ name: "", email: "", message: "" }); }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const skillsByCategory = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#achievements", label: "Achievements" },
    { href: "#certifications", label: "Certifications" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80 });
  };

  return (
    <>
      {/* Loading Screen — always rendered until dismissed */}
      {!loadingDone && <LoadingScreen onComplete={() => setLoadingDone(true)} />}

      {/* Custom Cursor */}
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
      <div className="scanline" />

      <div id="hero-zoom-container" className={`custom-cursor-active relative bg-black text-white min-h-screen overflow-x-clip transition-opacity duration-700 ${isReady ? "opacity-100" : "opacity-0"}`}
        style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Nav bar removed by request for 100% pure scroll interaction */}

        {/* ═══════════════════════════════════════════════════
            §1 HERO — Cosmic Violet / Blue Aura
        ══════════════════════════════════════════════════════ */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          <div className="hero-content relative z-10 text-center px-6 max-w-6xl mx-auto">
            <div className="hero-fade mb-8 inline-flex items-center gap-3">
              <span className="block w-8 h-px bg-white/25" />
              <span className="text-zinc-400 text-[10px] font-semibold tracking-[0.35em] uppercase">
                {about?.title || "Software Development Engineer"}
              </span>
              <span className="block w-8 h-px bg-white/25" />
            </div>

            <h1 style={{ fontSize: "clamp(3rem, 10vw, 9rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.92, fontFamily: "'Space Grotesk', sans-serif", perspective: "600px" }}
              className="mb-6 text-zinc-100">
              {["Full\u2011Stack", " ", "& Systems"].map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden">
                  {word === " " ? "\u00A0" : word.split("").map((char, ci) => (
                    <span key={ci} className="hero-char inline-block text-zinc-200/90">{char === " " ? "\u00A0" : char}</span>
                  ))}
                  {wi < 2 && <br />}
                </span>
              ))}
            </h1>

            <p className="hero-fade text-zinc-400 max-w-xl mx-auto text-base md:text-lg font-normal leading-relaxed mb-12 line-clamp-2">
              {about?.bio || "Architecting resilient backend systems and modern web experiences."}
            </p>

            <div className="hero-fade flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => scrollToSection("#contact")} data-magnetic data-magnetic-strength="0.4"
                className="px-8 py-3.5 bg-zinc-100 text-black text-sm font-bold rounded-full hover:bg-white active:scale-95 transition-all flex items-center gap-2">
                Get in touch <ArrowUpRight className="w-4 h-4" />
              </button>
              {resume && (
                <a href={resume.fileUrl} download={resume.fileName} target="_blank" rel="noreferrer" data-magnetic data-magnetic-strength="0.4"
                  className="px-8 py-3.5 border border-white/15 text-zinc-400 hover:text-zinc-200 hover:border-white/40 text-sm font-medium rounded-full transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" /> Resume
                </a>
              )}
            </div>

            <div className="hero-fade mt-20 flex flex-col items-center gap-3">
              <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
              <ChevronDown className="w-4 h-4 text-zinc-600 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §2 ABOUT — Emerald Editorial Reveal
        ══════════════════════════════════════════════════════ */}
        <section id="about" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="about-num relative mb-12 lg:mb-20">
              <span style={{ fontSize: "clamp(6rem, 18vw, 16rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "-0.05em", userSelect: "none", position: "absolute", top: "-25%", left: "-2%" }}>
                01
              </span>
              <div className="relative z-10 pt-10">
                <div className="inline-flex items-center gap-3 mb-3">
                  <span className="block w-6 h-px bg-white/30" />
                  <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">About</span>
                </div>
                <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Who I am.
                </h2>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              {/* Photo */}
              <div data-tilt data-spotlight className="lg:col-span-5 relative w-full aspect-square md:aspect-[4/5] lg:aspect-auto lg:h-[540px] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/20 shadow-2xl group bg-[#0d0d14]">
                <img 
                  src={(about?.avatarUrl && about.avatarUrl.trim() !== "") ? about.avatarUrl : "/profile Image.jpeg"} 
                  alt="Jeevanantham M" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  onError={(e) => { 
                    e.currentTarget.src = "/profile Image.jpeg"; 
                  }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 font-mono text-xs text-white/80">
                  <p className="font-bold text-white">Jeevanantham M</p>
                  <p className="text-white/50 text-[11px]">Software Development Engineer</p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="lg:col-span-7 space-y-8 lg:pt-2">
                <p className="about-text text-white/80 leading-relaxed text-base md:text-lg font-normal whitespace-pre-line">
                  {(about?.bio || `I’m Jeevanantham M — a Software Development Engineer & Full-Stack Systems Builder.

I specialize in building scalable web applications, robust REST APIs, high-performance microservices, and modern user interfaces.

 Full-Stack Architecture: Experienced in Next.js, React, Node.js, Express, TypeScript, PostgreSQL, and Tailwind CSS.
 Product Engineering: Passionate about clean code, smooth animations, database optimizations, and seamless user experiences.
 Systems & Cloud: Skilled in building RESTful APIs, authentication workflows, CI/CD pipelines, and microservice architectures.`)
                    .replace(/[🏛🏛️]/g, "")
                    .replace(/Technical Leadership & Architecture:/g, " Technical Leadership & Architecture:")
                  }
                </p>
                <div className="about-line h-px bg-white/15 w-full" style={{ transformOrigin: "left" }} />
                
                <div className="about-links flex flex-wrap gap-4 pt-2">
                  <a href={`https://github.com/${about?.githubUsername || "M-Jeevanantham"}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-5 py-3 rounded-full bg-white/[0.04] transition-all">
                    <GitBranch className="w-4 h-4 text-purple-400" /> GitHub Profile
                  </a>
                  <a href={`https://leetcode.com/${about?.leetcodeUsername || "M-Jeevanantham"}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-5 py-3 rounded-full bg-white/[0.04] transition-all">
                    <Trophy className="w-4 h-4 text-yellow-400" /> LeetCode Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §3 EDUCATION — Vertical Journey Map Timeline
        ══════════════════════════════════════════════════════ */}
        <section id="education" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="edu-title flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
              <div>
                <div className="inline-flex items-center gap-3 mb-3">
                  <span className="block w-6 h-px bg-white/30" />
                  <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">02</span>
                </div>
                <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Education Journey
                </h2>
              </div>
              <p className="text-white/30 text-xs font-mono tracking-widest uppercase">
                My Academic Path
              </p>
            </div>

            {education.length === 0 ? <EmptyState text="Add education via the Admin Panel." /> : (
              <div className="relative">
                {/* Vertical connecting line (the journey path) — glows on scroll */}
                <div
                  className="edu-journey-line absolute left-6 md:left-8 top-0 bottom-0 w-px"
                  style={{
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.15))",
                    boxShadow: "0 0 8px 2px rgba(255,255,255,0.15)",
                    transformOrigin: "top center",
                  }}
                />

                <div className="space-y-0">
                  {education.map((edu, i) => (
                    <div key={edu.id} className="edu-card relative pl-16 md:pl-20 pb-16 last:pb-0">

                      {/* Milestone node dot on the path */}
                      <div className="absolute left-4 md:left-[26px] top-2 flex flex-col items-center">
                        <div className="edu-milestone-dot w-4 h-4 rounded-full bg-black border-2 border-white/60 flex items-center justify-center transition-all duration-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        {/* Connector tick line to card */}
                        <div className="w-px flex-1 bg-white/10 mt-2" style={{ minHeight: "calc(100% - 24px)" }} />
                      </div>

                      {/* Step label (floating left) */}
                      <div className="absolute left-[-28px] md:left-[-20px] top-0 text-white/10 text-[10px] font-black tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif", writingMode: "vertical-rl" }}>
                        0{i + 1}
                      </div>

                      {/* Card */}
                      <div
                        data-spotlight
                        className="bg-[#0a0a0a] border border-white/10 hover:border-white/25 rounded-2xl p-7 md:p-9 transition-all duration-300 group cursor-default shadow-lg relative overflow-hidden"
                      >
                        {/* Ghost large period number */}
                        <div className="absolute bottom-[-1.5rem] right-3 text-white/[0.04] font-black select-none pointer-events-none"
                          style={{ fontSize: "clamp(4rem, 8vw, 7rem)", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                          {edu.period?.split("–")[0]?.split("-")[0]?.trim() || String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Period + Grade badges */}
                        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 text-white/40 text-xs font-mono border border-white/10 px-3 py-1.5 rounded-full bg-white/[0.03]">
                            <Calendar className="w-3 h-3 text-white/50" /> {edu.period}
                          </span>
                          {edu.grade && (
                            <span className="text-white text-xs font-bold px-3 py-1.5 bg-white/10 border border-white/20 rounded-full">
                              {edu.grade}
                            </span>
                          )}
                        </div>

                        {/* Degree */}
                        <h3 className="text-white font-extrabold text-xl md:text-3xl mb-3 leading-tight group-hover:text-white/90 transition-colors"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {edu.degree}
                        </h3>

                        {/* Institution + Location */}
                        <p className="text-white/65 font-semibold text-sm mb-1 flex items-center gap-2">
                          <Building className="w-4 h-4 text-white/40 flex-shrink-0" /> {edu.institution}
                        </p>
                        {(edu as any).location && (
                          <p className="text-white/35 text-xs italic flex items-center gap-1 mb-4">
                            <MapPin className="w-3 h-3 text-white/35 flex-shrink-0" /> {(edu as any).location}
                          </p>
                        )}

                        {/* Description */}
                        {(edu as any).description && (
                          <div className="border-t border-white/8 pt-4 mt-4">
                            <p className="text-white/45 text-xs md:text-sm leading-relaxed">
                              {(edu as any).description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Journey end cap */}
                <div className="relative pl-16 md:pl-20 pt-4">
                  <div className="absolute left-4 md:left-[26px] top-4 w-4 h-4 rounded-full border border-white/15 bg-black flex items-center justify-center">
                    <GraduationCap className="w-2.5 h-2.5 text-white/40" />
                  </div>
                  <p className="text-white/20 text-xs font-mono uppercase tracking-widest">Journey Continues...</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §4 SKILLS — Skiper UI 7-Logo Big Text Reveal Matrix
        ══════════════════════════════════════════════════════ */}
        <section id="skills" className="py-24 px-6 border-t border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
          <div className="max-w-6xl mx-auto w-full space-y-8">
            {/* Header */}
            <div className="skills-title flex flex-col items-center text-center space-y-3">
              <div className="inline-flex items-center gap-3">
                <span className="block w-6 h-px bg-white/30" />
                <span className="text-white/40 text-[11px] font-semibold tracking-[0.3em] uppercase">03</span>
                <span className="block w-6 h-px bg-white/30" />
              </div>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, letterSpacing: "-0.03em" }}>
                Skills Matrix
              </h2>
            </div>

            {/* Skiper UI 7-Logo Big Text Reveal connected to Backend Database */}
            <SkiperSkillsMatrix skills={skills} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §5 EXPERIENCE — Skiper80 Interactive Experience Showcase
        ══════════════════════════════════════════════════════ */}
        <section id="experience" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="exp-title flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="block w-6 h-px bg-white/30" />
                  <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">04</span>
                </div>
                <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Experience
                </h2>
              </div>
              <p className="hidden lg:block text-white/40 text-xs font-mono uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
                Skiper80 Interactive Showcase ✦
              </p>
            </div>

            {/* Skiper80 Interactive Experience Showcase connected to Backend Database */}
            <Skiper80ExperienceShowcase items={experience} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §6 ACHIEVEMENTS — Neon Cyan & Gold Room
        ══════════════════════════════════════════════════════ */}
        <section id="achievements" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="ach-title flex items-end justify-between mb-20">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="block w-6 h-px bg-white/30" />
                  <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">05</span>
                </div>
                <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Achievements
                </h2>
              </div>
            </div>

            {/* Big stat panels */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {[
                { label: "LeetCode Solved", value: leetcodeStats?.totalSolved ?? 0, link: about?.leetcodeUsername ? `https://leetcode.com/${about.leetcodeUsername}` : undefined },
                { label: "GitHub Repositories", value: githubStats?.publicRepos ?? 0, link: about?.githubUsername ? `https://github.com/${about.githubUsername}` : undefined },
                { label: "Projects Built", value: projects.length || 0 },
              ].map((stat, i) => (
                <div key={i} data-spotlight data-tilt className="ach-stat border border-white/8 rounded-2xl p-8 md:p-10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group cursor-default">
                  <p className="text-white/25 text-[10px] font-semibold tracking-[0.3em] uppercase mb-8">{stat.label}</p>
                  <div>
                    <p style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color: "white" }}>
                      <CountUp target={stat.value} suffix="" trigger={statsVisible} />
                    </p>
                    {stat.link && (
                      <a href={stat.link} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-5 text-white/25 hover:text-white/70 text-xs font-medium tracking-wide transition-colors group-hover:text-white/50">
                        View Profile <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Live Stats: GitHub + LeetCode in IDE Terminal Glass Cards ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

              {/* GitHub IDE Terminal Glass Card */}
              <div className="bg-[#0a0b10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-xs md:text-sm">
                <div className="bg-[#12131a] border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-white/40 text-xs font-mono">root@portfolio:~/github</span>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>GitHub Developer Profile</p>
                        {githubStats?.username && <p className="text-emerald-400 text-xs font-mono">@{githubStats.username}</p>}
                      </div>
                    </div>
                    {githubStats && (
                      <span className="text-[10px] font-mono text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYNCED
                      </span>
                    )}
                  </div>

                  {githubStats ? (
                    <div className="space-y-3 font-mono text-xs md:text-sm">
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">repos</span> = <span className="text-yellow-300">{githubStats.publicRepos}</span>;</p>
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">total_stars</span> = <span className="text-yellow-300">{githubStats.totalStars}</span>;</p>
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">followers</span> = <span className="text-yellow-300">{githubStats.followers}</span>;</p>
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">pushes_90d</span> = <span className="text-yellow-300">{githubStats.recentPushes}</span>;</p>
                      {githubStats.topLanguages?.length > 0 && (
                        <p><span className="text-cyan-300">languages</span> = [{githubStats.topLanguages.map((l: any) => `"${l.lang}"`).join(', ')}];</p>
                      )}
                      <a href={githubStats.profileUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 pt-2 text-white/40 hover:text-white transition-colors link-underline">
                        <span>Execute git clone / profile →</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white/30 text-xs font-mono py-6">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Fetching GitHub API payload...
                    </div>
                  )}
                </div>
              </div>

              {/* LeetCode IDE Terminal Glass Card */}
              <div className="bg-[#0a0b10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-xs md:text-sm">
                <div className="bg-[#12131a] border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-white/40 text-xs font-mono">root@portfolio:~/leetcode</span>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <Code2 className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LeetCode Stats Engine</p>
                        {leetcodeStats?.username && <p className="text-yellow-400 text-xs font-mono">@{leetcodeStats.username}</p>}
                      </div>
                    </div>
                    {leetcodeStats && (
                      <span className="text-[10px] font-mono text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>

                  {leetcodeStats ? (
                    <div className="space-y-3 font-mono text-xs md:text-sm">
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">total_solved</span> = <span className="text-emerald-300">{leetcodeStats.totalSolved}</span>;</p>
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">global_rank</span> = <span className="text-yellow-300">"{leetcodeStats.ranking ? `#${leetcodeStats.ranking.toLocaleString()}` : "Top Tier"}"</span>;</p>
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">active_days</span> = <span className="text-yellow-300">{leetcodeStats.totalActiveDays}</span>;</p>
                      <p><span className="text-purple-400">const</span> <span className="text-cyan-300">current_streak</span> = <span className="text-emerald-300">"{leetcodeStats.streak} Days"</span>;</p>

                      <div className="pt-2">
                        <p className="text-white/40 mb-2">// Problem Difficulty Breakdown</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-emerald-400 font-bold">Easy: {leetcodeStats.easySolved}</div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg text-yellow-400 font-bold">Medium: {leetcodeStats.mediumSolved}</div>
                          <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-red-400 font-bold">Hard: {leetcodeStats.hardSolved}</div>
                        </div>
                      </div>

                      <a href={leetcodeStats.profileUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 pt-2 text-white/40 hover:text-white transition-colors link-underline">
                        <span>View LeetCode Profile →</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white/30 text-xs font-mono py-6">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Querying LeetCode GraphQL...
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Custom Achievements configured in Admin Panel */}
            {achievements.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">// Verified Platform Milestones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="bg-[#0a0b10]/95 backdrop-blur-xl border border-white/10 hover:border-white/25 rounded-2xl p-6 flex items-start justify-between gap-4 transition-all shadow-lg font-mono">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-emerald-400 border border-emerald-400/30 bg-emerald-400/5 px-2 py-0.5 rounded-full uppercase font-mono">{ach.platform}</span>
                        </div>
                        <h4 className="text-white font-bold text-base font-sans mb-1">{ach.title}</h4>
                        <p className="text-white/50 text-xs font-mono">{ach.stats}</p>
                      </div>
                      {ach.linkUrl && (
                        <a href={ach.linkUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-colors p-1">
                          <ArrowUpRight className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §7 PROJECTS — Skiper17 GSAP Scroll Card Stack (Full Screen Sticky Stacking)
        ══════════════════════════════════════════════════════ */}
        <section id="projects" className="pt-16 px-4 sm:px-8 md:px-12 border-t border-white/5 relative w-full">
          <div className="w-full">
            {/* Header */}
            <div className="pb-12 w-full">
              <div className="proj-title flex items-end justify-between">
                <div>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="block w-6 h-px bg-white/30" />
                    <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">06</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    Projects
                  </h2>
                </div>
                <p className="hidden lg:block text-white/40 text-xs font-mono uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
                  Skiper17 GSAP Scroll Stack ✦
                </p>
              </div>
            </div>

            {/* Skiper17 Card Stack connected to Backend Database */}
            <Skiper17ProjectCardStack
              projects={projects.map((p) => ({
                id: p.id,
                title: p.title,
                category: p.techStack ? p.techStack.split(",")[0] : "Full-Stack Project",
                description: p.description,
                tags: p.techStack,
                githubUrl: p.githubUrl,
                liveUrl: p.liveUrl,
                featured: p.featured,
                image: p.imageUrl,
              }))}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §8 CERTIFICATIONS — 3D Flip Showcase
        ══════════════════════════════════════════════════════ */}
        <section id="certifications" className="py-24 px-6 border-t border-white/5 relative w-full">
          <div className="max-w-7xl mx-auto">
            <div className="cert-title flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="block w-6 h-px bg-white/30" />
                  <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">07</span>
                </div>
                <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Certifications
                </h2>
              </div>
              <p className="hidden lg:block text-white/40 text-xs font-mono uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
                Skiper52 3D Perspective Showcase ✦
              </p>
            </div>

            <Skiper52Certifications
              certifications={certifications.map((c) => ({
                id: c.id,
                title: c.title,
                issuer: c.issuer,
                issueDate: c.issueDate,
                credentialId: c.credentialId,
                credentialUrl: c.credentialUrl,
                imageUrl: c.imageUrl,
              }))}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            §9 CONTACT — Clean Layout with Social Links
        ══════════════════════════════════════════════════════ */}
        <section id="contact" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-20 items-start">

              {/* Left Column: Form */}
              <div>
                <div className="contact-title mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="block w-6 h-px bg-white/30" />
                    <span className="text-white/30 text-[10px] font-semibold tracking-[0.3em] uppercase">08</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                    Let's talk.
                  </h2>
                  <p className="text-white/45 text-base md:text-lg font-light mt-4 max-w-md leading-relaxed">
                    A project, opportunity, or just a hello — I'm all ears.
                  </p>
                </div>

                {/* Form — all fields in one block, no GSAP stagger */}
                <div className="contact-form-wrap">
                  {sentSuccess ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center border border-white/10 rounded-2xl bg-white/[0.02]">
                      <CheckCircle className="w-12 h-12 text-emerald-400" />
                      <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Message Sent!</h3>
                      <p className="text-white/45 text-sm">I'll get back to you within 24 hours.</p>
                      <button onClick={() => setSentSuccess(false)} className="mt-4 text-white/40 hover:text-white text-xs underline transition-colors">Send another →</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/40 text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">Your Name</label>
                          <input type="text" required value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Jane Doe" className="input-minimal" />
                        </div>
                        <div>
                          <label className="block text-white/40 text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">Email Address</label>
                          <input type="email" required value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="jane@company.com" className="input-minimal" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/40 text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">Message</label>
                        <textarea required rows={5} value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Hey Jeeva, let's work together..."
                          className="input-minimal resize-none" />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/8">
                        <p className="text-white/20 text-xs font-mono">// Direct inbox gateway</p>
                        <button type="submit" disabled={sending} data-magnetic data-cursor="SEND"
                          className="flex items-center gap-2.5 px-8 py-3.5 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-40">
                          {sending ? "Sending..." : <><span>Send Message</span><Send className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: Info + Social Links */}
              <div className="contact-info-panel lg:sticky lg:top-24 space-y-4">

                {/* Status card */}
                <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">Available for work</span>
                  </div>
                  <div className="space-y-3">
                    {about?.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-white/25 flex-shrink-0" />
                        <span className="text-white/60 text-sm">{about.location}</span>
                      </div>
                    )}
                    {about?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-white/25 flex-shrink-0" />
                        <a href={`mailto:${about.email}`} className="text-white/60 hover:text-white text-sm transition-colors">{about.email}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-white/25 flex-shrink-0" />
                      <span className="text-white/40 text-sm font-mono">IST · UTC +5:30 · &lt; 24h response</span>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-4 font-semibold">Connect</p>
                  <div className="space-y-2">
                    {about?.githubUsername && (
                      <a href={`https://github.com/${about.githubUsername}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-white/50 hover:text-white text-sm font-medium transition-all group p-2 rounded-xl hover:bg-white/5">
                        <div className="w-8 h-8 rounded-lg border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors bg-white/[0.03] flex-shrink-0">
                          <Github className="w-4 h-4" />
                        </div>
                        GitHub
                        <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {about?.linkedinUrl && (
                      <a href={about.linkedinUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-white/50 hover:text-white text-sm font-medium transition-all group p-2 rounded-xl hover:bg-white/5">
                        <div className="w-8 h-8 rounded-lg border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors bg-white/[0.03] flex-shrink-0">
                          <Linkedin className="w-4 h-4" />
                        </div>
                        LinkedIn
                        <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {about?.instagramUrl && (
                      <a href={about.instagramUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-white/50 hover:text-white text-sm font-medium transition-all group p-2 rounded-xl hover:bg-white/5">
                        <div className="w-8 h-8 rounded-lg border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors bg-white/[0.03] flex-shrink-0">
                          <Instagram className="w-4 h-4" />
                        </div>
                        Instagram
                        <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {about?.email && (
                      <a href={`mailto:${about.email}`}
                        className="flex items-center gap-3 text-white/50 hover:text-white text-sm font-medium transition-all group p-2 rounded-xl hover:bg-white/5">
                        <div className="w-8 h-8 rounded-lg border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors bg-white/[0.03] flex-shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        Email
                        <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {about?.leetcodeUsername && (
                      <a href={`https://leetcode.com/${about.leetcodeUsername}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-white/50 hover:text-white text-sm font-medium transition-all group p-2 rounded-xl hover:bg-white/5">
                        <div className="w-8 h-8 rounded-lg border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors bg-white/[0.03] flex-shrink-0">
                          <Code2 className="w-4 h-4" />
                        </div>
                        LeetCode
                        <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer className="py-10 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/15 text-xs tracking-wide">© {new Date().getFullYear()} Jeeva — Software Development Engineer</p>
            <div className="flex items-center gap-6">
              {about?.githubUsername && (
                <a href={`https://github.com/${about.githubUsername}`} target="_blank" rel="noreferrer"
                  className="text-white/15 hover:text-white/50 text-xs transition-colors link-underline">GitHub</a>
              )}
              {about?.linkedinUrl && (
                <a href={about.linkedinUrl} target="_blank" rel="noreferrer"
                  className="text-white/15 hover:text-white/50 text-xs transition-colors link-underline">LinkedIn</a>
              )}
              {about?.instagramUrl && (
                <a href={about.instagramUrl} target="_blank" rel="noreferrer"
                  className="text-white/15 hover:text-white/50 text-xs transition-colors link-underline">Instagram</a>
              )}
              {about?.leetcodeUsername && (
                <a href={`https://leetcode.com/${about.leetcodeUsername}`} target="_blank" rel="noreferrer"
                  className="text-white/15 hover:text-white/50 text-xs transition-colors link-underline">LeetCode</a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

