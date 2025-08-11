-- Fix: insert Bedroom Decor subcategory under Home Decor if missing
INSERT INTO public.niche_subcategories (
  id,
  category_id,
  is_premium,
  is_active,
  sort_order,
  created_at,
  updated_at,
  slug,
  description,
  specialized_prompt,
  image_style_prompt,
  meta_title,
  meta_description,
  name
)
SELECT 
  gen_random_uuid(),
  c.id,
  true,
  true,
  20,
  now(),
  now(),
  'bedroom-decor',
  'Ideas para decorar y amueblar dormitorios modernos con estilo y confort.',
  'Objetivo: Generar 3 variaciones de pines para Pinterest sobre decoración de dormitorios (9:16) a partir del análisis de la URL del usuario.\n\nInstrucciones estrictas (devuelve JSON válido):\n[\n  {"title": string (<= 70 caracteres, con palabras clave de dormitorio),\n   "description": string (<= 160 caracteres, con beneficio + llamada a la acción),\n   "style": string (1-2 estilos, p.ej.: "Escandinavo | Minimalista"),\n   "angle": string (enfoque creativo distinto por variación),\n   "cta": string (muy breve, p.ej.: "Descubre ideas" / "Mira el paso a paso")}\n]\n\nTono: Inspirador, práctico y profesional (español). Evita clickbait y mayúsculas excesivas.\nContexto de nicho: decoración de dormitorio, estilo acogedor/moderno, textiles, iluminación cálida, cabeceros, colores neutros con acentos, soluciones para espacios pequeños.\nSEO Pinterest: incluye 1-2 keywords naturales (p.ej., "diseño de dormitorio", "ideas de dormitorio").',
  'Pinterest 9:16 vertical (1080x1920 aprox). Interior de dormitorio realista y acogedor, cama como foco, cabecero, mesitas de noche, textiles (manta, cojines), luz natural suave. Tendencias: escandinavo, minimalista, boho chic, moderno cálido. Paletas: neutros con acentos tierra/verde salvia/terracota.\nTexto integrado con buena legibilidad (zona segura superior/inferior), tipografías limpias y alto contraste, sin marcas de agua ni logos. Composición limpia, profundidad y detalle en materiales (madera, lino, yute). Evitar: artefactos en manos/rostros, texto borroso, perspectiva imposible. Estética premium lista para Pinterest.',
  'Diseño de Dormitorios | Pines 9:16 optimizados',
  'Genera pines 9:16 de alta calidad para diseño de dormitorios: títulos atractivos, descripciones con gancho y estilos visuales en tendencia, listos para Pinterest.',
  'Decoración de Dormitorio'
FROM public.niche_categories c
WHERE c.slug = 'home-decor'
  AND NOT EXISTS (
    SELECT 1 FROM public.niche_subcategories s WHERE s.slug = 'bedroom-decor'
  );