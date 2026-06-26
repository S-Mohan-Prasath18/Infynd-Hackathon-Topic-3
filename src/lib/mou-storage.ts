import { supabase } from "@/integrations/supabase/client";

export interface MouCollege {
  id: string;
  college_name: string;
  logo_url: string | null;
  location: string;
  website_url: string;
  contact_person: string;
  contact_email: string;
  signed_date: string;
  expiry_date: string;
  status: "Active" | "Expired";
  signed_mou_url: string | null;
  images: string[];
  internship_programs: string[];
  training_programs: string[];
  workshops: string[];
  guest_lectures: string[];
  hackathons: string[];
  placement_drives: string[];
  industrial_visits: string[];
  is_active: boolean;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  created_at: string;
}

export interface CareerApplication {
  id: string;
  name: string;
  email: string;
  role: string;
  message?: string;
  resume_name?: string;
  created_at: string;
}

// Pre-seeded colleges for fallback local storage
const SEEDED_COLLEGES: MouCollege[] = [
  {
    id: "seeded-iitm",
    college_name: "Indian Institute of Technology, Madras (IITM)",
    logo_url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb1d64e9-c341-4d6e-a294-27794e5ec305/iitm-logo.png",
    location: "Chennai, Tamil Nadu",
    website_url: "https://www.iitm.ac.in",
    contact_person: "Dr. R. Ramanujam (Director of Partnerships)",
    contact_email: "partnerships@iitm.ac.in",
    signed_date: "2025-01-10",
    expiry_date: "2028-01-10",
    status: "Active",
    signed_mou_url: "mock-mou-iitm.pdf",
    images: [],
    internship_programs: ["Summer Research Fellowship", "6-Month Core Cloud Architecture Internship"],
    training_programs: ["Advanced Distributed Systems", "AI & NLP Pipeline Engineering"],
    workshops: ["Building Zero-Trust Systems", "High Performance API Designs"],
    guest_lectures: ["Fintech Microservice Orchestration"],
    hackathons: ["ST Annual Enterprise Innovation Hackathon"],
    placement_drives: ["Annual Campus Recruitment Drive"],
    industrial_visits: ["Cloud Research Center Tour"],
    is_active: true
  },
  {
    id: "seeded-psg",
    college_name: "PSG College of Technology",
    logo_url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb1d64e9-c341-4d6e-a294-27794e5ec305/psg-logo.png",
    location: "Coimbatore, Tamil Nadu",
    website_url: "https://www.psgtech.edu",
    contact_person: "Prof. S. Baskaran (Head of R&D Cell)",
    contact_email: "mou@psgtech.edu",
    signed_date: "2025-03-15",
    expiry_date: "2028-03-15",
    status: "Active",
    signed_mou_url: "mock-mou-psg.pdf",
    images: [],
    internship_programs: ["Industrial Web Application Internship", "Embedded Systems Dev Role"],
    training_programs: ["Full Stack React & Node Development", "DevOps & Cloud Deployments"],
    workshops: ["Modern Tailwind v4 Styling & UX Flow", "Database Indexing & Performance"],
    guest_lectures: ["Real-world SaaS Scaling Strategies"],
    hackathons: ["PSG Tech-ST Innovation Challenge"],
    placement_drives: ["PSG Campus Placement Initiative"],
    industrial_visits: ["Coimbatore Tech Hub Visit"],
    is_active: true
  },
  {
    id: "seeded-anna",
    college_name: "Anna University",
    logo_url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb1d64e9-c341-4d6e-a294-27794e5ec305/anna-logo.png",
    location: "Guindy, Chennai",
    website_url: "https://www.annauniv.edu",
    contact_person: "Dr. M. Anuradha (MOU Coordinator)",
    contact_email: "director.mou@annauniv.edu",
    signed_date: "2023-06-01",
    expiry_date: "2026-06-01",
    status: "Expired",
    signed_mou_url: "mock-mou-anna.pdf",
    images: [],
    internship_programs: ["Graduate Trainee Developer"],
    training_programs: ["Enterprise Software Systems Engineering"],
    workshops: ["Monolith to Microservices Roadmap"],
    guest_lectures: ["Cybersecurity in Fintech Transactions"],
    hackathons: ["Anna Univ App Challenge"],
    placement_drives: ["Engineering Special Recruitment Drive"],
    industrial_visits: ["Security Operations Center (SOC) Tour"],
    is_active: false
  }
];

// Helper to determine if we should fall back to localStorage
async function testSupabaseTable(): Promise<boolean> {
  try {
    const { error } = await (supabase as any).from("academic_mous").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function getMous(): Promise<MouCollege[]> {
  const isDbWorking = await testSupabaseTable();
  if (isDbWorking) {
    try {
      const { data, error } = await (supabase as any)
        .from("academic_mous")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as MouCollege[];
    } catch (e) {
      console.warn("Supabase MoU read error, using localStorage", e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("st_mou_colleges");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return SEEDED_COLLEGES;
      }
    } else {
      localStorage.setItem("st_mou_colleges", JSON.stringify(SEEDED_COLLEGES));
      return SEEDED_COLLEGES;
    }
  }
  return SEEDED_COLLEGES;
}

export async function saveMou(
  mou: Omit<MouCollege, "id" | "created_at" | "is_active"> & { id?: string; is_active?: boolean }
): Promise<MouCollege> {
  const isDbWorking = await testSupabaseTable();
  const id = mou.id || crypto.randomUUID();
  const record: MouCollege = {
    ...mou,
    id,
    is_active: mou.is_active ?? true,
    created_at: new Date().toISOString()
  };

  if (isDbWorking) {
    try {
      const { error } = await (supabase as any).from("academic_mous").upsert(record);
      if (!error) return record;
    } catch (e) {
      console.warn("Supabase MoU save failed, fallback to localStorage", e);
    }
  }

  // Direct localStorage read — avoids double Supabase testSupabaseTable() call
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("st_mou_colleges");
      const current: MouCollege[] = stored ? JSON.parse(stored) : [...SEEDED_COLLEGES];
      const idx = current.findIndex((c) => c.id === id);
      if (idx >= 0) {
        current[idx] = { ...current[idx], ...record };
      } else {
        current.unshift(record);
      }
      localStorage.setItem("st_mou_colleges", JSON.stringify(current));
    } catch {
      // localStorage unavailable — silent fail
    }
  }
  return record;
}

export async function deleteMou(id: string): Promise<void> {
  const isDbWorking = await testSupabaseTable();
  if (isDbWorking) {
    try {
      const { error } = await (supabase as any).from("academic_mous").delete().eq("id", id);
      if (!error) return;
    } catch (e) {
      console.warn("Supabase MoU delete failed, fallback to localStorage", e);
    }
  }

  if (typeof window !== "undefined") {
    const current = await getMous();
    const filtered = current.filter((c) => c.id !== id);
    localStorage.setItem("st_mou_colleges", JSON.stringify(filtered));
  }
}

// --- LEADS MANAGEMENT ---
export async function getLeads(): Promise<Lead[]> {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("st_leads");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export async function saveLead(lead: Omit<Lead, "id" | "created_at">): Promise<void> {
  if (typeof window !== "undefined") {
    const leads = await getLeads();
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    leads.unshift(newLead);
    localStorage.setItem("st_leads", JSON.stringify(leads));
  }
}

export async function deleteLead(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const leads = await getLeads();
    const filtered = leads.filter((l) => l.id !== id);
    localStorage.setItem("st_leads", JSON.stringify(filtered));
  }
}

// --- CAREER APPLICATIONS ---
export async function getApplications(): Promise<CareerApplication[]> {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("st_career_applications");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export async function saveApplication(app: Omit<CareerApplication, "id" | "created_at">): Promise<void> {
  if (typeof window !== "undefined") {
    const apps = await getApplications();
    const newApp: CareerApplication = {
      ...app,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    apps.unshift(newApp);
    localStorage.setItem("st_career_applications", JSON.stringify(apps));
  }
}

export async function deleteApplication(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const apps = await getApplications();
    const filtered = apps.filter((a) => a.id !== id);
    localStorage.setItem("st_career_applications", JSON.stringify(filtered));
  }
}
