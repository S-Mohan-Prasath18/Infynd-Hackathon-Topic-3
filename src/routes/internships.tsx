import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building, MapPin, Send, Upload, Sparkles, CheckCircle } from "lucide-react";
import { SiteLayout, PageHero, GlassCard } from "@/components/site-layout";
import { getMous, saveApplication, type MouCollege } from "@/lib/mou-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Internships & Opportunities — ST Software Solution" },
      { name: "description", content: "Apply for internships, workshops and training programs offered through our academic partnerships." },
    ],
  }),
  component: InternshipsPage,
});

interface InternshipItem {
  id: string;
  collegeName: string;
  programName: string;
  location: string;
}

function InternshipsPage() {
  const [colleges, setColleges] = useState<MouCollege[]>([]);
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [busy, setBusy] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    getMous().then((data) => {
      setColleges(data.filter((c) => c.status === "Active"));
      
      // Extract internships
      const items: InternshipItem[] = [];
      data.forEach((c) => {
        if (c.status === "Active" && c.internship_programs) {
          c.internship_programs.forEach((prog, idx) => {
            items.push({
              id: `${c.id}-intern-${idx}`,
              collegeName: c.college_name,
              programName: prog,
              location: c.location,
            });
          });
        }
      });
      setInternships(items);
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !collegeId || !interest) {
      toast.error("Please fill in Name, Email, College and Area of Interest.");
      return;
    }
    setBusy(true);
    try {
      const selectedCollege = colleges.find((c) => c.id === collegeId)?.college_name || "Other";
      await saveApplication({
        name,
        email,
        role: `Internship - ${interest} (${selectedCollege})`,
        message: `Phone: ${phone}. Msg: ${message}`,
        resume_name: resumeName || "online-application.pdf"
      });
      toast.success("Internship Application Submitted Successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setCollegeId("");
      setInterest("");
      setMessage("");
      setResumeName("");
    } catch {
      toast.error("Failed to submit application.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Student Programs"
        title={<>Fueling growth through <span className="text-gradient-primary">structured learning</span>.</>}
        subtitle="Explore active internship opportunities, industry training, and workshops offered directly in collaboration with our academic partners."
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          
          {/* Opportunities list */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="text-primary size-6" /> Available Programs
            </h2>
            
            <div className="space-y-4">
              {internships.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border rounded-xl bg-surface/20">
                  <Briefcase className="mx-auto size-10 text-muted mb-3 animate-pulse" />
                  <p className="text-sm text-muted">No active collaborative programs found. Check back soon!</p>
                </div>
              ) : (
                internships.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="!p-5 border border-white/5 bg-surface/30">
                      <div className="flex flex-wrap justify-between items-start gap-3">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-widest text-primary mb-1.5 flex items-center gap-1">
                            <Sparkles className="size-3" /> Collaboration Opportunity
                          </div>
                          <h3 className="text-lg font-bold text-foreground">{item.programName}</h3>
                          <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-muted">
                            <span className="flex items-center gap-1.5"><Building className="size-3.5 text-primary" />{item.collegeName}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" />{item.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const c = colleges.find((col) => col.college_name === item.collegeName);
                            if (c) setCollegeId(c.id);
                            setInterest(item.programName);
                            document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-primary/10 border border-primary/20 hover:bg-primary hover:text-background text-primary px-4 py-2 font-mono text-[9px] uppercase tracking-widest transition-all"
                        >
                          Apply Now
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </div>

            {/* General Partnerships Info */}
            <div className="mt-10 border border-white/5 bg-surface/10 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-primary">
                <CheckCircle className="size-5" /> Benefits of Academic Partnerships
              </h3>
              <ul className="space-y-3 text-sm text-muted">
                <li>• **Industry Mentors**: Gain guidance directly from senior engineers at ST Software Solution.</li>
                <li>• **Live Projects**: Work on real production environments and user-facing clients.</li>
                <li>• **Job Placement**: High-performing interns are frequently offered permanent engineering roles.</li>
                <li>• **Professional Certificates**: Gain verified training, workshop, and internship completion certificates.</li>
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div id="apply-form">
            <GlassCard className="sticky top-24">
              <h2 className="text-2xl font-bold mb-2">Apply for Opportunities</h2>
              <p className="text-xs text-muted mb-6">Are you a student at one of our partner institutions? Submit your application directly here.</p>
              
              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Full Name *</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="Enter your name"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Email *</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="your.email@example.com"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Phone Number</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="+91..."
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Partner Institution *</span>
                  <select
                    required
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
                  >
                    <option value="" disabled>Select your college</option>
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>{c.college_name}</option>
                    ))}
                    <option value="other">Other / Not listed</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Area of Interest / Specific Program *</span>
                  <input
                    type="text"
                    required
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="e.g. Web Development, PSG Embedded Systems"
                  />
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Upload Resume (Signed/PDF)</span>
                  <div className="mt-2 flex items-center gap-3 border border-dashed border-border bg-background/50 px-4 py-4 text-xs text-muted">
                    <Upload className="size-4 text-primary" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeName(e.target.files?.[0]?.name || "")}
                      className="flex-1 file:mr-3 file:border file:border-primary/40 file:bg-transparent file:px-3 file:py-1 file:font-mono file:text-[9px] file:uppercase file:tracking-widest file:text-primary"
                    />
                  </div>
                  {resumeName && <p className="mt-1 text-[10px] font-mono text-primary">Attached: {resumeName}</p>}
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Cover Note / Why do you want to join? (optional)</span>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="Tell us about yourself and your career goals..."
                  />
                </label>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busy ? "Submitting..." : <>Submit Application <Send className="size-4" /></>}
                </button>
              </form>
            </GlassCard>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
