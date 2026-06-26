import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — ST Software Solution" },
      { name: "description", content: "Join ST Software Solution — open internships in web, React, Python, UI/UX, and digital marketing." },
      { property: "og:title", content: "Careers — ST Software Solution" },
      { property: "og:description", content: "Build the future with us." },
    ],
  }),
  component: CareersPage,
});

const ROLES = [
  { title: "Web Development Intern", type: "Internship · 3 mo", location: "Tiruppur / Remote" },
  { title: "React Developer Intern", type: "Internship · 3 mo", location: "Tiruppur / Remote" },
  { title: "Python Developer Intern", type: "Internship · 3 mo", location: "Tiruppur / Remote" },
  { title: "UI/UX Designer Intern", type: "Internship · 3 mo", location: "Remote" },
  { title: "Digital Marketing Intern", type: "Internship · 3 mo", location: "Remote" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  role: z.string().min(1, "Select a role"),
  message: z.string().trim().max(1000).optional(),
  resume: z.string().min(1, "Attach a resume").optional().or(z.literal("")),
});

function CareersPage() {
  const [role, setRole] = useState(ROLES[0].title);
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      role: fd.get("role"),
      message: fd.get("message"),
      resume: (fd.get("resume") as File | null)?.name ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setBusy(true);
    
    import("@/lib/mou-storage").then(({ saveApplication }) => {
      saveApplication({
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        message: parsed.data.message || "",
        resume_name: parsed.data.resume || "resume.pdf"
      }).then(() => {
        setBusy(false);
        toast.success("Application received! We'll be in touch.");
        (e.target as HTMLFormElement).reset();
      }).catch(() => {
        setBusy(false);
        toast.error("Failed to save application.");
      });
    });
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Careers"
        title={<>Build the <span className="text-gradient-primary">future</span> with us.</>}
        subtitle="We're a senior team that loves mentoring the next generation. Internships pay, ship real client work, and often convert to full-time."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-8 text-2xl font-bold">Open roles</h2>
        <div className="grid gap-4">
          {ROLES.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><Briefcase className="size-3 text-primary" />{r.type}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3 text-primary" />{r.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3 text-primary" />Rolling</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setRole(r.title);
                    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-primary/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-primary hover:bg-primary/10"
                >
                  Apply
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div id="apply" className="mt-16">
          <GlassCard>
            <h3 className="text-2xl font-bold">Apply now</h3>
            <p className="mt-1 text-sm text-muted">Fill in the form below — we read every application personally.</p>
            <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Full name</span>
                <input name="name" required maxLength={100} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Email</span>
                <input name="email" required type="email" maxLength={255} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block md:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Role</span>
                <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                  {ROLES.map((r) => <option key={r.title} value={r.title}>{r.title}</option>)}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Why us? (optional)</span>
                <textarea name="message" rows={4} maxLength={1000} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block md:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Resume (PDF)</span>
                <div className="mt-2 flex items-center gap-3 border border-dashed border-border bg-background/50 px-4 py-6 text-sm text-muted">
                  <Upload className="size-4 text-primary" />
                  <input name="resume" type="file" accept=".pdf,.doc,.docx" className="flex-1 file:mr-3 file:border file:border-primary/40 file:bg-transparent file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-widest file:text-primary" />
                </div>
              </label>
              <button disabled={busy} className="md:col-span-2 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110 disabled:opacity-50">
                {busy ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </SiteLayout>
  );
}
