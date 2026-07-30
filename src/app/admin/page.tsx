"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FolderGit2, 
  Cpu, 
  FileText, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  Trophy,
  Award,
  User,
  Code2,
  CheckCircle2,
  CheckCircle,
  GitBranch,
  Sparkles
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"about" | "projects" | "skills" | "experience" | "education" | "achievements" | "certifications" | "resume" | "messages">("about");

  // Data states
  const [about, setAbout] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [resume, setResume] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [aboutForm, setAboutForm] = useState({ title: "", bio: "", tagline: "", location: "", email: "", githubUsername: "", leetcodeUsername: "", linkedinUrl: "", instagramUrl: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", techStack: "", liveUrl: "", githubUrl: "", imageUrl: "", featured: false });
  const [newSkill, setNewSkill] = useState({ name: "", category: "Backend", proficiency: 85, icon: "⚡" });
  const [newExp, setNewExp] = useState({ company: "", role: "", period: "", location: "", description: "", skillsUsed: "" });
  const [newEdu, setNewEdu] = useState({ institution: "", degree: "", period: "", location: "", grade: "", description: "" });
  const [newAch, setNewAch] = useState({ title: "", platform: "LeetCode", stats: "", linkUrl: "", badgeUrl: "" });
  const [newCert, setNewCert] = useState({ title: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", imageUrl: "" });
  const [resumeFileUrl, setResumeFileUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchAllData();
    }
  }, [status, router]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [abRes, projRes, skillRes, expRes, eduRes, achRes, certRes, resRes, msgRes] = await Promise.all([
        fetch("/api/about"),
        fetch("/api/projects"),
        fetch("/api/skills"),
        fetch("/api/experience"),
        fetch("/api/education"),
        fetch("/api/achievements"),
        fetch("/api/certifications"),
        fetch("/api/resume"),
        fetch("/api/messages"),
      ]);

      if (abRes.ok) {
        const abData = await abRes.json();
        setAbout(abData);
        if (abData) setAboutForm(abData);
      }
      if (projRes.ok) setProjects(await projRes.json());
      if (skillRes.ok) setSkills(await skillRes.json());
      if (expRes.ok) setExperience(await expRes.json());
      if (eduRes.ok) setEducation(await eduRes.json());
      if (achRes.ok) setAchievements(await achRes.json());
      if (certRes.ok) setCertifications(await certRes.json());
      if (resRes.ok) setResume(await resRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aboutForm),
    });
    if (res.ok) fetchAllData();
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    if (res.ok) {
      setNewProject({ title: "", description: "", techStack: "", liveUrl: "", githubUrl: "", imageUrl: "", featured: false });
      fetchAllData();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSkill),
    });
    if (res.ok) {
      setNewSkill({ name: "", category: "Backend", proficiency: 85, icon: "⚡" });
      fetchAllData();
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExp),
    });
    if (res.ok) {
      setNewExp({ company: "", role: "", period: "", location: "", description: "", skillsUsed: "" });
      fetchAllData();
    }
  };

  const handleDeleteExp = async (id: string) => {
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  const handleAddEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEdu),
    });
    if (res.ok) {
      setNewEdu({ institution: "", degree: "", period: "", location: "", grade: "", description: "" });
      fetchAllData();
    }
  };

  const handleDeleteEdu = async (id: string) => {
    const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  const handleAddAch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAch),
    });
    if (res.ok) {
      setNewAch({ title: "", platform: "LeetCode", stats: "", linkUrl: "", badgeUrl: "" });
      fetchAllData();
    }
  };

  const handleDeleteAch = async (id: string) => {
    const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCert),
    });
    if (res.ok) {
      setNewCert({ title: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "" });
      fetchAllData();
    }
  };

  const handleDeleteCert = async (id: string) => {
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  const handleUpdateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFileUrl || !resumeFileName) return alert("Provide file name and URL/Base64");
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "SDE Resume", fileUrl: resumeFileUrl, fileName: resumeFileName }),
    });
    if (res.ok) fetchAllData();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setResumeFileUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) fetchAllData();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="tracking-widest uppercase text-sm text-zinc-400">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 font-sans selection:bg-white selection:text-black flex flex-col md:flex-row">
      
      {/* Left Sidebar Navigation */}
      <aside className="w-full md:w-72 border-r border-white/10 bg-[#09090b] md:min-h-screen flex flex-col sticky top-0 md:h-screen z-50">
        <div className="p-7 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <h1 className="text-base font-bold tracking-wider font-mono text-white uppercase leading-tight">
              Command Center
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">Portfolio Administration</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {[
            { id: "about", label: "About & Socials", icon: User },
            { id: "experience", label: `Experience (${experience.length})`, icon: Briefcase },
            { id: "education", label: `Education (${education.length})`, icon: GraduationCap },
            { id: "skills", label: `Skills Matrix (${skills.length})`, icon: Cpu },
            { id: "projects", label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: "achievements", label: `Achievements (${achievements.length})`, icon: Trophy },
            { id: "certifications", label: `Certifications (${certifications.length})`, icon: Award },
            { id: "resume", label: "Resume Manager", icon: FileText },
            { id: "messages", label: `Messages (${messages.length})`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-3.5 transition-all ${
                  active
                    ? "bg-white text-black font-extrabold shadow-lg scale-[1.02]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-2.5">
          <a
            href="/"
            target="_blank"
            className="w-full px-4 py-3 text-xs font-mono border border-zinc-700 text-zinc-200 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest font-semibold"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-3 text-xs font-mono bg-zinc-900 border border-zinc-800 text-red-400 rounded-xl hover:bg-red-950/40 hover:border-red-800/60 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TAB: ABOUT */}
        {activeTab === "about" && (
          <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-400" /> About & Live API Handles
              </h2>
              <p className="text-sm text-zinc-400 mt-1">Configure headline bio and GitHub/LeetCode handles for live stats sync.</p>
            </div>

            <form onSubmit={handleSaveAbout} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">Headline / Main Title</label>
                <input
                  type="text"
                  required
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  placeholder="Senior Software Development Engineer"
                  className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-sans focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">About Bio</label>
                <textarea
                  required
                  rows={5}
                  value={aboutForm.bio}
                  onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                  placeholder="Passionate SDE with expertise in high-concurrency systems, 3D web interfaces, and backend architecture..."
                  className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-sans focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">GitHub Username (Live Stats)</label>
                  <input
                    type="text"
                    value={aboutForm.githubUsername || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, githubUsername: e.target.value })}
                    placeholder="imjeeva08"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-mono focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">LeetCode Username (Live Stats)</label>
                  <input
                    type="text"
                    value={aboutForm.leetcodeUsername || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, leetcodeUsername: e.target.value })}
                    placeholder="imjeeva08"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-mono focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">Email</label>
                  <input
                    type="email"
                    value={aboutForm.email || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
                    placeholder="hello@yoursite.com"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-sans focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">LinkedIn URL</label>
                  <input
                    type="url"
                    value={aboutForm.linkedinUrl || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/yourname"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-sans focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">Instagram URL</label>
                <input
                  type="url"
                  value={aboutForm.instagramUrl || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-sans focus:border-white focus:ring-1 focus:ring-white outline-none text-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 px-8 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.01] shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB: EXPERIENCE */}
        {activeTab === "experience" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 h-fit shadow-xl">
              <h2 className="text-base font-bold tracking-tight text-white mb-5 uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Add Experience
              </h2>
              <form onSubmit={handleAddExp} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Company</label>
                  <input
                    type="text"
                    required
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    placeholder="e.g. Google / Tech Startup"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Role</label>
                  <input
                    type="text"
                    required
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    placeholder="Software Engineer"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Period</label>
                  <input
                    type="text"
                    required
                    value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    placeholder="Jan 2024 - Present"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    placeholder="Key achievements, system design highlights..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Add Experience Entry
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold tracking-tight text-zinc-300 uppercase font-mono">Work History ({experience.length})</h2>
              {experience.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 font-mono text-sm">
                  No experience entries added yet.
                </div>
              ) : (
                experience.map((exp) => (
                  <div key={exp.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 shadow-md hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-base">{exp.role} <span className="text-emerald-400">@ {exp.company}</span></h3>
                        <p className="text-xs font-mono text-zinc-400 mt-1">{exp.period}</p>
                        <p className="text-sm text-zinc-300 mt-3 font-normal leading-relaxed">{exp.description}</p>
                      </div>
                      <button onClick={() => handleDeleteExp(exp.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: EDUCATION */}
        {activeTab === "education" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 h-fit shadow-xl">
              <h2 className="text-base font-bold tracking-tight text-white mb-5 uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Add Education
              </h2>
              <form onSubmit={handleAddEdu} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Institution</label>
                  <input
                    type="text"
                    required
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    placeholder="e.g. Anna University / School"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Degree / Course</label>
                  <input
                    type="text"
                    required
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Period</label>
                  <input
                    type="text"
                    required
                    value={newEdu.period}
                    onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })}
                    placeholder="2021 - 2025"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Grade / Percentage</label>
                  <input
                    type="text"
                    value={newEdu.grade}
                    onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                    placeholder="e.g. 8.8 CGPA / 95%"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Location</label>
                  <input
                    type="text"
                    value={newEdu.location}
                    onChange={(e) => setNewEdu({ ...newEdu, location: e.target.value })}
                    placeholder="Tamil Nadu, India"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Add Education Entry
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold tracking-tight text-zinc-300 uppercase font-mono">Education Timeline ({education.length})</h2>
              {education.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 font-mono text-sm">
                  No education entries added yet.
                </div>
              ) : (
                education.map((edu) => (
                  <div key={edu.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-base">{edu.degree}</h3>
                        <p className="text-sm text-zinc-300 font-semibold mt-1">{edu.institution}</p>
                        <p className="text-xs font-mono text-emerald-400 mt-2">
                          {edu.period} {edu.grade && `• Grade: ${edu.grade}`} {edu.location && `• ${edu.location}`}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteEdu(edu.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="space-y-8">

            {/* Live Stats Connection Card */}
            <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Trophy className="w-5 h-5 text-yellow-400" /> Live Platform Accounts (GitHub & LeetCode)
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    Connect your GitHub and LeetCode usernames to automatically display live statistics, solved counts, repository metrics, and rankings on your portfolio.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {aboutForm.githubUsername ? (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> GitHub Linked (@{aboutForm.githubUsername})
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                      GitHub Not Linked
                    </span>
                  )}
                  {aboutForm.leetcodeUsername ? (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LeetCode Linked (@{aboutForm.leetcodeUsername})
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                      LeetCode Not Linked
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveAbout} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-400" /> GitHub Username
                  </label>
                  <input
                    type="text"
                    value={aboutForm.githubUsername || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, githubUsername: e.target.value })}
                    placeholder="e.g. imjeeva08"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  />
                  <p className="text-[11px] text-zinc-500 font-mono mt-1.5">Fetches public repositories, total stars, and top programming languages.</p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-yellow-400" /> LeetCode Username
                  </label>
                  <input
                    type="text"
                    value={aboutForm.leetcodeUsername || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, leetcodeUsername: e.target.value })}
                    placeholder="e.g. imjeeva08"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  />
                  <p className="text-[11px] text-zinc-500 font-mono mt-1.5">Fetches total problems solved (Easy/Medium/Hard), streak, and global ranking.</p>
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="py-3 px-8 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all shadow-md flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Save &amp; Connect Live Stats
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 h-fit shadow-xl">
                <h2 className="text-base font-bold tracking-tight text-white mb-5 uppercase flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> Add Custom Milestone
                </h2>
              <form onSubmit={handleAddAch} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Title</label>
                  <input
                    type="text"
                    required
                    value={newAch.title}
                    onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                    placeholder="e.g. 500+ Solved on LeetCode"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Platform</label>
                  <select
                    value={newAch.platform}
                    onChange={(e) => setNewAch({ ...newAch, platform: e.target.value })}
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Stats Highlight</label>
                  <input
                    type="text"
                    required
                    value={newAch.stats}
                    onChange={(e) => setNewAch({ ...newAch, stats: e.target.value })}
                    placeholder="Global Rank #15,400"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Link URL</label>
                  <input
                    type="url"
                    value={newAch.linkUrl}
                    onChange={(e) => setNewAch({ ...newAch, linkUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Add Achievement
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold tracking-tight text-zinc-300 uppercase font-mono">Achievements ({achievements.length})</h2>
              {achievements.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 font-mono text-sm">
                  No custom achievements added yet.
                </div>
              ) : (
                achievements.map((ach) => (
                  <div key={ach.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-base">{ach.title}</span>
                        <span className="text-xs font-mono bg-zinc-900 border border-zinc-700 text-emerald-400 px-2.5 py-1 rounded-full">
                          {ach.platform}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 font-mono mt-2">{ach.stats}</p>
                    </div>
                    <button onClick={() => handleDeleteAch(ach.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 h-fit shadow-xl">
              <h2 className="text-base font-bold tracking-tight text-white mb-5 uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Publish Project
              </h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Project Title</label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. Distributed Engine"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="High-throughput fault-tolerant system..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    placeholder="Next.js, TypeScript, PostgreSQL, Docker"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Live URL</label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Project Image URL / Cover Photo</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newProject.imageUrl}
                      onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                      placeholder="https://... or upload file below"
                      className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewProject({ ...newProject, imageUrl: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-[#111116] border border-white/10 rounded-xl p-2.5 text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.featured}
                    onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                    className="w-4 h-4 accent-emerald-400"
                  />
                  <label htmlFor="featured" className="text-xs font-mono text-zinc-300 font-bold uppercase">Mark as Featured</label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Publish Project
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold tracking-tight text-zinc-300 uppercase font-mono">Projects Showcase ({projects.length})</h2>
              {projects.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 font-mono text-sm">
                  No projects added yet.
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 shadow-md hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-3">
                          {project.title}
                          {project.featured && (
                            <span className="text-xs bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono">
                              FEATURED
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-zinc-300 mt-2 font-normal leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.techStack.split(",").map((tech: string, i: number) => (
                            <span key={i} className="text-xs bg-black border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md font-mono">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProject(project.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: SKILLS */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 h-fit shadow-xl">
              <h2 className="text-base font-bold tracking-tight text-white mb-5 uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Add Skill Node
              </h2>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g. Next.js / Docker / Go"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Architecture & Security">Architecture & Security</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Add Skill Node
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold tracking-tight text-zinc-300 uppercase font-mono">Skill Matrix ({skills.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <h3 className="font-bold text-white text-base">{skill.name}</h3>
                      <span className="text-xs text-emerald-400 font-mono mt-1 inline-block">
                        {skill.category}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: RESUME */}
        {activeTab === "resume" && (
          <div className="max-w-3xl bg-[#0b0b0e] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400" /> SDE Resume Manager
              </h2>
              <p className="text-sm text-zinc-400 mt-1">Upload or update your official resume PDF for public portfolio download.</p>
            </div>

            <form onSubmit={handleUpdateResume} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">Upload Local PDF File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full bg-[#111116] border border-white/10 rounded-xl p-3 text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-white file:text-black hover:file:bg-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">File Display Name</label>
                <input
                  type="text"
                  value={resumeFileName}
                  onChange={(e) => setResumeFileName(e.target.value)}
                  placeholder="e.g. Jeeva_SDE_Resume.pdf"
                  className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-mono focus:border-white outline-none text-white"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 px-8 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all shadow-lg"
              >
                Deploy Active Resume
              </button>
            </form>

            {resume && (
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between bg-black/40 p-6 rounded-2xl">
                <div>
                  <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Active Published Resume</p>
                  <p className="text-base font-bold text-white font-mono mt-1">{resume.fileName}</p>
                </div>
                <a
                  href={resume.fileUrl}
                  download={resume.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-mono font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
                >
                  Download Active File
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB: MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold tracking-tight font-mono text-zinc-200 uppercase">Messages Inbox ({messages.length})</h2>
            {messages.length === 0 ? (
              <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 font-mono text-sm">
                No incoming transmissions yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 flex flex-col md:flex-row md:items-start justify-between gap-6 shadow-md">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-white text-base">{msg.name}</span>
                      <span className="text-xs text-emerald-400 font-mono">&lt;{msg.email}&gt;</span>
                      <span className="text-xs text-zinc-500 font-mono ml-auto">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-200 mt-3 bg-black/70 p-5 rounded-xl border border-white/5 font-sans leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteMessage(msg.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors self-end md:self-start">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: CERTIFICATIONS */}
        {activeTab === "certifications" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-7 h-fit shadow-xl">
              <h2 className="text-base font-bold tracking-tight text-white mb-5 uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Add Certification
              </h2>
              <form onSubmit={handleAddCert} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Certification Name</label>
                  <input
                    type="text"
                    required
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    placeholder="AWS Solutions Architect"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Issuer</label>
                  <input
                    type="text"
                    required
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Issue Date</label>
                  <input
                    type="text"
                    required
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                    placeholder="Aug 2024"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-sans focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Credential URL</label>
                  <input
                    type="url"
                    value={newCert.credentialUrl}
                    onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2 font-bold">Certificate Image / Badge Photo</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newCert.imageUrl}
                      onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
                      placeholder="https://... or upload file below"
                      className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-white outline-none text-white"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewCert({ ...newCert, imageUrl: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-[#111116] border border-white/10 rounded-xl p-2.5 text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase font-extrabold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Add Certification
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold tracking-tight text-zinc-300 uppercase font-mono">Certifications ({certifications.length})</h2>
              {certifications.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 font-mono text-sm">
                  No certifications added yet.
                </div>
              ) : (
                certifications.map((cert) => (
                  <div key={cert.id} className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{cert.title}</h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1">{cert.issuer} • Issued {cert.issueDate}</p>
                    </div>
                    <button onClick={() => handleDeleteCert(cert.id)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        </div>
      </main>
    </div>
  );
}
