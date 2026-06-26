import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListProjects,
  checkIsAdmin,
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/projects.functions";
import {
  adminListClients,
  createClient as createClientFn,
  deleteClient,
  updateClient,
} from "@/lib/clients.functions";
import {
  adminListReviews,
  createReview,
  deleteReview,
  updateReview,
} from "@/lib/reviews.functions";
import {
  getMous,
  saveMou,
  deleteMou,
  getLeads,
  deleteLead,
  getApplications,
  deleteApplication,
  type MouCollege,
  type Lead,
  type CareerApplication,
} from "@/lib/mou-storage";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Star,
  Mail,
  UserCheck,
  FileText,
  GraduationCap,
  FolderPlus,
  Settings,
  LogOut,
  Trash2,
  Plus,
  Edit,
  Check,
  CheckCircle,
  Calendar,
  X,
  ExternalLink,
  Globe,
  Upload,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import logoUrl from "@/assets/st-logo.svg?url";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — ST Software Solution" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab =
  | "dashboard"
  | "projects"
  | "services"
  | "testimonials"
  | "leads"
  | "careers"
  | "blog"
  | "partnerships"
  | "mou"
  | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(checkIsAdmin);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    (async () => {
      try {
        const r = await checkAdmin();
        if (!r.isAdmin) {
          setAuthorized(false);
          return;
        }
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [checkAdmin]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center font-mono text-xs text-primary">
        <div className="text-center space-y-3">
          <div className="size-8 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
          <p>Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center px-6">
        <div className="max-w-md text-center border border-primary/20 bg-surface/20 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold text-primary">Access Denied</h1>
          <p className="mt-4 text-sm text-muted">
            Your account does not have admin privileges. Please sign in with the admin email:
            <span className="font-mono text-primary block mt-1">stsoftwaresolution@gmail.com</span>
          </p>
          <button
            onClick={signOut}
            className="mt-6 border border-primary/45 bg-primary/10 hover:bg-primary hover:text-background px-6 py-3 text-xs font-mono uppercase tracking-widest text-primary transition-all"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const sidebarMenu: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "services", label: "Services", icon: Wrench },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "leads", label: "Leads", icon: Mail },
    { id: "careers", label: "Careers", icon: UserCheck },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "partnerships", label: "Academic Partnerships", icon: GraduationCap },
    { id: "mou", label: "MoU Management", icon: FolderPlus },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-[#eaeaea] flex">
      {/* Premium Admin Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0c0c0c] flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div>
          {/* Header Branding */}
          <div className="py-3 px-2 mb-6 border-b border-white/10">
            <Link to="/" className="block group">
              <img
                src={logoUrl}
                alt="ST Software Solution"
                className="w-full max-w-[260px] mx-auto block rounded-lg border border-primary/20 bg-[#08090c] p-2 transition-all duration-300 group-hover:scale-[1.03]"
                style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.2))" }}
              />
            </Link>
            <div className="font-mono text-[9px] uppercase tracking-widest text-primary mt-2 text-center">
              ADMIN CONTROL CENTER
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarMenu.map((m) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-mono uppercase tracking-widest transition-all " +
                    (isActive
                      ? "bg-primary/20 text-primary border-l-2 border-primary"
                      : "text-muted hover:bg-white/5 hover:text-foreground")
                  }
                >
                  <Icon className="size-4 shrink-0 text-primary" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-mono uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard content area */}
      <main className="flex-1 min-w-0 p-8 md:p-10 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-wide uppercase">
              {sidebarMenu.find((m) => m.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-muted mt-1">
              Configure, manage and audit the ST Software Solution platform resources.
            </p>
          </div>
          <Link
            to="/"
            target="_blank"
            className="border border-white/10 hover:border-primary/50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-primary transition-all"
          >
            View Live Site
          </Link>
        </header>

        {/* Dynamic Panels */}
        {activeTab === "dashboard" && <DashboardPanel />}
        {activeTab === "projects" && <ProjectsPanel />}
        {activeTab === "services" && <ServicesPanel />}
        {activeTab === "testimonials" && <TestimonialsPanel />}
        {activeTab === "leads" && <LeadsPanel />}
        {activeTab === "careers" && <CareersPanel />}
        {activeTab === "blog" && <BlogPanel />}
        {activeTab === "partnerships" && <PartnershipsPanel />}
        {activeTab === "mou" && <MouManagementPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}

/* ============================================================
   PANELS: 1. DASHBOARD
============================================================ */
function DashboardPanel() {
  const [colleges, setColleges] = useState<MouCollege[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [careersCount, setCareersCount] = useState(0);

  useEffect(() => {
    getMous().then(setColleges);
    getLeads().then((l) => setLeadsCount(l.length));
    getApplications().then((a) => setCareersCount(a.length));
  }, []);

  const activeMous = colleges.filter((c) => c.status === "Active");
  const expiredMous = colleges.filter((c) => c.status === "Expired");

  // Determine renewals expiring within 6 months
  const upcomingRenewals = activeMous.filter((c) => {
    try {
      const expDate = new Date(c.expiry_date);
      const diffTime = expDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 180;
    } catch {
      return false;
    }
  });

  // Collect training programs count
  const totalTrainings = activeMous.reduce(
    (acc, val) => acc + (val.training_programs?.length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-white/10 bg-surface/20 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 text-primary/10">
            <CheckCircle className="size-12" />
          </div>
          <div className="text-3xl font-bold text-primary">{activeMous.length}</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted">
            Active MoUs
          </div>
        </div>

        <div className="border border-white/10 bg-surface/20 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 text-amber-500/10">
            <Calendar className="size-12" />
          </div>
          <div className="text-3xl font-bold text-amber-400">{upcomingRenewals.length}</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted">
            Upcoming Renewals
          </div>
        </div>

        <div className="border border-white/10 bg-surface/20 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 text-primary/10">
            <Wrench className="size-12" />
          </div>
          <div className="text-3xl font-bold text-primary">{totalTrainings}</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted">
            Training Programs
          </div>
        </div>

        <div className="border border-white/10 bg-surface/20 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 text-primary/10">
            <UserCheck className="size-12" />
          </div>
          <div className="text-3xl font-bold text-primary">{careersCount}</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted">
            Internship Requests
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-white/10 bg-surface/10 p-6 rounded-xl">
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-primary mb-4">
            Recent Academic Alliances
          </h3>
          <div className="space-y-3">
            {colleges.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border-b border-white/5 pb-2 text-xs"
              >
                <div>
                  <div className="font-bold">{c.college_name}</div>
                  <div className="text-muted text-[10px]">{c.location}</div>
                </div>
                <span
                  className={
                    "px-2 py-0.5 rounded font-mono text-[8px] uppercase tracking-widest border " +
                    (c.status === "Active"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20")
                  }
                >
                  {c.status}
                </span>
              </div>
            ))}
            {colleges.length === 0 && <p className="text-xs text-muted">No alliances registered.</p>}
          </div>
        </div>

        <div className="border border-white/10 bg-surface/10 p-6 rounded-xl">
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-primary mb-4">
            Auditing Statistics Overview
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border border-white/5 p-4 rounded bg-surface/30">
              <div className="text-2xl font-bold text-red-400">{expiredMous.length}</div>
              <div className="text-[9px] uppercase tracking-widest font-mono text-muted mt-1">
                Expired Partnerships
              </div>
            </div>
            <div className="border border-white/5 p-4 rounded bg-surface/30">
              <div className="text-2xl font-bold text-primary">{leadsCount}</div>
              <div className="text-[9px] uppercase tracking-widest font-mono text-muted mt-1">
                Leads Captured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 2. PROJECTS
============================================================ */
type ProjectRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  cover_url: string | null;
  cover_url_signed: string | null;
  project_url: string | null;
  tech: string[];
  featured: boolean;
  sort_order: number;
};

function ProjectsPanel() {
  const list = useServerFn(adminListProjects);
  const create = useServerFn(createProject);
  const update = useServerFn(updateProject);
  const remove = useServerFn(deleteProject);

  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "SaaS",
    project_url: "",
    tech: "",
    featured: false,
    sort_order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await list();
      setRows(data as ProjectRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("project-images")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      setCoverPath(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      cover_url: coverPath,
      project_url: form.project_url || null,
      tech: form.tech.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (editingId) {
        await update({ data: { id: editingId, ...payload } });
      } else {
        await create({ data: payload });
      }
      setForm({ title: "", description: "", category: "SaaS", project_url: "", tech: "", featured: false, sort_order: 0 });
      setEditingId(null);
      setCoverPath(null);
      await refresh();
      toast.success("Project saved successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] animate-fade-in">
      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
          {editingId ? "Edit Project" : "New Project"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4 border border-white/10 bg-surface/30 p-6 rounded-xl">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground">
                {["Fintech", "AI/ML", "SaaS", "Infrastructure", "Security", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Project URL (optional)</label>
            <input type="url" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Tech (comma-separated)</label>
            <input value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} placeholder="React, Node.js, AWS" className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} className="mt-2 block w-full text-xs text-muted" />
            {uploading && <p className="text-[10px] text-primary mt-1">Uploading...</p>}
            {coverPath && <p className="text-[10px] text-green-400 mt-1">✓ {coverPath}</p>}
          </div>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured Project
          </label>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="flex-1 bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold py-3 hover:brightness-110 disabled:opacity-50">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", description: "", category: "SaaS", project_url: "", tech: "", featured: false, sort_order: 0 }); }} className="border border-white/10 px-4 py-3 font-mono text-[10px] uppercase text-muted">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">All Projects ({rows.length})</h2>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {rows.map((r) => (
            <div key={r.id} className="border border-white/10 bg-surface/20 p-4 rounded-xl flex gap-4">
              <div className="h-16 w-16 bg-surface shrink-0 rounded overflow-hidden">
                {r.cover_url_signed && <img src={r.cover_url_signed} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm truncate">{r.title}</h3>
                  <span className="text-[9px] font-mono text-primary uppercase">{r.category}</span>
                </div>
                <p className="text-xs text-muted mt-1 line-clamp-2">{r.description}</p>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => { setEditingId(r.id); setForm({ title: r.title, description: r.description, category: r.category, project_url: r.project_url || "", tech: r.tech.join(", "), featured: r.featured, sort_order: r.sort_order }); setCoverPath(r.cover_url); }} className="font-mono text-[9px] uppercase tracking-widest text-primary hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm("Delete project?")) { await remove({ data: { id: r.id } }); refresh(); toast.success("Project deleted"); } }} className="font-mono text-[9px] uppercase tracking-widest text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 3. SERVICES
============================================================ */
function ServicesPanel() {
  const defaultServices = [
    { title: "Custom Software Development", desc: "Tailor-made software solutions designed to address unique business requirements." },
    { title: "Web Development", desc: "Responsive, modern, and high-performance websites and web applications built for growth." },
    { title: "Mobile App Development", desc: "Cross-platform and native mobile applications for Android and iOS." },
    { title: "Cloud Solutions", desc: "Scalable cloud infrastructure, migration services, and cloud application development." },
    { title: "Quality Assurance & Testing", desc: "Comprehensive testing services ensuring software reliability, security, and performance." },
  ];

  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("st_services");
    if (stored) {
      setServices(JSON.parse(stored));
    } else {
      localStorage.setItem("st_services", JSON.stringify(defaultServices));
      setServices(defaultServices);
    }
  }, []);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  function save(list: any[]) {
    localStorage.setItem("st_services", JSON.stringify(list));
    setServices(list);
    toast.success("Services updated successfully");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] animate-fade-in">
      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Add Custom Service</h2>
        <form onSubmit={(e) => { e.preventDefault(); if (!title || !desc) return; const updated = [...services, { title, desc }]; save(updated); setTitle(""); setDesc(""); }} className="space-y-4 border border-white/10 bg-surface/30 p-6 rounded-xl">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Service Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Description</label>
            <textarea required rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <button type="submit" className="w-full bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold py-3 hover:brightness-110">
            Create Service
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">All Active Services ({services.length})</h2>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {services.map((s, idx) => (
            <div key={idx} className="border border-white/10 bg-surface/20 p-4 rounded-xl relative">
              <button onClick={() => { const filtered = services.filter((_, i) => i !== idx); save(filtered); }} className="absolute top-4 right-4 text-muted hover:text-red-400">
                <Trash2 className="size-4" />
              </button>
              <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
              <p className="text-xs text-muted mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 4. TESTIMONIALS
============================================================ */
type ReviewRow = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
  sort_order: number;
};

function TestimonialsPanel() {
  const list = useServerFn(adminListReviews);
  const create = useServerFn(createReview);
  const update = useServerFn(updateReview);
  const remove = useServerFn(deleteReview);

  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5, approved: true, sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await list();
      setRows(data as ReviewRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = { ...form, rating: Number(form.rating) || 5, sort_order: Number(form.sort_order) || 0 };
      if (editingId) {
        await update({ data: { id: editingId, ...payload } });
      } else {
        await create({ data: payload });
      }
      setForm({ name: "", role: "", quote: "", rating: 5, approved: true, sort_order: 0 });
      setEditingId(null);
      await refresh();
      toast.success("Review saved successfully");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] animate-fade-in">
      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
          {editingId ? "Edit Testimonial" : "New Testimonial"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4 border border-white/10 bg-surface/30 p-6 rounded-xl">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Client Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Role / Company</label>
            <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Quote</label>
            <textarea required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
          </div>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <input type="checkbox" checked={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} />
            Approved
          </label>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="flex-1 bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold py-3 hover:brightness-110">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", role: "", quote: "", rating: 5, approved: true, sort_order: 0 }); }} className="border border-white/10 px-4 py-3 font-mono text-[10px] uppercase text-muted">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">All Testimonials ({rows.length})</h2>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {rows.map((r) => (
            <div key={r.id} className="border border-white/10 bg-surface/20 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm">{r.name}</h3>
                  <p className="text-[10px] text-muted font-mono">{r.role} · ★ {r.rating}</p>
                </div>
                <span className={`text-[9px] font-mono ${r.approved ? "text-primary" : "text-amber-400"}`}>
                  {r.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-xs text-muted mt-3 italic">"{r.quote}"</p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => { setEditingId(r.id); setForm({ name: r.name, role: r.role, quote: r.quote, rating: r.rating, approved: r.approved, sort_order: r.sort_order }); }} className="font-mono text-[9px] uppercase tracking-widest text-primary hover:underline">Edit</button>
                <button onClick={async () => { if (confirm("Delete review?")) { await remove({ data: { id: r.id } }); refresh(); toast.success("Review deleted"); } }} className="font-mono text-[9px] uppercase tracking-widest text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 5. LEADS
============================================================ */
function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const list = await getLeads();
    setLeads(list);
  }

  useEffect(() => { load(); }, []);

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary">Contact Inquiries ({filtered.length})</h2>
        <input
          placeholder="Search Leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-white/10 bg-background/50 px-4 py-2 text-xs outline-none focus:border-primary text-foreground rounded w-64"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((l) => (
          <div key={l.id} className="border border-white/10 bg-surface/20 p-5 rounded-xl">
            <div className="flex flex-wrap justify-between items-start gap-3 border-b border-white/5 pb-2 mb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">{l.name}</h3>
                <p className="text-[10px] text-muted font-mono">{l.email} {l.phone && `· ${l.phone}`} {l.company && `· ${l.company}`}</p>
              </div>
              <div className="flex items-center gap-3">
                {l.service && (
                  <span className="text-[8px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded uppercase">
                    {l.service}
                  </span>
                )}
                <button
                  onClick={async () => { if (confirm("Delete this lead?")) { await deleteLead(l.id); load(); toast.success("Lead deleted"); } }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{l.message}</p>
            <div className="text-[9px] text-muted/60 font-mono mt-3 text-right">
              Received: {new Date(l.created_at).toLocaleString()}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center border border-dashed border-border rounded-xl">
            <Mail className="mx-auto size-8 text-muted/50 mb-3 animate-pulse" />
            <p className="text-xs text-muted">No leads found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 6. CAREERS
============================================================ */
function CareersPanel() {
  const [apps, setApps] = useState<CareerApplication[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const list = await getApplications();
    setApps(list);
  }

  useEffect(() => { load(); }, []);

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary">Applications ({filtered.length})</h2>
        <input
          placeholder="Search Applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-white/10 bg-background/50 px-4 py-2 text-xs outline-none focus:border-primary text-foreground rounded w-64"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="border border-white/10 bg-surface/20 p-5 rounded-xl">
            <div className="flex flex-wrap justify-between items-start gap-3 border-b border-white/5 pb-2 mb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">{a.name}</h3>
                <p className="text-[10px] text-muted font-mono">{a.email} · {a.role}</p>
              </div>
              <div className="flex items-center gap-3">
                {a.resume_name && (
                  <span className="text-[8px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                    📄 {a.resume_name}
                  </span>
                )}
                <button
                  onClick={async () => { if (confirm("Delete application?")) { await deleteApplication(a.id); load(); toast.success("Deleted application"); } }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            {a.message && <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{a.message}</p>}
            <div className="text-[9px] text-muted/60 font-mono mt-3 text-right">
              Applied: {new Date(a.created_at).toLocaleString()}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center border border-dashed border-border rounded-xl">
            <UserCheck className="mx-auto size-8 text-muted/50 mb-3 animate-pulse" />
            <p className="text-xs text-muted">No applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 7. BLOG
============================================================ */
function BlogPanel() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [desc, setDesc] = useState("");

  const defaultBlogs = [
    { title: "Why Modular Monoliths Still Win in 2026", category: "Software Development", desc: "How to ship faster without microservices complexity." },
    { title: "A Practical Guide to Multi-Region on AWS", category: "Cloud Computing", desc: "Failover, latency and costs details explained." },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("st_blogs");
    if (stored) {
      setBlogs(JSON.parse(stored));
    } else {
      localStorage.setItem("st_blogs", JSON.stringify(defaultBlogs));
      setBlogs(defaultBlogs);
    }
  }, []);

  function save(list: any[]) {
    localStorage.setItem("st_blogs", JSON.stringify(list));
    setBlogs(list);
    toast.success("Blog list updated");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] animate-fade-in">
      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">New Blog Post</h2>
        <form onSubmit={(e) => { e.preventDefault(); if (!title || !desc) return; save([...blogs, { title, category, desc }]); setTitle(""); setDesc(""); }} className="space-y-4 border border-white/10 bg-surface/30 p-6 rounded-xl">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Post Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Category</label>
            <input required value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Summary / Content</label>
            <textarea required rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>
          <button type="submit" className="w-full bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold py-3 hover:brightness-110">
            Publish Post
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Blog Posts ({blogs.length})</h2>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {blogs.map((b, idx) => (
            <div key={idx} className="border border-white/10 bg-surface/20 p-4 rounded-xl relative">
              <button onClick={() => save(blogs.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-muted hover:text-red-400">
                <Trash2 className="size-4" />
              </button>
              <span className="text-[8px] font-mono text-primary uppercase">{b.category}</span>
              <h3 className="font-bold text-sm text-foreground mt-1">{b.title}</h3>
              <p className="text-xs text-muted mt-2 line-clamp-3">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 8. ACADEMIC PARTNERSHIPS (READ ONLY OVERVIEW)
============================================================ */
function PartnershipsPanel() {
  const [colleges, setColleges] = useState<MouCollege[]>([]);
  useEffect(() => { getMous().then(setColleges); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-mono text-xs uppercase tracking-widest text-primary">Partnership Directory</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {colleges.map((c) => (
          <div key={c.id} className="border border-white/10 bg-surface/20 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-foreground leading-tight">{c.college_name}</h3>
                <span className={`px-2 py-0.5 rounded font-mono text-[8px] border uppercase ${c.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-muted mt-2 flex items-center gap-1"><MapPin className="size-3 text-primary" /> {c.location}</p>
              
              <div className="mt-4 border-t border-white/5 pt-3 grid grid-cols-2 gap-2 text-xs text-muted">
                <div>
                  <span className="block text-[10px] text-muted/60">Signed Date</span>
                  <span>{c.signed_date}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted/60">Expiry Date</span>
                  <span>{c.expiry_date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 9. MOU MANAGEMENT (ADD, EDIT, DELETE, UPLOAD)
============================================================ */
function MouManagementPanel() {
  const [colleges, setColleges] = useState<MouCollege[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [person, setPerson] = useState("");
  const [email, setEmail] = useState("");
  const [signedDate, setSignedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState<"Active" | "Expired">("Active");
  const [signedMouUrl, setSignedMouUrl] = useState("");

  // Categories Programs Tag states
  const [internships, setInternships] = useState<string[]>([]);
  const [trainings, setTrainings] = useState<string[]>([]);
  const [workshops, setWorkshops] = useState<string[]>([]);

  // Helpers for tag inputs
  const [newInternship, setNewInternship] = useState("");
  const [newTraining, setNewTraining] = useState("");
  const [newWorkshop, setNewWorkshop] = useState("");

  async function load() {
    const data = await getMous();
    setColleges(data);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setLogo("");
    setLocation("");
    setWebsite("");
    setPerson("");
    setEmail("");
    setSignedDate("");
    setExpiryDate("");
    setStatus("Active");
    setSignedMouUrl("");
    setInternships([]);
    setTrainings([]);
    setWorkshops([]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !location || !signedDate || !expiryDate) {
      toast.error("Please fill in College Name, Location, Signed Date and Expiry Date.");
      return;
    }

    try {
      await saveMou({
        id: editingId || undefined,
        college_name: name,
        logo_url: logo || null,
        location,
        website_url: website,
        contact_person: person,
        contact_email: email,
        signed_date: signedDate,
        expiry_date: expiryDate,
        status,
        signed_mou_url: signedMouUrl || null,
        images: [],
        internship_programs: internships,
        training_programs: trainings,
        workshops: workshops,
        guest_lectures: [],
        hackathons: [],
        placement_drives: [],
        industrial_visits: [],
      });
      resetForm();
      load();
      toast.success("MOU Document Saved Successfully!");
    } catch {
      toast.error("Failed to save MOU.");
    }
  }

  function startEdit(c: MouCollege) {
    setEditingId(c.id);
    setName(c.college_name);
    setLogo(c.logo_url || "");
    setLocation(c.location);
    setWebsite(c.website_url);
    setPerson(c.contact_person);
    setEmail(c.contact_email);
    setSignedDate(c.signed_date);
    setExpiryDate(c.expiry_date);
    setStatus(c.status);
    setSignedMouUrl(c.signed_mou_url || "");
    setInternships(c.internship_programs || []);
    setTrainings(c.training_programs || []);
    setWorkshops(c.workshops || []);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] animate-fade-in">
      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
          {editingId ? "Edit College MoU Record" : "Add New College MoU"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4 border border-white/10 bg-surface/30 p-6 rounded-xl text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">College Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">College Logo URL</label>
              <input value={logo} onChange={(e) => setLogo(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Location *</label>
              <input required value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" placeholder="Chennai, Tamil Nadu" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">College Website URL</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Signed MoU PDF Document Name</label>
              <input value={signedMouUrl} onChange={(e) => setSignedMouUrl(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" placeholder="mou-doc-signed.pdf" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Contact Person</label>
              <input value={person} onChange={(e) => setPerson(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Contact Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Signed Date *</label>
              <input type="date" required value={signedDate} onChange={(e) => setSignedDate(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Expiry Date *</label>
              <input type="date" required value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground">
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Dynamic Partnership Lists */}
          <div className="border border-white/5 p-4 rounded bg-surface/25 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary">Manage Partnership Program Details</h3>
            
            {/* Internships tags */}
            <div>
              <span className="text-[10px] text-muted block mb-1">Internship Programs Offered</span>
              <div className="flex gap-2">
                <input value={newInternship} onChange={(e) => setNewInternship(e.target.value)} className="w-full border border-white/10 bg-background px-3 py-1 text-xs outline-none focus:border-primary text-foreground" placeholder="e.g. Summer Dev Internship" />
                <button type="button" onClick={() => { if (newInternship) { setInternships([...internships, newInternship]); setNewInternship(""); } }} className="bg-primary/20 border border-primary/40 text-primary px-3 text-xs">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {internships.map((it, idx) => (
                  <span key={idx} className="bg-surface border border-white/10 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                    {it} <X className="size-3 text-red-400 cursor-pointer" onClick={() => setInternships(internships.filter((_, i) => i !== idx))} />
                  </span>
                ))}
              </div>
            </div>

            {/* Training programs */}
            <div>
              <span className="text-[10px] text-muted block mb-1">Training Programs Offered</span>
              <div className="flex gap-2">
                <input value={newTraining} onChange={(e) => setNewTraining(e.target.value)} className="w-full border border-white/10 bg-background px-3 py-1 text-xs outline-none focus:border-primary text-foreground" placeholder="e.g. AWS Cloud Masterclass" />
                <button type="button" onClick={() => { if (newTraining) { setTrainings([...trainings, newTraining]); setNewTraining(""); } }} className="bg-primary/20 border border-primary/40 text-primary px-3 text-xs">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {trainings.map((it, idx) => (
                  <span key={idx} className="bg-surface border border-white/10 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                    {it} <X className="size-3 text-red-400 cursor-pointer" onClick={() => setTrainings(trainings.filter((_, i) => i !== idx))} />
                  </span>
                ))}
              </div>
            </div>

            {/* Workshops */}
            <div>
              <span className="text-[10px] text-muted block mb-1">Workshops Conducted</span>
              <div className="flex gap-2">
                <input value={newWorkshop} onChange={(e) => setNewWorkshop(e.target.value)} className="w-full border border-white/10 bg-background px-3 py-1 text-xs outline-none focus:border-primary text-foreground" placeholder="e.g. AI-ML Bootcamp" />
                <button type="button" onClick={() => { if (newWorkshop) { setWorkshops([...workshops, newWorkshop]); setNewWorkshop(""); } }} className="bg-primary/20 border border-primary/40 text-primary px-3 text-xs">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {workshops.map((it, idx) => (
                  <span key={idx} className="bg-surface border border-white/10 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                    {it} <X className="size-3 text-red-400 cursor-pointer" onClick={() => setWorkshops(workshops.filter((_, i) => i !== idx))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold py-3 hover:brightness-110">
              {editingId ? "Update MoU College" : "Register MoU College"}
            </button>
            <button type="button" onClick={resetForm} className="border border-white/10 px-4 py-3 font-mono text-[10px] uppercase text-muted">Reset</button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Registered College MoUs ({colleges.length})</h2>
        <div className="space-y-3 max-h-[85vh] overflow-y-auto pr-2">
          {colleges.map((c) => (
            <div key={c.id} className="border border-white/10 bg-surface/20 p-4 rounded-xl relative">
              <span className={`absolute top-4 right-4 rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border ${c.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                {c.status}
              </span>
              <h3 className="font-bold text-sm text-foreground pr-16">{c.college_name}</h3>
              <p className="text-[10px] text-muted font-mono mt-1">{c.location} · {c.contact_email}</p>
              
              <div className="mt-3 flex gap-3">
                <button onClick={() => startEdit(c)} className="font-mono text-[9px] uppercase tracking-widest text-primary hover:underline">Edit</button>
                <button
                  onClick={async () => {
                    if (confirm("Delete MoU? This cannot be undone.")) {
                      await deleteMou(c.id);
                      load();
                      toast.success("MoU deleted successfully");
                    }
                  }}
                  className="font-mono text-[9px] uppercase tracking-widest text-red-400 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={async () => {
                    const nextStatus = c.status === "Active" ? "Expired" : "Active";
                    await saveMou({ ...c, status: nextStatus });
                    load();
                    toast.success(`Partnership status set to ${nextStatus}`);
                  }}
                  className="font-mono text-[9px] uppercase tracking-widest text-amber-400 hover:underline"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANELS: 10. SETTINGS
============================================================ */
function SettingsPanel() {
  const [sandbox, setSandbox] = useState(true);
  const [contactEmail, setContactEmail] = useState("stsoftware23@gmail.com");

  // Load persisted settings on mount
  useEffect(() => {
    const stored = localStorage.getItem("st_settings");
    if (stored) {
      try {
        const s = JSON.parse(stored);
        if (s.contactEmail) setContactEmail(s.contactEmail);
        if (typeof s.sandbox === "boolean") setSandbox(s.sandbox);
      } catch {}
    }
  }, []);

  function saveSettings() {
    localStorage.setItem("st_settings", JSON.stringify({ contactEmail, sandbox }));
    toast.success("Settings saved successfully");
  }

  return (
    <div className="max-w-xl space-y-6 animate-fade-in border border-white/10 bg-surface/30 p-6 rounded-xl">
      <h2 className="font-mono text-xs uppercase tracking-widest text-primary">System Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-muted">Primary Notification Email</label>
          <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground" />
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <h4 className="text-xs font-bold">Storage Hybrid Sandbox Mode</h4>
            <p className="text-[10px] text-muted">Automatically mirror all database records into client storage.</p>
          </div>
          <input type="checkbox" checked={sandbox} onChange={(e) => setSandbox(e.target.checked)} className="size-4 text-primary" />
        </div>

        <div className="border-t border-white/5 pt-4">
          <button onClick={saveSettings} className="bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold py-2.5 px-6 hover:brightness-110">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
