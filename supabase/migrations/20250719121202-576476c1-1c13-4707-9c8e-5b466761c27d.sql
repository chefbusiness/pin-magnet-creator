
-- Función para incrementar el contador mensual de pines
CREATE OR REPLACE FUNCTION public.increment_monthly_pin_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger que se ejecuta después de insertar un pin
CREATE TRIGGER on_pin_created
  AFTER INSERT ON public.pins
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_monthly_pin_count();

-- Función para sincronizar los datos existentes (ejecutar una sola vez)
CREATE OR REPLACE FUNCTION public.sync_existing_monthly_pins()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la sincronización de datos existentes
SELECT public.sync_existing_monthly_pins();
