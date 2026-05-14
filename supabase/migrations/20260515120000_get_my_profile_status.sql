-- Reliable profile status for the logged-in user.
-- SECURITY DEFINER reads bypass RLS timing quirks on the client while still
-- restricting rows to auth.uid() from the caller's JWT.
CREATE OR REPLACE FUNCTION public.get_my_profile_status()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.status
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_profile_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_profile_status() TO authenticated;
