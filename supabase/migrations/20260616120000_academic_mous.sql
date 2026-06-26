CREATE TABLE public.academic_mous (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name text NOT NULL,
  logo_url text,
  location text,
  website_url text,
  contact_person text,
  contact_email text,
  signed_date text,
  expiry_date text,
  status text NOT NULL DEFAULT 'Active',
  signed_mou_url text,
  images text[] NOT NULL DEFAULT '{}',
  internship_programs text[] NOT NULL DEFAULT '{}',
  training_programs text[] NOT NULL DEFAULT '{}',
  workshops text[] NOT NULL DEFAULT '{}',
  guest_lectures text[] NOT NULL DEFAULT '{}',
  hackathons text[] NOT NULL DEFAULT '{}',
  placement_drives text[] NOT NULL DEFAULT '{}',
  industrial_visits text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.academic_mous TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_mous TO authenticated;
GRANT ALL ON public.academic_mous TO service_role;

ALTER TABLE public.academic_mous ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read academic_mous"
  ON public.academic_mous FOR SELECT
  USING (true);

CREATE POLICY "Admins can read all academic_mous"
  ON public.academic_mous FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert academic_mous"
  ON public.academic_mous FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update academic_mous"
  ON public.academic_mous FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete academic_mous"
  ON public.academic_mous FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_academic_mous_updated_at
  BEFORE UPDATE ON public.academic_mous
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
