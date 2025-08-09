-- Fix plan_type constraint and defaults; enforce paywall

-- 1) Drop old CHECK constraint if exists and recreate with allowed values
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_plan_type_check'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_plan_type_check;
  END IF;
END$$;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_type_check
  CHECK (plan_type IN ('starter','pro','agency','none'));

-- 2) Set default to 'none'
ALTER TABLE public.profiles
  ALTER COLUMN plan_type SET DEFAULT 'none';

-- 3) Normalize existing data
UPDATE public.profiles
SET 
  plan_type = CASE 
    WHEN plan_type = 'free' THEN 'none'
    WHEN plan_type = 'business' THEN 'agency'
    ELSE plan_type
  END,
  monthly_limit = CASE WHEN plan_type = 'free' THEN 0 ELSE monthly_limit END,
  subscription_status = CASE WHEN plan_type = 'free' THEN 'inactive' ELSE subscription_status END;

-- 4) Replace handle_new_user to initialize with 'none'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, plan_type, monthly_limit)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'none',
    0
  );
  RETURN NEW;
END;
$function$;