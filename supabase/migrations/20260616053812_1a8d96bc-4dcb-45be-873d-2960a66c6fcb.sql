CREATE TABLE public.mou_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Memorandum of Understanding',
  content text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.mou_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mou_documents TO authenticated;
GRANT ALL ON public.mou_documents TO service_role;

ALTER TABLE public.mou_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published MOUs"
  ON public.mou_documents FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can read all MOUs"
  ON public.mou_documents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert MOUs"
  ON public.mou_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update MOUs"
  ON public.mou_documents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete MOUs"
  ON public.mou_documents FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_mou_documents_updated_at
  BEFORE UPDATE ON public.mou_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();