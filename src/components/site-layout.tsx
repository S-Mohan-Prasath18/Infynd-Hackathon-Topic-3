import { Link } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Menu, X, Mail, MapPin, Phone } from "lucide-react";
import logoUrl from "@/assets/st-logo.svg?url";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/mou", label: "MOU" },
  { to: "/academic-partnerships", label: "Partnerships" },
  { to: "/internships", label: "Internships" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkUserAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!(data && !error));
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    }

    checkUserAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!(data && !error));
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="ST Software Solution — Home" className="flex items-center shrink-0 group">
          <img
            src={logoUrl}
            alt="ST Software Solution"
            className="h-16 md:h-20 w-auto max-w-[220px] rounded-lg bg-[#08090c] p-1 transition-transform duration-300 hover:scale-[1.04]"
            style={{ filter: "drop-shadow(0 0 18px rgba(212,175,55,0.18))" }}
          />
        </Link>
        <div className="hidden gap-5 font-sans text-sm font-medium text-muted xl:flex shrink-0 items-center">
          {NAV.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
              className="transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary/20"
            >
              Admin
            </Link>
          )}
          <Link
            to="/contact"
            className="hidden sm:inline border border-primary/50 px-5 py-2 font-mono text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary/10"
          >
            Book a Call
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border p-2 text-muted hover:text-primary xl:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 px-6 py-4">
            {NAV.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: true }}
                className="rounded px-2 py-2 font-sans text-sm font-medium text-muted hover:bg-surface hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                key="/admin"
                to="/admin"
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary" }}
                className="rounded px-2 py-2 font-sans text-sm font-medium text-muted hover:bg-surface hover:text-primary"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/30">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-flex shrink-0">
            <img
              src="/st-logo-dark.png"
              alt="ST Software Solution"
              className="h-32 w-auto rounded-lg"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            ST Software Solution builds smarter software, AI products, and digital
            platforms that help ambitious businesses grow.
          </p>
          <div className="mt-6 space-y-2 text-xs text-muted">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-3.5 text-primary" />
              <span>1st Floor, 470, Avinashi - Tiruppur Rd, Periyar Colony, Velampalayam, Tiruppur, Tamil Nadu 641652</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-primary" />
              <a href="mailto:stsoftware23@gmail.com" className="hover:text-primary">stsoftware23@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" />
              <span>+91 — Available on request</span>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary">Explore</div>
          <ul className="space-y-2 text-sm text-muted">
            {NAV.slice(0, 5).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary">Company</div>
          <ul className="space-y-2 text-sm text-muted">
            {NAV.slice(5).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">{l.label}</Link>
              </li>
            ))}
            <li><Link to="/client-portal" className="hover:text-primary">Client Portal</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-[10px] uppercase tracking-widest text-muted md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} ST Software Solution. All rights reserved.</span>
          <span>Crafted in Tiruppur, India</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-5xl px-6 text-center animate-fade-up">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          {eyebrow}
        </div>
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_rgba(212,175,55,0.35)] " +
        className
      }
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), transparent 60%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}
