-- Add super admin field to profiles table
ALTER TABLE public.profiles ADD COLUMN is_super_admin BOOLEAN NOT NULL DEFAULT false;

-- Create index for performance
CREATE INDEX idx_profiles_is_super_admin ON public.profiles(is_super_admin);

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM public.profiles WHERE profiles.user_id = $1),
    false
  );
$$;

-- Insert super admin user (this will be created when they sign up)
-- We'll update their profile to super admin status after signup
-- For now, we'll create a function to promote a user to super admin

CREATE OR REPLACE FUNCTION public.promote_to_super_admin(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    is_super_admin = true,
    plan_type = 'business',
    monthly_limit = 999999,
    pins_generated_this_month = 0
  WHERE email = target_email;
END;
$$;