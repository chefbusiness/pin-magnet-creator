-- Update default limits for new premium pricing model
-- Remove free plan, update limits for premium plans

-- Update existing free users to starter plan
UPDATE public.profiles 
SET 
  plan_type = 'starter',
  monthly_limit = 25
WHERE plan_type = 'free';

-- Update plan limits
-- Starter: $19/month - 25 pins
-- Pro: $49/month - 150 pins  
-- Business: $149/month - 500 pins

-- Update handle_new_user function to create starter users by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, plan_type, monthly_limit)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'starter',
    25
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;