-- Fix overly permissive RLS on profiles table by removing public SELECT access
-- Drop the existing SELECT policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Note: With no SELECT policies, RLS will deny all SELECTs on public.profiles for anon users.
-- This prevents public exposure of names and emails while keeping INSERTs working as before.
