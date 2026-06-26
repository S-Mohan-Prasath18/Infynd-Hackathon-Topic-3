import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, MapPin, Calendar, Globe, Mail, User, FileText, 
  BookOpen, Award, CheckCircle, ExternalLink, X, Briefcase, Play
} from "lucide-react";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { getMous, type MouCollege } from "@/lib/mou-storage";

export const Route = createFileRoute("/academic-partnerships")({
  head: () => ({
    meta: [
      { title: "Academic Partnerships — ST Software Solution" },
      { name: "description", content: "Explore our network of partner colleges and official Memorandums of Understanding (MoU)." },
    ],
  }),
  component: AcademicPartnershipsPage,
});

function AcademicPartnershipsPage() {
  const [colleges, setColleges] = useState<MouCollege[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Expired">("All");
  const [selectedCollege, setSelectedCollege] = useState<MouCollege | null>(null);

  useEffect(() => {
    getMous().then(setColleges);
  }, []);

  const filteredColleges = colleges.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Academic Alliances"
        title={<>Bridging academia with <span className="text-gradient-primary">industry precision</span>.</>}
        subtitle="We collaborate with top-tier engineering institutions to train students, build research systems, and source engineering talents through structured MoUs."
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Statistics Bar */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Partner Colleges", value: colleges.length },
            { label: "Total Students Trained", value: "1,200+" },
            { label: "Total Internships Offered", value: "350+" },
            { label: "Total Workshops Conducted", value: "48" },
          ].map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <GlassCard className="text-center relative">
                <div className="absolute top-2 right-2 text-primary/10">
                  <GraduationCap className="size-8" />
                </div>
                <div className="text-4xl font-bold text-primary">{s.value}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">{s.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filter buttons */}
        <div className="mb-10 flex gap-2">
          {(["All", "Active", "Expired"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={
                "border px-5 py-2 font-mono text-[10px] uppercase tracking-widest transition-all " +
                (filter === status
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:border-primary/40 hover:text-primary")
              }
            >
              {status}
            </button>
          ))}
        </div>

        {/* College grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredColleges.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <GlassCard className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {c.logo_url ? (
                        <div className="h-16 w-16 bg-white p-2 rounded-xl border border-primary/20 flex items-center justify-center">
                          <img src={c.logo_url} alt={c.college_name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-xl border border-dashed border-primary/30 flex items-center justify-center font-mono text-xs text-primary bg-primary/5">
                          {c.college_name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                        </div>
                      )}
                      <span
                        className={
                          "rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest border " +
                          (c.status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20")
                        }
                      >
                        {c.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">{c.college_name}</h3>
                    <div className="mt-4 space-y-2 text-xs text-muted">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-primary" />
                        <span>{c.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-primary" />
                        <span>Signed: {new Date(c.signed_date).toLocaleDateString()}</span>
                      </div>
                      {c.status === "Active" && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-3.5 text-primary" />
                          <span>Expires: {new Date(c.expiry_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    {c.website_url ? (
                      <a
                        href={c.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
                      >
                        Visit Website <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}

                    <button
                      onClick={() => setSelectedCollege(c)}
                      className="border border-primary/40 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-surface/10">
            <GraduationCap className="mx-auto size-12 text-muted mb-4" />
            <p className="text-muted">No partnerships match the selected filter.</p>
          </div>
        )}
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-white/10 bg-background/95 p-6 md:p-8 shadow-2xl rounded-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCollege(null)}
                className="absolute top-4 right-4 rounded-full border border-border p-2 text-muted hover:text-primary hover:bg-surface transition-colors"
              >
                <X className="size-4" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {selectedCollege.logo_url && (
                  <div className="h-24 w-24 bg-white p-3 rounded-2xl border border-primary/20 flex items-center justify-center shrink-0">
                    <img src={selectedCollege.logo_url} alt={selectedCollege.college_name} className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                <div>
                  <div className="inline-flex rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary mb-2">
                    Academic Alliance
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{selectedCollege.college_name}</h2>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" />{selectedCollege.location}</span>
                    <span className="flex items-center gap-1.5"><Globe className="size-3.5 text-primary" />{selectedCollege.website_url}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.8fr]">
                {/* Meta details */}
                <div className="space-y-6">
                  <div className="border border-white/5 bg-surface/30 p-5 rounded-xl">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 border-b border-white/5 pb-2">Partnership Data</h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-muted block mb-1">Status</span>
                        <span className={`inline-block rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${selectedCollege.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                          {selectedCollege.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block mb-1">Signed Date</span>
                        <span className="font-mono text-foreground">{new Date(selectedCollege.signed_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted block mb-1">Expiry Date</span>
                        <span className="font-mono text-foreground">{new Date(selectedCollege.expiry_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-surface/30 p-5 rounded-xl">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 border-b border-white/5 pb-2">Point of Contact</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-primary shrink-0" />
                        <span>{selectedCollege.contact_person}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-primary shrink-0" />
                        <a href={`mailto:${selectedCollege.contact_email}`} className="hover:underline text-muted hover:text-primary transition-colors">{selectedCollege.contact_email}</a>
                      </div>
                    </div>
                  </div>

                  {selectedCollege.signed_mou_url && (
                    <div className="border border-primary/20 bg-primary/5 p-5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-6 text-primary" />
                        <div>
                          <span className="text-xs font-bold block">Signed MoU Document</span>
                          <span className="text-[10px] text-muted font-mono">{selectedCollege.signed_mou_url}</span>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Downloading MoU Document...");
                        }}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Partnership Details lists */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b border-border pb-2">Programs & Collaborations</h3>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <DetailSection icon={Briefcase} title="Internship Programs" items={selectedCollege.internship_programs} />
                    <DetailSection icon={BookOpen} title="Training Programs" items={selectedCollege.training_programs} />
                    <DetailSection icon={Award} title="Workshops & Seminars" items={selectedCollege.workshops} />
                    <DetailSection icon={Play} title="Guest Lectures" items={selectedCollege.guest_lectures} />
                    <DetailSection icon={CheckCircle} title="Hackathons" items={selectedCollege.hackathons} />
                    <DetailSection icon={CheckCircle} title="Placement Drives" items={selectedCollege.placement_drives} />
                    <DetailSection icon={CheckCircle} title="Industrial Visits" items={selectedCollege.industrial_visits} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SiteLayout>
  );
}

function DetailSection({ icon: Icon, title, items }: { icon: any; title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="border border-white/5 bg-surface/20 p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-4 text-primary" />
        <h4 className="text-xs font-bold tracking-wide">{title}</h4>
      </div>
      <ul className="space-y-1.5 text-xs text-muted">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-1.5">
            <span className="mt-1 size-1 shrink-0 rounded-full bg-primary" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
