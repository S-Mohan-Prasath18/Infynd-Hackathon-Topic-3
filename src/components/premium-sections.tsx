import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll, animate } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* ============ SMOOTH SCROLL (Lenis) ============ */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let rafId = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

/* ============ FLOATING PARTICLES ============ */
export function Particles({ count = 28, className = "" }: { count?: number; className?: string }) {
  const [dots] = useState(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 3 + 1,
      d: Math.random() * 8 + 8,
      delay: Math.random() * 5,
    })),
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-primary/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ============ MAGNETIC BUTTON ============ */
export function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === "primary"
      ? "bg-primary text-background hover:brightness-110 shadow-[0_0_40px_-10px_var(--primary)]"
      : "border border-primary/40 text-primary hover:bg-primary/10 backdrop-blur";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`relative inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${base} ${className}`}
    >
      {children}
    </motion.a>
  );
}

/* ============ REVEAL WRAPPER ============ */
function Reveal({ children, delay = 0, y = 30 }: { children: ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============ SPLIT TEXT REVEAL ============ */
function SplitText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");
  return (
    <h3 ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h3>
  );
}

/* ============ COUNTER ============ */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (val) => setV(Math.floor(val)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

/* =========================================================
   1. WHO WE ARE
========================================================= */
export function WhoWeAre() {
  return (
    <section id="who-we-are" className="relative overflow-hidden border-y border-white/5 py-32">
      <Particles count={30} />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-secondary/15 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary">Who We Are</div>
        </Reveal>
        <SplitText
          text="Beyond Services, We Build Digital Experiences."
          className="mb-10 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
        />
        <Reveal delay={0.4}>
          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-muted">
            At ST Software Solution, we believe every brand has a unique story worth sharing. Our goal is to transform ideas into engaging digital experiences that connect businesses with their audience. Through creativity, technology, and strategic thinking, we help brands establish a strong presence in the digital world.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   2. OUR IMPACT
========================================================= */
export function OurImpact() {
  const stats = [
    { n: 50, s: "+", label: "Projects Delivered" },
    { n: 30, s: "+", label: "Happy Clients" },
    { n: 5, s: "+", label: "Industry Solutions" },
    { n: 100, s: "%", label: "Client Focus" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-32">
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.1),transparent_60%)]" />
      </motion.div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">Our Impact</div>
          </Reveal>
          <SplitText text="Creating Value Through Innovation." className="text-4xl font-bold md:text-5xl" />
          <Reveal delay={0.3}>
            <p className="mt-6 text-lg font-light text-muted">
              Every project we undertake is driven by one objective: delivering meaningful results. We focus on building solutions that improve visibility, strengthen brand identity, and create lasting impressions for businesses across industries.
            </p>
          </Reveal>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/40 p-8 backdrop-blur-xl"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-secondary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-primary/10 group-hover:to-secondary/10" />
              <div className="text-5xl font-bold text-gradient-primary md:text-6xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   3. OUR APPROACH (timeline with GSAP draw)
========================================================= */
export function OurApproach() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { t: "Research", d: "We study your audience, market, and competitors to surface the insights that shape every decision." },
    { t: "Strategy", d: "We translate insight into a focused roadmap with clear goals, success metrics, and milestones." },
    { t: "Design", d: "We craft beautiful, intentional interfaces that communicate clearly and feel effortless to use." },
    { t: "Development", d: "Our engineers build on modern, scalable stacks — fast, secure, and ready for what's next." },
    { t: "Launch", d: "We ship with performance, SEO, and analytics wired in. Launch day is a beginning, not an ending." },
    { t: "Growth", d: "We stay on as a partner — iterating, optimizing, and compounding results over time." },
  ];

  return (
    <section id="approach" ref={wrapRef} className="relative border-y border-white/5 bg-surface/20 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-3xl">
          <Reveal>
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">Our Approach</div>
          </Reveal>
          <SplitText text="The Way We Work." className="text-4xl font-bold md:text-5xl" />
          <Reveal delay={0.3}>
            <p className="mt-6 text-lg font-light text-muted">
              We begin by understanding your vision, analyzing your goals, and identifying opportunities for growth. From planning and design to implementation and support, every step is executed with attention to detail and a commitment to quality.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-white/10 md:left-1/2 md:block" />
          <div
            ref={lineRef}
            className="absolute left-4 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-primary via-primary/60 to-secondary md:left-1/2 md:block"
          />
          <ul className="grid gap-10 md:gap-16">
            {steps.map((s, i) => (
              <motion.li
                key={s.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={i % 2 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}>
                  <div className="group relative inline-block w-full max-w-md rounded-2xl border border-white/10 bg-background/70 p-8 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-[0_0_50px_-10px_var(--primary)]">
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-primary">
                      Step 0{i + 1}
                    </div>
                    <h4 className="mb-3 text-2xl font-bold">{s.t}</h4>
                    <p className="text-sm leading-relaxed text-muted">{s.d}</p>
                  </div>
                </div>
                <div className="absolute left-4 top-6 grid size-3 -translate-x-1/2 place-items-center rounded-full bg-primary shadow-[0_0_20px_var(--primary)] md:left-1/2" />
                <div />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   4. WHY DIGITAL MATTERS
========================================================= */
export function WhyDigitalMatters() {
  const icons = ["⚡", "✦", "◆", "✺", "❖"];
  return (
    <section className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {icons.map((ic, i) => (
          <motion.span
            key={i}
            className="absolute text-primary/20"
            style={{
              left: `${10 + i * 18}%`,
              top: `${20 + (i % 2) * 50}%`,
              fontSize: 40 + i * 8,
            }}
            animate={{ y: [0, -20, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {ic}
          </motion.span>
        ))}
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <div>
          <Reveal>
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">Why Digital Matters</div>
          </Reveal>
          <SplitText
            text="Your Digital Presence Is Your First Impression."
            className="mb-8 text-4xl font-bold leading-tight md:text-5xl"
          />
          <Reveal delay={0.4}>
            <p className="text-lg font-light leading-relaxed text-muted">
              Modern customers interact with brands online before making decisions. A professional website, engaging content, and strong visual identity are no longer optional — they are essential. We help businesses make a memorable first impression that builds trust and credibility.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="group relative overflow-hidden rounded-3xl border border-white/10">
            <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/30 opacity-40 blur-2xl transition-opacity duration-700 group-hover:opacity-80" />
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
              alt="Digital craftsmanship"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   5. INNOVATION & TECHNOLOGY
========================================================= */
export function InnovationTechnology() {
  const cards = [
    { t: "AI & Automation", d: "Smart systems that learn, adapt, and free your team to focus on what matters." },
    { t: "Modern Stacks", d: "Edge-first architectures, type-safe code, and tooling built for the next decade." },
    { t: "Design Innovation", d: "Trend-aware aesthetics paired with timeless principles of clarity and craft." },
    { t: "Future-Ready Builds", d: "Scalable foundations that grow with your business — no rebuild required." },
  ];
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-32">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "linear-gradient(120deg, rgba(212,175,55,0.10), rgba(37,99,235,0.10), rgba(212,175,55,0.10))",
          backgroundSize: "300% 300%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <Particles count={20} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">Innovation & Technology</div>
          </Reveal>
          <SplitText
            text="Driven By Creativity, Powered By Technology."
            className="text-4xl font-bold md:text-5xl"
          />
          <Reveal delay={0.3}>
            <p className="mt-6 text-lg font-light text-muted">
              We continuously explore emerging technologies, modern design trends, and innovative strategies to create experiences that are future-ready. By combining creativity with technology, we deliver solutions that evolve with your business.
            </p>
          </Reveal>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/60 p-8 backdrop-blur-xl transition-all hover:border-primary/50"
            >
              <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:from-primary/30 group-hover:to-secondary/30 group-hover:opacity-100" />
              <div className="mb-6 font-mono text-3xl font-bold text-primary/40 transition-colors group-hover:text-primary">
                0{i + 1}
              </div>
              <h4 className="mb-3 text-xl font-bold">{c.t}</h4>
              <p className="text-sm leading-relaxed text-muted">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   6. OUR PROMISE
========================================================= */
export function OurPromise() {
  const promises = [
    { t: "Quality First", d: "Every detail reviewed. Every pixel intentional. Every line of code reasoned." },
    { t: "Transparent Communication", d: "Clear timelines, honest updates, and answers — even when they're hard." },
    { t: "Long-Term Partnership", d: "We invest in relationships, not transactions. Your success is our scorecard." },
  ];
  return (
    <section className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[180px]" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <Reveal>
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">Our Promise</div>
          </Reveal>
          <SplitText
            text="Committed To Excellence."
            className="mx-auto max-w-3xl text-4xl font-bold md:text-6xl"
          />
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-muted">
              We are dedicated to delivering high-quality work, maintaining transparent communication, and building long-term relationships with our clients. Every project is an opportunity to create something exceptional.
            </p>
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {promises.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-surface/60 to-background/40 p-10 backdrop-blur-2xl"
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              <div className="mb-6 grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10 font-mono text-lg font-bold text-primary">
                0{i + 1}
              </div>
              <h4 className="mb-3 text-2xl font-bold">{p.t}</h4>
              <p className="text-sm leading-relaxed text-muted">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   7. FUTURE READY (light beams)
========================================================= */
export function FutureReady() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-black py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute -top-1/2 h-[200%] w-[2px] bg-gradient-to-b from-transparent via-primary/60 to-transparent"
            style={{ left: `${15 + i * 22}%` }}
            animate={{ y: ["-30%", "30%"], opacity: [0, 0.9, 0] }}
            transition={{ duration: 6 + i * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7))]" />
      </div>
      <Particles count={40} />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">Future Ready</div>
        </Reveal>
        <SplitText
          text="Preparing Businesses For Tomorrow."
          className="mb-8 text-4xl font-bold leading-[1.1] md:text-6xl"
        />
        <Reveal delay={0.4}>
          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-muted">
            The digital landscape changes rapidly. We help businesses stay ahead by embracing innovation, adapting to new technologies, and creating scalable digital solutions that support long-term growth.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   CINEMATIC FINAL CTA
========================================================= */
export function FinalCTA() {
  return (
    <section id="final-cta" className="relative overflow-hidden py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse_at_center, rgba(212,175,55,0.18), transparent 60%), radial-gradient(ellipse_at_30%_70%, rgba(37,99,235,0.18), transparent 60%)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[200px]" />
      </div>
      <Particles count={50} />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Now accepting new partners
          </div>
        </Reveal>
        <SplitText
          text="Let's Build The Future Together."
          className="mb-10 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        />
        <Reveal delay={0.4}>
          <p className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-muted">
            Whether you're starting from scratch or looking to elevate your brand, ST Software Solution is ready to help you achieve your digital goals. Let's create experiences that inspire, engage, and deliver results.
          </p>
        </Reveal>
        <Reveal delay={0.6}>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <MagneticButton href="#partner" variant="primary">
              Start Your Project →
            </MagneticButton>
            <MagneticButton href="mailto:hello@stsoftwaresolution.com" variant="ghost">
              Schedule A Consultation
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
