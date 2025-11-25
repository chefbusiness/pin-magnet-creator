-- Fix Function Search Path Mutable issue
-- Add SET search_path = public to all SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.increment_monthly_pin_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Solo incrementar si el pin tiene un user_id (no es anónimo)
  IF NEW.user_id IS NOT NULL THEN
    -- Incrementar el contador mensual
    UPDATE public.profiles 
    SET pins_generated_this_month = pins_generated_this_month + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id;
    
    -- Si no existe el perfil, crearlo (por si acaso)
    IF NOT FOUND THEN
      INSERT INTO public.profiles (user_id, pins_generated_this_month, monthly_limit, plan_type)
      VALUES (NEW.user_id, 1, 25, 'starter')
      ON CONFLICT (user_id) DO UPDATE SET
        pins_generated_this_month = profiles.pins_generated_this_month + 1,
        updated_at = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_existing_monthly_pins()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Actualizar el contador para todos los usuarios basado en los pines del mes actual
  UPDATE public.profiles 
  SET pins_generated_this_month = (
    SELECT COUNT(*)
    FROM public.pins 
    WHERE pins.user_id = profiles.user_id 
    AND pins.created_at >= date_trunc('month', now())
    AND pins.created_at < date_trunc('month', now()) + interval '1 month'
  ),
  updated_at = now();
  
  -- Reportar cuántos registros se actualizaron
  RAISE NOTICE 'Updated monthly pin counts for existing profiles';
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_monthly_pins()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles 
  SET pins_generated_this_month = 0,
      current_period_start = date_trunc('month', now()),
      current_period_end = date_trunc('month', now()) + interval '1 month'
  WHERE current_period_end < now() OR current_period_end IS NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

CREATE OR REPLACE FUNCTION public.promote_to_super_admin(target_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    is_super_admin = true,
    plan_type = 'business',
    monthly_limit = 999999,
    pins_generated_this_month = 0
  WHERE email = target_email;
END;
$function$;