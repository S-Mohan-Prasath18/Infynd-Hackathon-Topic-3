import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Code2, Globe, Smartphone, Cloud, ShieldCheck, Compass, Plug, Wrench, Palette, GraduationCap,
  Cog, ClipboardCheck, Briefcase, Server, CheckCircle2, Users, Rocket, Sparkles, LifeBuoy, Layers,
  Target, Mail, Phone, MapPin, Send, Star, ArrowRight, X,
} from "lucide-react";
import { listProjects, type PublicProject } from "@/lib/projects.functions";
import { listApprovedReviews, type PublicReview } from "@/lib/reviews.functions";
import { type MouCollege } from "@/lib/mou-storage";

import p1 from "@/assets/project-1.jpg";
import { useLenis } from "@/components/premium-sections";
import { SiteNav, SiteFooter, GlassCard } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ST Software Solution — Custom Software, Web, Mobile & Cloud" },
      { name: "description", content: "ST Software Solution delivers custom software, web & mobile apps, cloud solutions and IT consulting that help businesses grow in the digital era." },
      { property: "og:title", content: "ST Software Solution — Transforming Businesses Through Innovative Software" },
      { property: "og:description", content: "Custom software, web, mobile, cloud and IT consulting for ambitious businesses." },
      { property: "og:image", content: "/hero.jpg" },
    ],
  }),
  component: Index,
});

/* ============================================================
   Reusable reveal wrapper
============================================================ */
function Reveal({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, center = false }: { eyebrow: string; title: ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-14 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-lg font-light leading-relaxed text-muted">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ============================================================
   Animated Counter
============================================================ */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 1400;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ============================================================
   HERO
============================================================ */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            ST Software Solution
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Transforming Businesses Through <span className="text-gradient-primary">Innovative Software Solutions</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-muted">
            ST Software Solution delivers custom software, web applications, mobile apps, cloud solutions, and IT consulting services that help businesses grow, innovate, and succeed in the digital era.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#services" className="group inline-flex items-center gap-2 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all hover:brightness-110">
              Explore Services <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 border border-primary/40 bg-surface/60 px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur transition-all hover:bg-primary/10">
              Contact Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   COUNTER STRIP
============================================================ */
function Stats() {
  const [collegesCount, setCollegesCount] = useState(3);
  useEffect(() => {
    import("@/lib/mou-storage").then(({ getMous }) => {
      getMous().then((c) => setCollegesCount(c.length));
    });
  }, []);

  const stats = [
    { n: collegesCount, s: "", label: "Total Partner Colleges" },
    { n: 1200, s: "+", label: "Total Students Trained" },
    { n: 350, s: "+", label: "Total Internships Offered" },
    { n: 48, s: "+", label: "Total Workshops Conducted" },
  ];
  return (
    <section className="border-y border-border bg-surface/30 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary md:text-6xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT + VISION + MISSION
============================================================ */
function About() {
  const offers = [
    "Custom Software Development", "Web Development", "Mobile App Development", "Cloud Solutions",
    "Quality Assurance & Testing", "IT Consulting", "System Integration", "Maintenance & Support", "UI/UX Design",
  ];
  return (
    <section id="about" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="About ST Software Solution"
          title={<>A technology partner built for <span className="text-gradient-primary">customized impact</span>.</>}
          subtitle="ST Software Solution is a comprehensive technology company specializing in customized software solutions tailored to meet the unique needs of businesses across various industries."
        />
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <h3 className="text-lg font-bold">End-to-End Software Services</h3>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {offers.map((o) => (
                  <div key={o} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {o}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Our team consists of expert developers, engineers, project managers, and consultants who work collaboratively to deliver innovative and scalable solutions. We follow agile methodologies to ensure flexibility, quality, security, and timely project delivery while maintaining long-term partnerships with our clients.
              </p>
            </GlassCard>
          </Reveal>
          <div className="grid gap-6">
            <Reveal delay={0.08}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Target className="size-5" /></div>
                  <h3 className="text-lg font-bold">Vision</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  To become a global leader in innovative software solutions that empower businesses to achieve their full potential through technology, efficiency, creativity, and continuous innovation.
                </p>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.15}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Rocket className="size-5" /></div>
                  <h3 className="text-lg font-bold">Mission</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  To deliver high-quality customized software solutions that solve real business challenges while enhancing productivity, streamlining operations, and driving digital transformation through innovation, collaboration, and excellence.
                </p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CORE VALUES
============================================================ */
const VALUES = [
  { t: "Integrity", d: "We prioritize honesty, transparency, and ethical business practices." },
  { t: "Innovation", d: "We embrace emerging technologies and creative problem-solving." },
  { t: "Collaboration", d: "We believe teamwork and partnership drive exceptional results." },
  { t: "Excellence", d: "We strive to exceed client expectations through quality solutions." },
  { t: "Customer Focus", d: "Client success is at the center of everything we do." },
  { t: "Continuous Learning", d: "We continuously adapt and grow with evolving technologies." },
  { t: "Respect & Inclusion", d: "We foster a diverse, respectful, and inclusive work culture." },
];

function CoreValues() {
  return (
    <section className="border-y border-border bg-surface/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Core Values" title={<>The principles that <span className="text-gradient-primary">guide our work</span>.</>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={(i % 4) * 0.08}>
              <GlassCard className="h-full">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">0{i + 1}</div>
                <h4 className="mt-3 text-lg font-bold">{v.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.d}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES (10)
============================================================ */
const SERVICES = [
  { icon: Code2, t: "Custom Software Development", d: "Tailor-made software solutions designed to address unique business requirements and improve operational efficiency." },
  { icon: Globe, t: "Web Development", d: "Responsive, modern, and high-performance websites and web applications built for growth and user engagement." },
  { icon: Smartphone, t: "Mobile App Development", d: "Cross-platform and native mobile applications for Android and iOS with seamless user experiences." },
  { icon: Cloud, t: "Cloud Solutions", d: "Scalable cloud infrastructure, migration services, and cloud application development." },
  { icon: ShieldCheck, t: "Quality Assurance & Testing", d: "Comprehensive testing services ensuring software reliability, security, and performance." },
  { icon: Compass, t: "IT Consulting", d: "Strategic technology consulting to optimize business operations and digital transformation." },
  { icon: Plug, t: "System Integration", d: "Connecting business systems and applications for seamless data flow and improved efficiency." },
  { icon: Wrench, t: "Maintenance & Support", d: "Continuous monitoring, updates, troubleshooting, and long-term software support." },
  { icon: Palette, t: "UI/UX Design", d: "User-centered design solutions focused on usability, accessibility, and engagement." },
  { icon: GraduationCap, t: "Training & Documentation", d: "Comprehensive user training programs and technical documentation for successful software adoption." },
];

function Services() {
  return (
    <section id="services" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Our Services"
          title={<>Everything you need to <span className="text-gradient-primary">build, ship & scale</span>.</>}
          subtitle="Ten focused service lines covering the full lifecycle — from idea to long-term success."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 0.07}>
              <GlassCard className="h-full">
                <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.d}</p>
                <Link to="/contact" className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-all hover:gap-2">
                  Request Quote <ArrowRight className="size-3" />
                </Link>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DEPARTMENTS
============================================================ */
const DEPARTMENTS = [
  { icon: Cog, t: "Software Development Department", items: ["Requirements Analysis", "Software Architecture Design", "Development & Coding", "System Integration", "Documentation", "Collaboration with QA"] },
  { icon: ClipboardCheck, t: "Quality Assurance Department", items: ["Test Planning", "Functional Testing", "Regression Testing", "Performance Testing", "Security Testing", "Quality Validation"] },
  { icon: Briefcase, t: "Project Management Office", items: ["Project Planning", "Resource Management", "Risk Management", "Stakeholder Communication", "Project Monitoring", "Project Delivery"] },
  { icon: Server, t: "IT Support & Infrastructure", items: ["Technical Support", "System Maintenance", "Network Management", "Security Management", "Data Backup & Recovery", "Asset Management"] },
];

function Departments() {
  return (
    <section className="border-y border-border bg-surface/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Our Departments" title={<>Specialized teams, <span className="text-gradient-primary">unified delivery</span>.</>} />
        <div className="grid gap-6 md:grid-cols-2">
          {DEPARTMENTS.map((d, i) => (
            <Reveal key={d.t} delay={(i % 2) * 0.1}>
              <GlassCard className="h-full">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold">{d.t}</h3>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {d.items.map((x) => (
                    <li key={x} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {x}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WHY CHOOSE US
============================================================ */
const REASONS = [
  { icon: Sparkles, t: "Customized Solutions", d: "Software built around your unique business requirements." },
  { icon: Users, t: "Expert Team", d: "Experienced developers, consultants, and engineers." },
  { icon: Rocket, t: "Agile Development", d: "Fast, flexible, and collaborative delivery process." },
  { icon: Sparkles, t: "Innovation Driven", d: "Leveraging AI, automation, and emerging technologies." },
  { icon: LifeBuoy, t: "Reliable Support", d: "Long-term maintenance and technical assistance." },
  { icon: Layers, t: "Scalable Architecture", d: "Solutions designed to grow alongside your business." },
];

function WhyChooseUs() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Why Choose Us" title={<>Six reasons clients <span className="text-gradient-primary">stay with us</span>.</>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r.t} delay={(i % 3) * 0.07}>
              <GlassCard className="h-full">
                <r.icon className="size-7 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.d}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ============================================================
   PORTFOLIO with FILTERS
============================================================ */
const CATEGORIES = ["All", "Software Development", "Web Applications", "Mobile Applications", "Cloud Solutions", "Enterprise Solutions"] as const;
const FALLBACK_PROJECTS: PublicProject[] = [
  { id: "f1", title: "ERP Suite", description: "Custom ERP for retail operations.", category: "Enterprise Solutions", tech: ["React", "Node"], cover_url: null },
  { id: "f2", title: "Healthcare Portal", description: "Patient portal & telehealth.", category: "Web Applications", tech: ["Next.js"], cover_url: null },
  { id: "f3", title: "Delivery App", description: "Cross-platform mobile logistics app.", category: "Mobile Applications", tech: ["Flutter"], cover_url: null },
  { id: "f4", title: "Cloud Migration", description: "Legacy → AWS migration.", category: "Cloud Solutions", tech: ["AWS"], cover_url: null },
  { id: "f5", title: "Inventory Engine", description: "Real-time inventory engine.", category: "Software Development", tech: ["Python"], cover_url: null },
] as PublicProject[];

function Portfolio() {
  const load = useServerFn(listProjects);
  const [data, setData] = useState<PublicProject[] | null>(null);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");

  useEffect(() => {
    load().then((r) => setData(r.length ? r : FALLBACK_PROJECTS)).catch(() => setData(FALLBACK_PROJECTS));
  }, [load]);

  const items = useMemo(() => {
    const list = data ?? [];
    return filter === "All" ? list : list.filter((p) => (p.category ?? "").toLowerCase() === filter.toLowerCase());
  }, [data, filter]);

  return (
    <section id="portfolio" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Portfolio" title={<>Selected <span className="text-gradient-primary">work & case studies</span>.</>} />
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-all ${filter === c ? "border-primary bg-primary text-background" : "border-border text-muted hover:border-primary/40 hover:text-primary"}`}>
              {c}
            </button>
          ))}
        </div>
        {data === null ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-surface/50" />)}
          </div>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 3) * 0.06 }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface/40 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface">
                  <img src={p.cover_url ?? p1} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{p.category ?? "Project"}</div>
                  <h3 className="mt-2 text-lg font-bold transition-colors group-hover:text-primary">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{p.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   ACADEMIC PARTNERS
============================================================ */
function AcademicPartnersSection() {
  const [colleges, setColleges] = useState<MouCollege[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<MouCollege | null>(null);

  useEffect(() => {
    import("@/lib/mou-storage").then(({ getMous }) => {
      getMous().then(setColleges);
    });
  }, []);

  return (
    <section className="py-28 border-y border-border bg-surface/10">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Academic Partners"
          title={<>Fostering Innovation with <span className="text-gradient-primary">Leading Institutions</span>.</>}
          subtitle="Collaborating with top engineering colleges to provide internships, workshops, and career opportunities."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {colleges.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {c.logo_url ? (
                      <div className="h-14 w-14 bg-white p-2 rounded-xl border border-primary/20 flex items-center justify-center">
                        <img src={c.logo_url} alt={c.college_name} className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-xl border border-dashed border-primary/30 flex items-center justify-center font-mono text-xs text-primary bg-primary/5">
                        {c.college_name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                    )}
                    <span
                      className={
                        "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border " +
                        (c.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20")
                      }
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold line-clamp-2">{c.college_name}</h3>
                  <p className="mt-2 text-xs text-muted flex items-center gap-1">
                    <MapPin className="size-3 text-primary shrink-0" />
                    {c.location}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    to="/academic-partnerships"
                    className="text-xs text-primary hover:underline font-mono text-[9px] uppercase tracking-widest"
                  >
                    All Partners
                  </Link>
                  <button
                    onClick={() => setSelectedCollege(c)}
                    className="border border-primary/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-white/10 bg-background/95 p-6 md:p-8 shadow-2xl rounded-2xl"
            >
              <button
                onClick={() => setSelectedCollege(null)}
                className="absolute top-4 right-4 rounded-full border border-border p-2 text-muted hover:text-primary hover:bg-surface transition-colors"
              >
                <X className="size-4" />
              </button>
              
              <div className="flex gap-4 items-center mb-6">
                {selectedCollege.logo_url && (
                  <div className="h-16 w-16 bg-white p-2 rounded-xl border border-primary/20 flex items-center justify-center">
                    <img src={selectedCollege.logo_url} alt={selectedCollege.college_name} className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{selectedCollege.college_name}</h3>
                  <p className="text-xs text-muted">{selectedCollege.location}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 border border-white/5 bg-surface/30 p-4 rounded-lg">
                  <div>
                    <span className="text-muted block">Signed Date</span>
                    <span className="font-mono text-foreground">{selectedCollege.signed_date}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Expiry Date</span>
                    <span className="font-mono text-foreground">{selectedCollege.expiry_date}</span>
                  </div>
                </div>

                {selectedCollege.internship_programs?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-primary mb-1">Internship Programs Offered:</h4>
                    <ul className="list-disc list-inside text-muted pl-1 space-y-1">
                      {selectedCollege.internship_programs.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}

                {(selectedCollege.training_programs?.length > 0 || selectedCollege.workshops?.length > 0) && (
                  <div>
                    <h4 className="font-bold text-primary mb-1">Training & Workshops:</h4>
                    <ul className="list-disc list-inside text-muted pl-1 space-y-1">
                      {selectedCollege.training_programs.concat(selectedCollege.workshops || []).map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-8 text-right">
                <Link
                  to="/internships"
                  onClick={() => setSelectedCollege(null)}
                  className="bg-primary text-background px-4 py-2 font-mono text-[9px] uppercase tracking-widest font-bold hover:brightness-110"
                >
                  Browse Internships
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
============================================================ */
function TestimonialsSection() {
  const load = useServerFn(listApprovedReviews);
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  useEffect(() => {
    load().then(setReviews).catch(() => setReviews([]));
  }, [load]);

  if (reviews !== null && reviews.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Testimonials" title={<>Loved by <span className="text-gradient-primary">founders & operators</span>.</>} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {(reviews ?? []).map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 0.08}>
              <GlassCard className="h-full">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, j) => <Star key={j} className="size-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="grid size-10 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
                    {t.name.split(" ").map((x) => x[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BLOG
============================================================ */
const POSTS = [
  { tag: "Software Development", t: "Why Modular Monoliths Still Win in 2026", d: "How to ship faster without the microservices tax — patterns we use on every greenfield build." },
  { tag: "Cloud Computing", t: "A Practical Guide to Multi-Region on AWS", d: "Failover, latency, and cost trade-offs explained with real production architectures." },
  { tag: "Artificial Intelligence", t: "Building Reliable RAG Pipelines", d: "Chunking, retrieval, and evaluation patterns that move LLM apps from demo to production." },
  { tag: "Digital Transformation", t: "Replacing Spreadsheets With Software", d: "A 90-day playbook for transforming spreadsheet-driven ops into a real internal product." },
  { tag: "Cybersecurity", t: "Zero-Trust for Small Teams", d: "Pragmatic zero-trust patterns that don't require an enterprise budget or full security org." },
  { tag: "Software Development", t: "Designing APIs Your Future Self Will Thank You For", d: "Versioning, naming, and error envelopes — small choices with decade-long consequences." },
];

function Blog() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Insights" title={<>Notes on <span className="text-gradient-primary">technology & growth</span>.</>} subtitle="Industry updates, engineering deep-dives, and lessons from the field." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.t} delay={(i % 3) * 0.07}>
              <GlassCard className="h-full">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{p.tag}</div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.d}</p>
                <Link to="/blog" className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-all hover:gap-2">
                  Read More <ArrowRight className="size-3" />
                </Link>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
============================================================ */
function Contact() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get("name") as string;
    const email = f.get("email") as string;
    const phone = f.get("phone") as string;
    const company = f.get("company") as string;
    const service = f.get("service") as string;
    const message = f.get("message") as string;

    if (!name || !email || !message) {
      toast.error("Please fill in name, email and message.");
      return;
    }

    import("@/lib/mou-storage").then(({ saveLead }) => {
      saveLead({
        name,
        email,
        phone: phone || "",
        company: company || "",
        service: service || "General Inquiry",
        message
      });
    });

    toast.success("Thanks! We'll be in touch within 24 hours.");
    e.currentTarget.reset();
  }
  return (
    <section id="contact" className="border-y border-border bg-surface/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Get in Touch"
          title={<>Let's <span className="text-gradient-primary">Build Something Amazing</span> Together.</>}
          subtitle="Tell us about your project. We'll respond within one business day."
        />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <GlassCard>
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <input name="name" required placeholder="Name *" className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary" />
                <input name="email" type="email" required placeholder="Email *" className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary" />
                <input name="phone" placeholder="Phone" className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary" />
                <input name="company" placeholder="Company" className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary" />
                <select name="service" defaultValue="" className="sm:col-span-2 border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary">
                  <option value="" disabled>Service Required</option>
                  {SERVICES.map((s) => <option key={s.t} value={s.t}>{s.t}</option>)}
                </select>
                <textarea name="message" required placeholder="Tell us about your project *" rows={5} className="sm:col-span-2 border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary" />
                <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all hover:brightness-110">
                  Send Message <Send className="size-4" />
                </button>
              </form>
            </GlassCard>
          </Reveal>
          <div className="grid gap-5">
            <Reveal delay={0.05}>
              <GlassCard>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">Visit Us</div>
                    <div className="mt-1 text-sm text-muted">Tamil Nadu, India</div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.1}>
              <GlassCard>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 size-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">Email</div>
                    <a href="mailto:stsoftware23@gmail.com" className="mt-1 block text-sm text-muted hover:text-primary">stsoftware23@gmail.com</a>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.15}>
              <GlassCard>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 size-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">Quick Contact</div>
                    <div className="mt-1 text-sm text-muted">Available on request</div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  title="ST Software Solution location"
                  src="https://www.google.com/maps?q=Tamil+Nadu,+India&output=embed"
                  className="h-56 w-full"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA
============================================================ */
function FinalCta() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <GlassCard className="overflow-hidden text-center">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
              <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/30 blur-[140px]" />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Ready to build?</div>
            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-6xl">
              Let's turn your <span className="text-gradient-primary">idea</span> into a product that grows.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">Free 30-minute consultation. No commitment.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#contact" className="bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110">
                Book a Free Consultation
              </a>
              <a href="#portfolio" className="border border-primary/40 px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10">
                View Our Projects
              </a>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
============================================================ */
function Index() {
  useLenis();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Stats />
      <About />
      <CoreValues />
      <Services />
      <Departments />
      <WhyChooseUs />
      <Portfolio />
      <AcademicPartnersSection />
      <TestimonialsSection />
      <Blog />
      <Contact />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
