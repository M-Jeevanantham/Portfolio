"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, Calendar, Eye, X, CheckCircle2 } from "lucide-react";

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "2024",
    credentialId: "AWS-PSA-982144",
    credentialUrl: "https://aws.amazon.com/verification",
    imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Meta Certified Full-Stack Developer",
    issuer: "Meta / Coursera",
    issueDate: "2024",
    credentialId: "META-FS-551029",
    credentialUrl: "https://coursera.org/verify/meta",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Google Cloud Associate Engineer",
    issuer: "Google Cloud Platform",
    issueDate: "2023",
    credentialId: "GCP-ACE-772910",
    credentialUrl: "https://cloud.google.com/certification",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Oracle Java SE 17 Developer",
    issuer: "Oracle University",
    issueDate: "2023",
    credentialId: "ORCL-J17-331002",
    credentialUrl: "https://education.oracle.com",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Stanford AI Machine Learning",
    issuer: "Stanford Online",
    issueDate: "2024",
    credentialId: "STF-ML-441092",
    credentialUrl: "https://stanford.edu",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Microsoft Azure Architect",
    issuer: "Microsoft",
    issueDate: "2023",
    credentialId: "MSFT-AZ-881920",
    credentialUrl: "https://microsoft.com",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

export interface Skiper52Props {
  certifications?: CertificationItem[];
}

export function Skiper52Certifications({
  certifications = DEFAULT_CERTIFICATIONS,
}: Skiper52Props) {
  const fetched = certifications && certifications.length > 0 ? certifications : [];
  const existingTitles = new Set(fetched.map((c) => c.title.toLowerCase().trim()));
  const extraDefaults = DEFAULT_CERTIFICATIONS.filter(
    (d) => !existingTitles.has(d.title.toLowerCase().trim())
  );
  
  const displayCerts = [...fetched, ...extraDefaults];

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  return (
    <div className="w-full relative py-8">
      {/* Skiper52 Accordion Expanding Image Slider — Hidden Scrollbar & Silver Borders */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto py-6 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-h-[460px] md:min-h-[520px]">
        {displayCerts.map((cert, index) => {
          const isActive = activeIndex === index;
          return (
            <motion.div
              key={cert.id || index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              layout
              transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
              className={`relative rounded-[2.2rem] md:rounded-[2.8rem] overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-500 border ${
                isActive
                  ? "w-[300px] sm:w-[440px] md:w-[560px] lg:w-[640px] h-[420px] md:h-[480px] border-white/30 shadow-[0_20px_60px_rgba(255,255,255,0.08)] bg-[#12131e]"
                  : "w-16 sm:w-20 md:w-24 lg:w-28 h-[420px] md:h-[480px] border-white/10 hover:border-white/30 bg-[#0c0d14]"
              }`}
            >
              {/* Background Image */}
              <img
                src={cert.imageUrl || "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200&auto=format&fit=crop"}
                alt={cert.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  isActive ? "brightness-[0.45] scale-105" : "brightness-[0.3] grayscale"
                }`}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />

              {/* Ambient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

              {/* Collapsed View (Vertical Pill Label) */}
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-between p-4 z-10">
                  <span className="text-xs font-mono text-zinc-300 font-bold bg-black/70 px-2 py-1 rounded-full border border-white/10">
                    0{index + 1}
                  </span>
                  <div className="writing-mode-vertical rotate-180 text-white/70 font-mono text-xs tracking-wider uppercase font-semibold truncate max-h-[260px]">
                    {cert.title}
                  </div>
                  <Award className="w-5 h-5 text-white/50" />
                </div>
              )}

              {/* Active Expanded View */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 w-full h-full p-6 md:p-8 flex flex-col justify-between"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-zinc-200 font-bold">
                        <Award className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-widest block font-bold">
                          Verified Certificate
                        </span>
                        <p className="text-white/70 text-xs font-mono">{cert.issuer}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-white/60 bg-black/60 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                      {cert.issueDate}
                    </span>
                  </div>

                  {/* Center & Bottom Details */}
                  <div className="space-y-4 mt-auto">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {cert.title}
                    </h3>

                    {cert.credentialId && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 border border-white/15 text-xs font-mono text-zinc-300">
                        <ShieldCheck className="w-4 h-4 text-zinc-300" />
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCert(cert);
                        }}
                        className="px-4 py-2 rounded-xl bg-black/75 border border-white/20 hover:border-white/50 text-white text-xs font-mono font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-zinc-300" />
                        <span>Preview Full Image</span>
                      </button>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                          <span>Verify Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#12131c] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">{selectedCert.title}</h3>
                  <p className="text-zinc-400 text-xs font-mono">{selectedCert.issuer} — {selectedCert.issueDate}</p>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedCert.imageUrl && (
                <div className="w-full max-h-[65vh] rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    className="w-full h-full object-contain max-h-[65vh]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-zinc-400">
                  {selectedCert.credentialId ? `Credential ID: ${selectedCert.credentialId}` : "Official Certificate Document"}
                </span>
                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Skiper52Certifications;
