-- Retry: normalize data first, then add constraint and defaults

-- 1) Drop existing CHECK constraint if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_plan_type_check'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_plan_type_check;
  END IF;
END$$;

-- 2) Normalize existing data
UPDATE public.profiles
SET 
  plan_type = CASE 
    WHEN plan_type = 'free' THEN 'none'
    WHEN plan_type = 'business' THEN 'agency'
    ELSE plan_type
  END,
  monthly_limit = CASE WHEN plan_type = 'free' THEN 0 ELSE monthly_limit END,
  subscription_status = CASE WHEN plan_type = 'free' THEN 'inactive' ELSE subscription_status END;

-- 3) Add new CHECK constraint with allowed values
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_type_check
  CHECK (plan_type IN ('starter','pro','agency','none'));

-- 4) Set default to 'none'
ALTER TABLE public.profiles
  ALTER COLUMN plan_type SET DEFAULT 'none';

-- 5) Replace handle_new_user to initialize with 'none'
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