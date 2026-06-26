import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — ST Software Solution" },
      { name: "description", content: "Deep dives into the challenges, solutions, and measurable results we've delivered for real clients." },
      { property: "og:title", content: "Case Studies — ST Software Solution" },
      { property: "og:description", content: "Real client outcomes from ST Software Solution." },
    ],
  }),
  component: CaseStudiesPage,
});

const CASES = [
  {
    client: "EduSpark Academy",
    industry: "Education",
    challenge: "Students preparing for placement interviews had no realistic, on-demand practice tool and dropped out of prep within a week.",
    solution: "An AI Interview Coach simulating role-specific interviews with voice-to-voice feedback, scoring, and personalized improvement plans.",
    process: ["2-week discovery & curriculum mapping", "RAG-powered question bank", "Voice + scoring pipeline", "Beta with 200 students"],
    results: [
      { icon: TrendingUp, k: "+38%", v: "Placement success rate" },
      { icon: Clock, k: "10 hrs", v: "Avg. self-practice / student / week" },
      { icon: DollarSign, k: "4x", v: "Subscription renewal rate" },
    ],
    before: "Manual mock interviews limited to 1/student/month, no analytics.",
    after: "24/7 AI coach, dashboard for trainers, automated weekly reports.",
  },
  {
    client: "Velora Retail",
    industry: "Manufacturing / Retail",
    challenge: "Stock mismatches across 6 warehouses caused ₹40L of dead inventory and constant fulfilment delays.",
    solution: "Real-time inventory & warehouse OS with barcode scanning, role-based access, and stock alerts.",
    process: ["Warehouse audit", "Phased rollout per location", "Barcode integration", "Manager training"],
    results: [
      { icon: TrendingUp, k: "-72%", v: "Stock mismatch incidents" },
      { icon: Clock, k: "3.5x", v: "Faster fulfilment" },
      { icon: DollarSign, k: "₹28L", v: "Inventory cost recovered" },
    ],
    before: "Excel sheets, weekly reconciliations, frequent stock-outs.",
    after: "Live dashboards, automated low-stock alerts, single source of truth.",
  },
  {
    client: "Northwind Finance",
    industry: "Business / Finance",
    challenge: "Founders couldn't get a unified daily view of profit, loss, cash in, and cash out across 3 entities.",
    solution: "Revenue Analyzer Dashboard with custom KPIs, daily/weekly/monthly drill-downs, and Slack alerts.",
    process: ["KPI workshops", "Data warehouse build", "Dashboard MVP in 4 weeks", "Iterative refinement"],
    results: [
      { icon: TrendingUp, k: "+22%", v: "Margin in 6 months" },
      { icon: Clock, k: "6 hrs", v: "Saved per week on reporting" },
      { icon: DollarSign, k: "0", v: "Late tax filings" },
    ],
    before: "Monthly PDF reports from accountant, no real-time view.",
    after: "Self-serve dashboard, live alerts, founder-friendly visualizations.",
  },
];

function CaseStudiesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Case Studies"
        title={<>Real <span className="text-gradient-primary">outcomes</span>, not just demos.</>}
        subtitle="Every project we ship is measured in business results. Here's the proof."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="space-y-12">
          {CASES.map((c, i) => (
            <motion.div
              key={c.client}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard>
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-primary">{c.industry}</div>
                    <h3 className="mt-2 text-2xl font-bold md:text-3xl">{c.client}</h3>
                    <div className="mt-6 space-y-4 text-sm">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Challenge</div>
                        <p className="mt-1 text-foreground/90">{c.challenge}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Solution</div>
                        <p className="mt-1 text-foreground/90">{c.solution}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Process</div>
                        <ol className="mt-1 list-decimal space-y-1 pl-5 text-muted">
                          {c.process.map((p) => <li key={p}>{p}</li>)}
                        </ol>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background/40 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Before</div>
                        <p className="mt-1 text-sm">{c.before}</p>
                      </div>
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-primary">After</div>
                        <p className="mt-1 text-sm">{c.after}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid content-start gap-4">
                    {c.results.map((r) => (
                      <div key={r.v} className="rounded-2xl border border-border bg-background/40 p-6">
                        <r.icon className="size-6 text-primary" />
                        <div className="mt-3 text-3xl font-bold text-primary">{r.k}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110">
            Become Our Next Case Study <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
