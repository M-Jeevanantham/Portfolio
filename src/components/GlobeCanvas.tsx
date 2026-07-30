"use client";

import { useEffect, useRef } from "react";
import { Cpu, MapPin } from "lucide-react";

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // ── Generate 3D Dotted Globe Points ────────────────────
    const DOT_COUNT = 900;
    const RADIUS = Math.min(width, height) * 0.38;
    const points: Array<{ x: number; y: number; z: number; baseLat: number; baseLon: number }> = [];

    // Fibonacci sphere distribution
    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < DOT_COUNT; i++) {
      const theta = 2 * Math.PI * i / phi;
      const y = 1 - (i / (DOT_COUNT - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const lat = Math.asin(y);
      const lon = Math.atan2(z, x);

      points.push({
        x: x * RADIUS,
        y: y * RADIUS,
        z: z * RADIUS,
        baseLat: lat,
        baseLon: lon,
      });
    }

    // Jeeva Location Pin (Tamil Nadu, India: ~11.1271° N, 78.6569° E)
    const pinLat = (11.1271 * Math.PI) / 180;
    const pinLon = (78.6569 * Math.PI) / 180;
    const pinX = RADIUS * Math.cos(pinLat) * Math.cos(pinLon);
    const pinY = RADIUS * Math.sin(pinLat);
    const pinZ = RADIUS * Math.cos(pinLat) * Math.sin(pinLon);

    let rotationY = 0;
    let rotationX = 0.2; // Slight downward tilt

    // Mouse drag rotation
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      rotationY += deltaX * 0.005;
      rotationX += deltaY * 0.005;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // ── Render Loop ────────────────────────────────────────
    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotationY += 0.003; // Smooth continuous rotation
      pulseTime += 0.04;

      const cx = width / 2;
      const cy = height / 2;

      // Project & draw dots
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // 3D Rotation Matrix
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);

        // Rotate around Y
        let x1 = pt.x * cosY - pt.z * sinY;
        let z1 = pt.z * cosY + pt.x * sinY;

        // Rotate around X
        let y2 = pt.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + pt.y * sinX;

        // Perspective scale
        const scale = (RADIUS * 2) / (RADIUS * 2 + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        // Fade dots on the back of the sphere
        const alpha = Math.max(0.08, (z2 + RADIUS) / (2 * RADIUS));

        ctx.fillStyle = z2 > 0 ? `rgba(255, 255, 255, ${alpha * 0.65})` : `rgba(255, 255, 255, ${alpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(px, py, z2 > 0 ? 1.4 * scale : 1.0 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Glowing Pin Location (Tamil Nadu, India)
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      let px1 = pinX * cosY - pinZ * sinY;
      let pz1 = pinZ * cosY + pinX * sinY;
      let py2 = pinY * cosX - pz1 * sinX;
      let pz2 = pz1 * cosX + pinY * sinX;

      if (pz2 > -RADIUS * 0.2) {
        const scale = (RADIUS * 2) / (RADIUS * 2 + pz2);
        const px = cx + px1 * scale;
        const py = cy + py2 * scale;

        // Glowing outer pulse ring
        const pulseR = 8 + Math.sin(pulseTime) * 4;
        ctx.strokeStyle = "rgba(52, 211, 153, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, pulseR * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid glowing dot
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden bg-transparent">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Canvas Globe */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Sleek Glass Location Badge (Matches exact image layout) */}
      <div className="absolute bottom-6 right-6 md:right-8 bg-black/85 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(52,211,153,0.12)] max-w-xs pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white/40 text-[9px] uppercase font-mono tracking-widest">Region / Location</p>
            <p className="text-white font-bold text-sm leading-tight">Tamil Nadu, India</p>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono border-t border-white/10 pt-3">
          <p className="text-white/70 font-semibold text-[11px]">Primary Base & Availability:</p>
          <div className="space-y-1 text-white/50 text-[11px]">
            <p className="flex items-center justify-between">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Open for Opportunities
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>Work Modes:</span>
              <span className="text-white/80">Remote & On-Site</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Timezone:</span>
              <span className="text-white/80">IST (UTC +5:30)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
