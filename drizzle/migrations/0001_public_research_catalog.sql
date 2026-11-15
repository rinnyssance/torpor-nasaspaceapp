ALTER TABLE public.studies ADD COLUMN IF NOT EXISTS provenance jsonb NOT NULL DEFAULT '{}';
CREATE TABLE public.research_catalog (id text PRIMARY KEY, kind text NOT NULL, title text NOT NULL, data jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.research_catalog TO anon, authenticated; GRANT ALL ON public.research_catalog TO service_role;
ALTER TABLE public.research_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read curated research" ON public.research_catalog FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX research_catalog_kind ON public.research_catalog(kind);