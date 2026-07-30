"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("imjeeva08@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6"
      style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded-2xl mb-6">
            <Lock className="w-5 h-5 text-white/40" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Access
          </h1>
          <p className="text-white/30 text-sm mt-2">Portfolio Management Console</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-white/30 text-xs font-semibold tracking-widest uppercase mb-3">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="imjeeva08@gmail.com"
              className="w-full bg-transparent border-b border-white/15 focus:border-white/50 text-white text-sm py-3 outline-none transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="block text-white/30 text-xs font-semibold tracking-widest uppercase mb-3">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-white/15 focus:border-white/50 text-white text-sm py-3 outline-none transition-colors placeholder:text-white/20"
            />
          </div>

          {error && (
            <p className="text-white/50 text-xs border border-white/10 rounded-lg px-4 py-3 bg-white/5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-all disabled:opacity-40"
          >
            {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-white/20 hover:text-white/50 text-xs transition-colors">
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
