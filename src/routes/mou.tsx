import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { FileText, Calendar, Printer } from "lucide-react";
import { SiteLayout, GlassCard } from "@/components/site-layout";
import { listPublishedMous, type MouDoc } from "@/lib/mou.functions";

export const Route = createFileRoute("/mou")({
  head: () => ({
    meta: [
      { title: "MOU — ST Software Solution" },
      { name: "description", content: "Memorandums of Understanding published by ST Software Solution." },
      { property: "og:title", content: "MOU — ST Software Solution" },
      { property: "og:description", content: "Read official MOUs and partnership agreements." },
    ],
  }),
  component: MouPage,
});

function MouPage() {
  const fetchMous = useServerFn(listPublishedMous);
  const [mous, setMous] = useState<MouDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<MouDoc | null>(null);

  useEffect(() => {
    fetchMous()
      .then((d) => {
        setMous(d);
        setActive(d[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchMous]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Official Documents</div>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Memorandum of <span className="text-gradient-primary">Understanding</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Browse partnership agreements and MOUs published by ST Software Solution.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted">Loading documents…</div>
        ) : mous.length === 0 ? (
          <GlassCard className="py-16 text-center">
            <FileText className="mx-auto mb-4 size-10 text-primary" />
            <p className="text-muted">No MOUs published yet. Please check back soon.</p>
          </GlassCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside>
              <GlassCard className="!p-3">
                <nav className="grid gap-1">
                  {mous.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActive(m)}
                      className={
                        "flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all " +
                        (active?.id === m.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted hover:bg-surface hover:text-foreground")
                      }
                    >
                      <FileText className="mt-0.5 size-4 shrink-0" />
                      <span className="line-clamp-2">{m.title}</span>
                    </button>
                  ))}
                </nav>
              </GlassCard>
            </aside>

            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{active.title}</h2>
                      <div className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                        <Calendar className="size-3" />
                        Updated {new Date(active.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 border border-primary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
                    >
                      <Printer className="size-3" /> Print
                    </button>
                  </div>
                  <article className="prose prose-invert mt-6 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {active.content || <span className="text-muted">No content.</span>}
                  </article>
                </GlassCard>
              </motion.div>
            )}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
