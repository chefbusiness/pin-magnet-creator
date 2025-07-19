
-- Actualizar todas las subcategorías para que requieran pago
UPDATE public.niche_subcategories 
SET is_premium = true 
WHERE is_premium = false;

-- Verificar que todas las subcategorías son premium
UPDATE public.niche_subcategories 
SET is_premium = true;
