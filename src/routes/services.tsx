import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Brain, Sparkles, BarChart3, Cloud, Palette, Database, Compass, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ST Software Solution" },
      { name: "description", content: "Web, mobile, AI, cloud, analytics, design, ERP/CRM, and digital transformation consulting — delivered by a senior team." },
      { property: "og:title", content: "Services — ST Software Solution" },
      { property: "og:description", content: "Full-stack digital services to design, build, and scale your business." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: Globe,
    title: "Web Development",
    problem: "Slow, generic websites that don't convert visitors.",
    features: ["High-performance Next.js / React builds", "SEO + Core Web Vitals tuned", "Headless CMS integration"],
    tech: ["React", "Next.js", "TypeScript", "Tailwind"],
    benefit: "Sites that load fast, rank higher, and convert more leads.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    problem: "Customers expect native-quality mobile experiences.",
    features: ["iOS + Android in a single codebase", "Push notifications & offline support", "App store submission handled"],
    tech: ["Flutter", "React Native", "Firebase"],
    benefit: "Ship cross-platform apps in weeks, not months.",
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    problem: "Sitting on data but no predictive intelligence.",
    features: ["Custom ML models", "Computer vision pipelines", "Recommendation engines"],
    tech: ["Python", "TensorFlow", "PyTorch", "FastAPI"],
    benefit: "Turn raw data into decisions and automation.",
  },
  {
    icon: Sparkles,
    title: "Generative AI Applications",
    problem: "Teams drowning in repetitive content & support work.",
    features: ["RAG chatbots over your docs", "AI copilots & agents", "Voice & document automation"],
    tech: ["LangChain", "Gemini", "OpenAI", "Vector DBs"],
    benefit: "10x knowledge worker productivity with safe, branded AI.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Power BI",
    problem: "Spreadsheets everywhere, insights nowhere.",
    features: ["Executive dashboards", "ETL & data warehouses", "Self-serve reporting"],
    tech: ["Power BI", "SQL", "Python", "BigQuery"],
    benefit: "One source of truth for every business decision.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    problem: "Servers that crash on growth or burn cash.",
    features: ["AWS / Azure architecture", "Auto-scaling & CI/CD", "Cost optimization"],
    tech: ["AWS", "Azure", "Docker", "Kubernetes"],
    benefit: "Infra that scales with you — without surprise bills.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    problem: "Confusing flows hurting conversion and retention.",
    features: ["Product research & wireframes", "Design systems", "Usability testing"],
    tech: ["Figma", "Framer", "Lottie"],
    benefit: "Interfaces customers love and competitors envy.",
  },
  {
    icon: Database,
    title: "ERP / CRM Development",
    problem: "Off-the-shelf tools that don't fit your workflow.",
    features: ["Custom modules", "Role-based access", "Inventory, sales, HR & finance"],
    tech: ["Node.js", "Postgres", "Supabase"],
    benefit: "Run your entire operation in one purpose-built platform.",
  },
  {
    icon: Compass,
    title: "Digital Transformation Consulting",
    problem: "Knowing you need to modernize — but not where to start.",
    features: ["Technology audit", "Roadmap & ROI modelling", "Change management"],
    tech: ["Strategy", "Workshops", "Discovery"],
    benefit: "A clear, prioritized path from legacy to modern.",
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="What we do"
        title={<>Services built for <span className="text-gradient-primary">measurable impact</span>.</>}
        subtitle="From discovery to deployment — nine focused service lines, one accountable team."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <GlassCard className="h-full flex flex-col">
                <s.icon className="size-8 text-primary" />
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-xs text-muted">
                  <span className="font-mono uppercase tracking-widest text-primary">Problem · </span>
                  {s.problem}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted">
                  {s.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-primary">→</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tech.map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm italic text-foreground/80">{s.benefit}</p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:gap-3 transition-all"
                >
                  Request Quote <ArrowRight className="size-3" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
