import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — ST Software Solution" },
      { name: "description", content: "Insights on AI, custom software, Power BI, cloud, and digital transformation from the ST Software Solution team." },
      { property: "og:title", content: "Blog — ST Software Solution" },
      { property: "og:description", content: "Practical insights from the ST Software Solution team." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  { slug: "ai-trends-2026", title: "AI Trends for Business in 2026", excerpt: "Where AI is creating real ROI right now — and the hype cycles to skip.", date: "May 2026", tag: "AI" },
  { slug: "why-custom-software", title: "Why Every Business Needs a Custom Software Solution", excerpt: "When off-the-shelf tools start costing more than they save.", date: "Apr 2026", tag: "Strategy" },
  { slug: "powerbi-dashboards", title: "Power BI Dashboards for Smarter Decisions", excerpt: "A practical framework for building dashboards executives actually use.", date: "Mar 2026", tag: "Analytics" },
  { slug: "cloud-startups", title: "Cloud Computing for Startups", excerpt: "How to architect on AWS/Azure without burning your seed round.", date: "Feb 2026", tag: "Cloud" },
  { slug: "case-ai-interview-coach", title: "Case Study: Building an AI Interview Coach", excerpt: "Behind the scenes of an AI product that lifted placements by 38%.", date: "Jan 2026", tag: "Case Study" },
  { slug: "rag-in-production", title: "Putting RAG Chatbots into Production", excerpt: "Vector DBs, evals, and the boring parts that make GenAI reliable.", date: "Dec 2025", tag: "AI" },
];

function BlogPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Insights"
        title={<>Ideas, frameworks, and <span className="text-gradient-primary">field notes</span>.</>}
        subtitle="Things we've learned shipping software, AI, and data products for real businesses."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <GlassCard className="h-full flex flex-col">
                <div className="-mx-6 -mt-6 mb-4 aspect-video bg-gradient-to-br from-primary/20 via-surface to-secondary/20" />
                <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-muted">
                  <span className="text-primary">{p.tag}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{p.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
                <Link to="/contact" className="mt-auto pt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                  Read more <ArrowRight className="size-3" />
                </Link>
              </GlassCard>
            </motion.article>
          ))}
        </div>

        <GlassCard className="mt-16 text-center">
          <h3 className="text-2xl font-bold">Get monthly insights in your inbox</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">No spam. Just the best of what we learn each month.</p>
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              import("sonner").then(({ toast }) => toast.success("Subscribed! Welcome aboard."));
              (e.target as HTMLFormElement).reset();
            }}
          >
            <input type="email" required placeholder="you@company.com" className="flex-1 border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <button className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110">Subscribe</button>
          </form>
        </GlassCard>
      </section>
    </SiteLayout>
  );
}
