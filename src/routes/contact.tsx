import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ST Software Solution" },
      { name: "description", content: "Book a free consultation with ST Software Solution. Based in Tiruppur, serving clients worldwide." },
      { property: "og:title", content: "Contact ST Software Solution" },
      { property: "og:description", content: "Let's talk about your project." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional(),
  service: z.string().min(1, "Pick a service"),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

const SERVICES = [
  "Web Development", "Mobile App", "AI / ML", "Generative AI",
  "Data & Power BI", "Cloud", "UI/UX Design", "ERP / CRM", "Consulting", "Other",
];

const ADDRESS = "1st Floor, 470, Avinashi - Tiruppur Rd, Periyar Colony, Velampalayam, Tiruppur, Tamil Nadu 641652";
const PHONE = "919999999999";

function ContactPage() {
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success("Thank you! Our team will contact you soon.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Let's Talk"
        title={<>Book a <span className="text-gradient-primary">free consultation</span>.</>}
        subtitle="Tell us about your idea, challenge, or project. We typically reply within one business day."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-bold">Reach us directly</h3>
              <div className="mt-4 space-y-3 text-sm">
                <a href="mailto:stsoftware23@gmail.com" className="flex items-start gap-3 hover:text-primary">
                  <Mail className="mt-0.5 size-4 text-primary" />
                  <span>stsoftware23@gmail.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 text-primary" />
                  <span className="text-muted">{ADDRESS}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 text-primary" />
                  <span className="text-muted">Available on request</span>
                </div>
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${PHONE}?text=Hi%20ST%20Software%20Solution,%20I'd%20like%20to%20discuss%20a%20project.`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-primary/40 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
                >
                  <MessageCircle className="size-3.5" /> WhatsApp
                </a>
                <button
                  onClick={() => toast.info("Meeting scheduler — coming soon. Use the form below for now!")}
                  className="inline-flex items-center justify-center gap-2 border border-primary/40 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
                >
                  <Calendar className="size-3.5" /> Schedule
                </button>
              </div>
            </GlassCard>

            <GlassCard className="!p-0 overflow-hidden">
              <div className="aspect-[4/3] bg-surface">
                <iframe
                  title="Office location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </GlassCard>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlassCard>
              <h3 className="text-2xl font-bold">Project enquiry</h3>
              <p className="mt-1 text-sm text-muted">A quick brief is all we need to get the conversation started.</p>
              <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Name"><input name="name" required maxLength={100} className={inputCls} /></Field>
                <Field label="Email"><input name="email" required type="email" maxLength={255} className={inputCls} /></Field>
                <Field label="Company"><input name="company" maxLength={120} className={inputCls} /></Field>
                <Field label="Service">
                  <select name="service" required className={inputCls} defaultValue="">
                    <option value="" disabled>Select…</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Your message" className="md:col-span-2">
                  <textarea name="message" rows={5} required maxLength={2000} className={inputCls} placeholder="Tell us what you'd like to build…" />
                </Field>
                <button disabled={busy} className="md:col-span-2 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110 disabled:opacity-50">
                  {busy ? "Sending…" : "Send Message"}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}

const inputCls = "mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={"block " + className}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      {children}
    </label>
  );
}
