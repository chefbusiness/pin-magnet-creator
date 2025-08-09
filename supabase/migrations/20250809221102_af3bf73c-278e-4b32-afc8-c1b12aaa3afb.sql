-- Enforce paywall: remove free defaults and set NONE for non-subscribed users

-- 1) Update default for profiles.plan_type to 'none'
ALTER TABLE public.profiles
  ALTER COLUMN plan_type SET DEFAULT 'none';

-- 2) Migrate existing rows from 'free' to 'none' with zero limit and inactive status
UPDATE public.profiles
SET 
  plan_type = 'none',
  monthly_limit = 0,
  subscription_status = 'inactive'
WHERE plan_type = 'free';

-- 3) Replace handle_new_user to initialize users with 'none' plan and 0 limit
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