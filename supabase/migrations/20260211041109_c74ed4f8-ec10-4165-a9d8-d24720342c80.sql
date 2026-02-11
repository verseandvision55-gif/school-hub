
ALTER TABLE public.schools ADD COLUMN school_code TEXT UNIQUE;

CREATE INDEX idx_schools_school_code ON public.schools(school_code);

-- Allow anonymous users to look up schools by code for login
CREATE POLICY "Anyone can lookup school by code"
ON public.schools
FOR SELECT
TO anon
USING (true);
