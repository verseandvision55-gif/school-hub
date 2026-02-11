
CREATE POLICY "Authenticated users can create a school"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);
