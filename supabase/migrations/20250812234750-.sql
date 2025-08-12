-- Secure profiles table RLS and prevent public reads while allowing registration inserts

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove any overly permissive SELECT policies on profiles (if they exist)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles; -- we'll rely on no SELECT policy to deny reads

-- Recreate a safe INSERT policy to allow registration without auth
DROP POLICY IF EXISTS "Users can insert profiles" ON public.profiles;
CREATE POLICY "Allow anonymous inserts for registration"
ON public.profiles
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
