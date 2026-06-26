import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ST Software Solution" },
      { name: "description", content: "Flexible engagement models — fixed cost, dedicated team, hourly, and startup MVP packages." },
      { property: "og:title", content: "Pricing — ST Software Solution" },
      { property: "og:description", content: "Engagement models that fit your stage, scope, and budget." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Fixed Cost",
    tag: "For defined scope",
    price: "From ₹1.5L",
    period: "/ project",
    items: ["Fully scoped SOW", "Milestone-based delivery", "Predictable budget", "30-day post-launch support"],
    cta: "Get a Quote",
    featured: false,
  },
  {
    name: "Dedicated Team",
    tag: "Monthly hiring",
    price: "From ₹1.8L",
    period: "/ engineer / mo",
    items: ["Senior full-stack / AI engineers", "Embedded with your team", "Weekly sprint cadence", "Cancel anytime monthly"],
    cta: "Hire Talent",
    featured: true,
  },
  {
    name: "Hourly",
    tag: "Consulting & support",
    price: "₹1,500",
    period: "/ hour",
    items: ["Code reviews & audits", "On-demand troubleshooting", "Architecture consulting", "No minimum commitment"],
    cta: "Book Hours",
    featured: false,
  },
  {
    name: "Startup MVP",
    tag: "For founders",
    price: "₹3.5L",
    period: "/ MVP",
    items: ["Ship in 6 weeks", "Web + mobile responsive", "Auth, payments, admin", "Pitch-deck-ready demo"],
    cta: "Launch My MVP",
    featured: false,
  },
];

function PricingPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Engagement Models"
        title={<>Pricing that <span className="text-gradient-primary">fits your stage</span>.</>}
        subtitle="Pick the engagement model that matches your scope, team, and runway. All plans include senior-level talent and clear weekly reporting."
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <GlassCard className={"h-full flex flex-col " + (p.featured ? "border-primary/60 shadow-[0_20px_60px_-20px_rgba(212,175,55,0.4)]" : "")}>
                {p.featured && (
                  <div className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                    <Star className="size-3" /> Most popular
                  </div>
                )}
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">{p.tag}</div>
                <h3 className="mt-2 text-2xl font-bold">{p.name}</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{it}</li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={
                    "mt-8 inline-block px-6 py-3 text-center text-xs font-bold uppercase tracking-widest transition-all " +
                    (p.featured
                      ? "bg-primary text-background hover:brightness-110"
                      : "border border-primary/40 text-primary hover:bg-primary/10")
                  }
                >
                  {p.cta}
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted">
          Not sure which fits? <Link to="/contact" className="text-primary hover:underline">Book a free 30-min consultation →</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
