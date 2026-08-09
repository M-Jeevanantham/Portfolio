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

const FALLBACK_CERT_IMAGES = [
  "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
];

function getCertImg(cert: CertificationItem, idx: number) {
  if (cert.imageUrl && cert.imageUrl.trim() !== "") {
    return cert.imageUrl;
  }
  return FALLBACK_CERT_IMAGES[idx % FALLBACK_CERT_IMAGES.length];
}

export interface Skiper52Props {
  certifications?: CertificationItem[];
}

export function Skiper52Certifications({
  certifications,
}: Skiper52Props) {
  const displayCerts = certifications !== undefined ? certifications : DEFAULT_CERTIFICATIONS;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  if (displayCerts.length === 0) {
    return (
      <div className="w-full py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <Award className="w-10 h-10 text-white/30 mx-auto mb-3" />
        <p className="text-zinc-400 text-sm font-mono uppercase tracking-wider">
          No Certifications Added Yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative py-4 sm:py-8">
      {/* Mobile Card List View (< sm screens) */}
      <div className="flex sm:hidden flex-col space-y-4 px-2 w-full">
        {displayCerts.map((cert, index) => (
          <div
            key={cert.id || index}
            className="relative w-full rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 p-5 shadow-xl flex flex-col justify-between"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-black pointer-events-none" />

            {/* Card Content Wrapper */}
            <div className="relative z-10 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <Award className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider block font-bold">
                      Verified Certificate
                    </span>
                    <p className="text-white/80 text-[11px] font-mono">{cert.issuer}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white/70 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-300" />
                  {cert.issueDate}
                </span>
              </div>

              {/* Certificate Image Banner Display */}
              <div
                onClick={() => setSelectedCert(cert)}
                className="relative w-full h-44 rounded-xl overflow-hidden border border-white/20 shadow-md group cursor-pointer"
              >
                <img
                  src={getCertImg(cert, index)}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_CERT_IMAGES[index % FALLBACK_CERT_IMAGES.length];
                  }}
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/25 flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-zinc-300" /> View Full Image
                  </span>
                </div>
              </div>

              {/* Details & Title */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {cert.title}
                </h3>

                {cert.credentialId && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 border border-white/15 text-[10px] font-mono text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                    <span>ID: {cert.credentialId}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-3.5 py-1.5 rounded-lg bg-black/75 border border-white/20 hover:border-white/50 text-white text-[11px] font-mono font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Preview</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold text-[11px] font-mono flex items-center gap-1 shadow-md"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Tablet 3D Accordion Expanding Image Slider (>= sm screens) */}
      <div className="hidden sm:flex flex-row items-center justify-center gap-3 md:gap-4 overflow-x-auto py-6 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-h-[460px] md:min-h-[520px]">
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
                  ? "w-[440px] md:w-[560px] lg:w-[640px] h-[440px] md:h-[480px] border-white/30 shadow-[0_20px_60px_rgba(255,255,255,0.08)] bg-[#12131e]"
                  : "w-20 md:w-24 lg:w-28 h-[440px] md:h-[480px] border-white/10 hover:border-white/30 bg-[#0c0d14]"
              }`}
            >
              {/* Background Image */}
              <img
                src={getCertImg(cert, index)}
                alt={cert.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  isActive ? "brightness-[0.75] scale-105" : "brightness-[0.4] grayscale"
                }`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_CERT_IMAGES[index % FALLBACK_CERT_IMAGES.length];
                }}
              />

              {/* Ambient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

              {/* Collapsed View (Vertical Pill Label) */}
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-between p-4 z-10">
                  <span className="text-xs font-mono text-zinc-300 font-bold bg-black/70 px-2 py-1 rounded-full border border-white/10">
                    0{index + 1}
                  </span>
                  <div className="[writing-mode:vertical-rl] text-white/70 font-mono text-xs tracking-wider uppercase font-semibold truncate max-h-[260px] select-none">
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
