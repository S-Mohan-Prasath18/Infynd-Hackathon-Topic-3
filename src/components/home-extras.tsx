import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Bot, Calculator, FileSearch, FileText, HelpCircle, Download, Bell, Award, ShieldCheck, Star,
  GraduationCap, HeartPulse, Factory, Truck, ShoppingBag, Landmark, Building2, Rocket,
} from "lucide-react";
import { GlassCard } from "@/components/site-layout";

export function HomeStats() {
  const stats = [
    { k: "25+", v: "Projects Completed" },
    { k: "15+", v: "Clients Served" },
    { k: "8+", v: "Team Members" },
    { k: "3+", v: "Years Experience" },
  ];
  return (
    <section className="border-y border-border bg-surface/20 py-14">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.v}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary md:text-5xl">{s.k}</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">{s.v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const INDUSTRIES = [
  { icon: GraduationCap, name: "Education" },
  { icon: HeartPulse, name: "Healthcare" },
  { icon: Factory, name: "Manufacturing" },
  { icon: Truck, name: "Logistics" },
  { icon: ShoppingBag, name: "Retail" },
  { icon: Landmark, name: "Finance" },
  { icon: Building2, name: "Real Estate" },
  { icon: Rocket, name: "Startups" },
];

export function Industries() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Industries We Serve</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Deep expertise across <span className="text-gradient-primary">8 industries</span>.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {INDUSTRIES.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
            >
              <GlassCard className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <it.icon className="size-6" />
                </div>
                <div className="font-medium">{it.name}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STACK = [
  { name: "Python", desc: "AI, automation, data pipelines" },
  { name: "Java", desc: "Enterprise & Android backends" },
  { name: "Flutter", desc: "Cross-platform mobile" },
  { name: "React", desc: "Modern web interfaces" },
  { name: "Next.js", desc: "SSR & marketing sites" },
  { name: "Node.js", desc: "APIs & realtime services" },
  { name: "TensorFlow", desc: "Machine learning models" },
  { name: "LangChain", desc: "LLM orchestration" },
  { name: "Power BI", desc: "Executive dashboards" },
  { name: "AWS", desc: "Scalable cloud infra" },
  { name: "Azure", desc: "Enterprise cloud" },
  { name: "Docker", desc: "Containerized delivery" },
];

export function TechStack() {
  return (
    <section className="border-y border-border bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Technology Stack</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">The tools we use to <span className="text-gradient-primary">build the future</span>.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {STACK.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.05 }}
              className="group relative rounded-xl border border-border bg-background/60 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.name}</div>
              <div className="mt-1 text-sm text-muted">{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Arjun Mehta", role: "CEO, Velora Retail", review: "ST Software delivered our inventory system in 6 weeks. We recovered ₹28L of dead stock in the first quarter.", rating: 5 },
  { name: "Priya Raghavan", role: "Founder, EduSpark", review: "The AI Interview Coach changed our students' outcomes. Placements jumped 38% in one cycle.", rating: 5 },
  { name: "Karthik S.", role: "CFO, Northwind", review: "Finally a dashboard our founders actually open daily. The team listened, iterated, and delivered.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Testimonials</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Loved by <span className="text-gradient-primary">founders & operators</span>.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="h-full">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="size-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.review}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="grid size-10 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const AI_FEATURES = [
  { icon: Bot, title: "AI Chatbot", body: "24/7 visitor assistant that qualifies leads." },
  { icon: Calculator, title: "Project Cost Estimator", body: "Instant ballpark for your idea." },
  { icon: FileSearch, title: "Requirement Analyzer", body: "Turn rough ideas into a clear spec." },
  { icon: FileText, title: "Resume Analyzer", body: "Score and match resumes in seconds." },
  { icon: HelpCircle, title: "FAQ Assistant", body: "Trained on your docs and policies." },
];

export function AIFeatures() {
  return (
    <section className="border-y border-border bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">AI-Powered Tools</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Try our <span className="text-gradient-primary">AI tools</span> — built into your business.</h2>
          <p className="mt-4 text-muted">Production-ready GenAI features we ship into client products every week.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AI_FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <GlassCard>
                <f.icon className="size-7 text-primary" />
                <h3 className="mt-4 font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LeadMagnets() {
  function onSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    import("sonner").then(({ toast }) => toast.success("Subscribed! Welcome aboard."));
    (e.target as HTMLFormElement).reset();
  }
  function onDownload(label: string) {
    import("sonner").then(({ toast }) => toast.success(`${label} — sent to your inbox.`));
  }
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        <GlassCard>
          <Download className="size-7 text-primary" />
          <h3 className="mt-4 text-lg font-bold">Company Profile (PDF)</h3>
          <p className="mt-2 text-sm text-muted">Full overview of services, team, and recent work.</p>
          <button onClick={() => onDownload("Company profile")} className="mt-4 border border-primary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10">
            Download
          </button>
        </GlassCard>
        <GlassCard>
          <FileText className="size-7 text-primary" />
          <h3 className="mt-4 text-lg font-bold">Case Studies Pack</h3>
          <p className="mt-2 text-sm text-muted">Detailed outcomes across AI, ERP, dashboards.</p>
          <button onClick={() => onDownload("Case studies")} className="mt-4 border border-primary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10">
            Download
          </button>
        </GlassCard>
        <GlassCard>
          <Bell className="size-7 text-primary" />
          <h3 className="mt-4 text-lg font-bold">Newsletter</h3>
          <p className="mt-2 text-sm text-muted">Monthly notes on AI, software & growth.</p>
          <form onSubmit={onSubscribe} className="mt-4 flex gap-2">
            <input type="email" required placeholder="you@company.com" className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button className="bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background hover:brightness-110">Join</button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section className="border-t border-border bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Trust & Credibility</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Built on <span className="text-gradient-primary">trust</span>, recognized for quality.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <GlassCard className="text-center">
            <Award className="mx-auto size-8 text-primary" />
            <div className="mt-3 font-bold">15+ Awards</div>
            <div className="text-xs text-muted">Industry recognitions</div>
          </GlassCard>
          <GlassCard className="text-center">
            <ShieldCheck className="mx-auto size-8 text-primary" />
            <div className="mt-3 font-bold">ISO-aligned</div>
            <div className="text-xs text-muted">Secure delivery practices</div>
          </GlassCard>
          <GlassCard className="text-center">
            <Star className="mx-auto size-8 text-primary" />
            <div className="mt-3 font-bold">4.9 / 5</div>
            <div className="text-xs text-muted">Avg. Google review</div>
          </GlassCard>
          <GlassCard className="text-center">
            <ShieldCheck className="mx-auto size-8 text-primary" />
            <div className="mt-3 font-bold">GDPR Ready</div>
            <div className="text-xs text-muted">Privacy-first builds</div>
          </GlassCard>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 opacity-60 sm:grid-cols-4 md:grid-cols-6">
          {["ACME", "VELORA", "EDUSPARK", "NORTHWIND", "SKYLINE", "FORGE"].map((c) => (
            <div key={c} className="grid h-16 place-items-center rounded-xl border border-border bg-background/40 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <GlassCard className="overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
            <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/30 blur-[140px]" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Ready to build?</div>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-6xl">
            Let's turn your <span className="text-gradient-primary">idea</span> into a product that grows.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">Free 30-minute consultation. No commitment.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110">
              Book a Free Consultation
            </Link>
            <Link to="/portfolio" className="border border-primary/40 px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10">
              View Our Projects
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
