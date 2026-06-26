import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Award, Users, Rocket, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ST Software Solution" },
      { name: "description", content: "We are a Tiruppur-based digital studio building software, AI, and cloud platforms that turn ideas into measurable business growth." },
      { property: "og:title", content: "About ST Software Solution" },
      { property: "og:description", content: "Meet the team transforming ambitious businesses through software, AI, and digital products." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Target, title: "Outcome obsessed", body: "We measure success in revenue, retention, and speed-to-market — not lines of code." },
  { icon: Heart, title: "Craft first", body: "Every pixel, query, and API is shipped with the same care we'd give our own product." },
  { icon: ShieldCheck, title: "Trust, by default", body: "Security, transparency, and clear communication on every engagement." },
  { icon: Sparkles, title: "Curious & bold", body: "We bet on emerging tech — AI, edge, automation — where it creates real leverage." },
];

const TEAM = [
  { name: "Engineering", role: "Full-stack, mobile, cloud", count: "5+" },
  { name: "AI / Data", role: "ML, GenAI, analytics", count: "2+" },
  { name: "Design", role: "Product & brand design", count: "2+" },
  { name: "Strategy", role: "Consulting & delivery", count: "1+" },
];

const ACHIEVEMENTS = [
  { k: "25+", v: "Projects shipped" },
  { k: "15+", v: "Happy clients" },
  { k: "8+", v: "Team members" },
  { k: "3+", v: "Years in business" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title={<>Engineering <span className="text-gradient-primary">digital growth</span> for ambitious teams.</>}
        subtitle="ST Software Solution is a technology company helping businesses transform ideas into powerful digital products — websites, mobile apps, AI tools, dashboards, ERP/CRM systems, and cloud-based business solutions."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          {ACHIEVEMENTS.map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="text-center">
                <div className="text-4xl font-bold text-primary">{s.k}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">{s.v}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Eye, title: "Our Vision", body: "To become South India's most trusted partner for digital transformation — where every business, big or small, can access world-class software." },
            { icon: Target, title: "Our Mission", body: "Build measurable, beautifully engineered software that compounds revenue, productivity, and customer love for the businesses we serve." },
            { icon: Rocket, title: "Our Edge", body: "A senior team that pairs product thinking with deep engineering — shipping in weeks, not quarters." },
          ].map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <b.icon className="size-8 text-primary" />
                <h3 className="mt-4 text-xl font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted">{b.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-10 text-3xl font-bold md:text-4xl">What we stand for.</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <GlassCard>
                <v.icon className="size-6 text-primary" />
                <h3 className="mt-4 font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-10 text-3xl font-bold md:text-4xl">The team.</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <GlassCard>
                <Users className="size-6 text-primary" />
                <div className="mt-3 text-2xl font-bold">{t.count}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-primary">{t.name}</div>
                <p className="mt-2 text-sm text-muted">{t.role}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <GlassCard className="text-center">
          <Award className="mx-auto size-10 text-primary" />
          <h3 className="mt-4 text-2xl font-bold">Certified & trusted partners</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            AWS & Google Cloud certified engineers · ISO-aligned delivery practices · GDPR & data-privacy compliant builds.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110"
          >
            Start a Conversation
          </Link>
        </GlassCard>
      </section>
    </SiteLayout>
  );
}
