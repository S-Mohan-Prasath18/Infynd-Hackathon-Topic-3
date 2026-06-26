import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { listProjects, type PublicProject } from "@/lib/projects.functions";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — ST Software Solution" },
      { name: "description", content: "Explore the AI tools, dashboards, ERP/CRM systems, and digital products we've shipped for ambitious teams." },
      { property: "og:title", content: "Portfolio — ST Software Solution" },
      { property: "og:description", content: "Selected work from ST Software Solution." },
    ],
  }),
  component: PortfolioPage,
});

const SAMPLE: PublicProject[] = [
  {
    id: "s1", title: "AI Interview Coach", description: "AI-powered interview simulator with personalized feedback and scoring for students.",
    category: "AI/ML", cover_url: null, project_url: null,
    tech: ["Python", "LangChain", "Gemini", "FastAPI", "React"], featured: true, sort_order: 1,
  },
  {
    id: "s2", title: "Revenue Analyzer Dashboard", description: "Interactive dashboard giving small businesses clear daily, weekly, and monthly financial visibility.",
    category: "SaaS", cover_url: null, project_url: null,
    tech: ["React", "Node.js", "MongoDB", "Recharts"], featured: true, sort_order: 2,
  },
  {
    id: "s3", title: "Inventory Management System", description: "Real-time inventory dashboard with product, warehouse, and stock-alert workflows.",
    category: "SaaS", cover_url: null, project_url: null,
    tech: ["React", "Node.js", "MySQL", "Tailwind"], featured: false, sort_order: 3,
  },
  {
    id: "s4", title: "CRM System", description: "Lead tracking, customer profiles, quotation management, and support tickets — in one platform.",
    category: "SaaS", cover_url: null, project_url: null,
    tech: ["React", "Supabase", "Tailwind", "shadcn/ui"], featured: false, sort_order: 4,
  },
  {
    id: "s5", title: "AI Resume Analyzer", description: "AI resume parser and scoring system that accelerates recruiter screening.",
    category: "AI/ML", cover_url: null, project_url: null,
    tech: ["Python", "NLP", "Gemini API", "FastAPI", "React"], featured: false, sort_order: 5,
  },
];

function PortfolioPage() {
  const list = useServerFn(listProjects);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    list()
      .then((data) => setProjects(data.length ? data : SAMPLE))
      .catch(() => setProjects(SAMPLE));
  }, [list]);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Work"
        title={<>Selected <span className="text-gradient-primary">projects</span> & products.</>}
        subtitle="A glimpse into the AI tools, dashboards, ERP/CRM systems, and digital products we've built for clients across industries."
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={
                "border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all " +
                (filter === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:border-primary/40 hover:text-primary")
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <GlassCard className="h-full">
                <div className="-mx-6 -mt-6 mb-4 aspect-video overflow-hidden bg-gradient-to-br from-primary/20 via-surface to-secondary/20">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center font-mono text-xs text-muted">{p.category}</div>
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">{p.category}</div>
                <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-3">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
                {p.project_url && (
                  <a href={p.project_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                    Visit <ExternalLink className="size-3" />
                  </a>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact" className="inline-block bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110">
            Start Your Project
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
