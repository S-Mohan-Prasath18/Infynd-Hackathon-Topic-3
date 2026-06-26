import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Receipt, LifeBuoy, CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/client-portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — ST Software Solution" },
      { name: "description", content: "Track project status, share documents, manage invoices and tickets in one place." },
    ],
  }),
  component: ClientPortal,
});

type Tab = "dashboard" | "documents" | "invoices" | "tickets";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "tickets", label: "Support", icon: LifeBuoy },
];

const PROJECTS = [
  { name: "Revenue Analyzer Dashboard", progress: 78, status: "In progress", phase: "QA & Polish" },
  { name: "Inventory OS — Phase 2", progress: 42, status: "In progress", phase: "Development" },
  { name: "AI Resume Analyzer", progress: 100, status: "Delivered", phase: "Maintenance" },
];

const DOCS = [
  { name: "MSA — Master Services Agreement.pdf", size: "412 KB", date: "12 Mar 2026" },
  { name: "Inventory OS — SOW v2.pdf", size: "284 KB", date: "01 Apr 2026" },
  { name: "Brand assets & guidelines.zip", size: "12.4 MB", date: "18 Apr 2026" },
];

const INVOICES = [
  { id: "INV-2026-014", project: "Revenue Analyzer", amount: "₹1,80,000", status: "Paid", due: "01 Apr 2026" },
  { id: "INV-2026-021", project: "Inventory OS", amount: "₹2,40,000", status: "Due", due: "30 Jun 2026" },
  { id: "INV-2026-022", project: "Resume Analyzer", amount: "₹85,000", status: "Sent", due: "15 Jul 2026" },
];

const TICKETS = [
  { id: "T-218", title: "PDF export missing on Safari", status: "Open", priority: "High", updated: "2h ago" },
  { id: "T-217", title: "Add new role: Inventory Manager", status: "In review", priority: "Medium", updated: "1d ago" },
  { id: "T-210", title: "Login redirect on mobile", status: "Resolved", priority: "Low", updated: "5d ago" },
];

function ClientPortal() {
  const [tab, setTab] = useState<Tab>("dashboard");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Client Portal · Demo</div>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Welcome back, <span className="text-gradient-primary">Acme Co.</span></h1>
            <p className="mt-1 text-sm text-muted">Real-time project status, documents, billing, and support — in one place.</p>
          </div>
          <Link to="/contact" className="border border-primary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10">
            Request Demo
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside>
            <GlassCard className="!p-3">
              <nav className="grid gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all " +
                      (tab === t.id ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface hover:text-foreground")
                    }
                  >
                    <t.icon className="size-4" />
                    {t.label}
                  </button>
                ))}
              </nav>
            </GlassCard>
          </aside>

          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { k: "3", v: "Active projects" },
                    { k: "12", v: "Hrs this week" },
                    { k: "₹3.25L", v: "Pending invoices" },
                  ].map((s) => (
                    <GlassCard key={s.v}>
                      <div className="text-3xl font-bold text-primary">{s.k}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{s.v}</div>
                    </GlassCard>
                  ))}
                </div>
                <GlassCard>
                  <h3 className="font-bold">Project status</h3>
                  <div className="mt-4 space-y-4">
                    {PROJECTS.map((p) => (
                      <div key={p.name}>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-muted">{p.phase} · {p.progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.progress}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {tab === "documents" && (
              <GlassCard>
                <h3 className="font-bold">Shared documents</h3>
                <div className="mt-4 divide-y divide-border">
                  {DOCS.map((d) => (
                    <div key={d.name} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <div className="text-sm font-medium">{d.name}</div>
                        <div className="text-xs text-muted">{d.size} · {d.date}</div>
                      </div>
                      <button className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">
                        <Download className="size-3" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {tab === "invoices" && (
              <GlassCard className="!p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-surface/60 text-left font-mono text-[10px] uppercase tracking-widest text-muted">
                    <tr><th className="p-4">Invoice</th><th className="p-4">Project</th><th className="p-4">Amount</th><th className="p-4">Due</th><th className="p-4">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {INVOICES.map((i) => (
                      <tr key={i.id}>
                        <td className="p-4 font-mono text-xs">{i.id}</td>
                        <td className="p-4">{i.project}</td>
                        <td className="p-4 font-medium">{i.amount}</td>
                        <td className="p-4 text-muted">{i.due}</td>
                        <td className="p-4">
                          <span className={
                            "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest " +
                            (i.status === "Paid" ? "bg-green-500/10 text-green-400" :
                             i.status === "Due" ? "bg-red-500/10 text-red-400" :
                             "bg-primary/10 text-primary")
                          }>{i.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            )}

            {tab === "tickets" && (
              <GlassCard>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Support tickets</h3>
                  <button className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110">New Ticket</button>
                </div>
                <div className="mt-4 space-y-3">
                  {TICKETS.map((t) => (
                    <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/40 p-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{t.id} · {t.updated}</div>
                        <div className="mt-1 font-medium">{t.title}</div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted">{t.priority}</span>
                        <span className="inline-flex items-center gap-1.5">
                          {t.status === "Resolved" ? <CheckCircle2 className="size-4 text-green-400" /> :
                           t.status === "Open" ? <AlertCircle className="size-4 text-red-400" /> :
                           <Clock className="size-4 text-primary" />}
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
