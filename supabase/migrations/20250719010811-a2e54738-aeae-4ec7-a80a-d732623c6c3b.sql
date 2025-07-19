
-- Crear tabla para categorías de nichos
CREATE TABLE public.niche_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  emoji TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para subcategorías de nichos
CREATE TABLE public.niche_subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.niche_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  specialized_prompt TEXT NOT NULL,
  image_style_prompt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Habilitar RLS
ALTER TABLE public.niche_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_subcategories ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública de categorías y subcategorías
CREATE POLICY "Anyone can read niche categories" 
  ON public.niche_categories 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can read niche subcategories" 
  ON public.niche_subcategories 
  FOR SELECT 
  USING (is_active = true);

-- Políticas para administradores (solo súper admins pueden escribir)
CREATE POLICY "Super admins can manage niche categories" 
  ON public.niche_categories 
  FOR ALL 
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage niche subcategories" 
  ON public.niche_subcategories 
  FOR ALL 
  USING (public.is_super_admin(auth.uid()));

-- Crear trigger para updated_at
CREATE TRIGGER update_niche_categories_updated_at
  BEFORE UPDATE ON public.niche_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_niche_subcategories_updated_at
  BEFORE UPDATE ON public.niche_subcategories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar datos iniciales de las 5 categorías MVP
INSERT INTO public.niche_categories (name, slug, description, icon_name, emoji, sort_order) VALUES
('Decoración del Hogar', 'home-decor', 'Ideas y tendencias para decorar espacios del hogar', 'Home', '🏠', 1),
('Recetas y Comida', 'recipes', 'Recetas deliciosas y contenido gastronómico', 'ChefHat', '🍲', 2),
('Moda y Estilo', 'fashion', 'Tendencias de moda y consejos de estilo', 'Shirt', '👗', 3),
('Belleza y Cuidado', 'beauty', 'Tips de belleza y rutinas de cuidado personal', 'Sparkles', '💄', 4),
('Fitness y Bienestar', 'fitness', 'Ejercicios, rutinas y vida saludable', 'Dumbbell', '💪', 5);

-- Insertar algunas subcategorías MVP para cada categoría
INSERT INTO public.niche_subcategories (category_id, name, slug, description, specialized_prompt, image_style_prompt, meta_title, meta_description, is_premium) VALUES
-- Decoración del Hogar
((SELECT id FROM public.niche_categories WHERE slug = 'home-decor'), 'Decoración de Sala de Estar', 'living-room-decor', 'Ideas para decorar y amueblar salas de estar modernas', 'Crea un pin de Pinterest profesional sobre decoración de sala de estar. El contenido debe incluir tips de decoración, colores, muebles y accesorios para salas modernas y acogedoras. Usa un estilo visual elegante y sofisticado.', 'Interior design, living room, modern decor, cozy atmosphere, elegant furniture, warm lighting', 'Ideas de Decoración de Sala de Estar | Pinterest', 'Descubre las mejores ideas para decorar tu sala de estar con estilo moderno y acogedor', true),
((SELECT id FROM public.niche_categories WHERE slug = 'home-decor'), 'Diseño de Dormitorios', 'bedroom-design', 'Inspiración para diseñar dormitorios relajantes', 'Crea un pin de Pinterest sobre diseño de dormitorios. Enfócate en crear espacios relajantes, combinaciones de colores suaves, y elementos que promuevan el descanso. Incluye tips de organización y decoración.', 'Bedroom interior, relaxing atmosphere, soft colors, cozy bedding, minimalist design', 'Diseño de Dormitorios Modernos | Pinterest', 'Ideas creativas para diseñar dormitorios relajantes y funcionales', false),

-- Recetas y Comida
((SELECT id FROM public.niche_categories WHERE slug = 'recipes'), 'Recetas Saludables', 'healthy-recipes', 'Recetas nutritivas y balanceadas para una vida sana', 'Crea un pin de Pinterest sobre recetas saludables. Enfócate en ingredientes frescos, preparaciones nutritivas, y presentaciones apetitosas. Incluye información nutricional y beneficios para la salud.', 'Healthy food, fresh ingredients, colorful vegetables, nutritious meals, clean eating', 'Recetas Saludables y Nutritivas | Pinterest', 'Las mejores recetas saludables para una alimentación balanceada', true),
((SELECT id FROM public.niche_categories WHERE slug = 'recipes'), 'Comida Rápida y Fácil', 'quick-easy-food', 'Recetas rápidas para el día a día', 'Crea un pin de Pinterest sobre recetas rápidas y fáciles. Enfócate en preparaciones de 30 minutos o menos, ingredientes simples, y pasos claros. Perfecto para personas ocupadas.', 'Quick meals, easy cooking, simple ingredients, time-saving recipes, busy lifestyle', 'Recetas Rápidas y Fáciles | Pinterest', 'Comidas deliciosas listas en 30 minutos o menos', false),

-- Moda y Estilo
((SELECT id FROM public.niche_categories WHERE slug = 'fashion'), 'Outfits Casuales', 'casual-outfits', 'Looks cómodos y con estilo para el día a día', 'Crea un pin de Pinterest sobre outfits casuales. Enfócate en combinaciones cómodas pero estilosas, perfectas para el día a día. Incluye diferentes estilos y ocasiones casuales.', 'Casual fashion, everyday outfits, comfortable style, trendy looks, street style', 'Outfits Casuales con Estilo | Pinterest', 'Ideas de looks casuales cómodos y a la moda', true),
((SELECT id FROM public.niche_categories WHERE slug = 'fashion'), 'Moda Sostenible', 'sustainable-fashion', 'Moda consciente y ecológica', 'Crea un pin de Pinterest sobre moda sostenible. Enfócate en marcas eco-friendly, ropa de segunda mano, y tips para un guardarropa más consciente con el medio ambiente.', 'Sustainable fashion, eco-friendly clothing, ethical brands, conscious fashion, green lifestyle', 'Moda Sostenible y Consciente | Pinterest', 'Descubre la moda que cuida el planeta', false),

-- Belleza y Cuidado
((SELECT id FROM public.niche_categories WHERE slug = 'beauty'), 'Cuidado Natural de la Piel', 'natural-skincare', 'Rutinas de cuidado con productos naturales', 'Crea un pin de Pinterest sobre cuidado natural de la piel. Enfócate en ingredientes naturales, rutinas simples, y productos sin químicos agresivos. Incluye tips para diferentes tipos de piel.', 'Natural skincare, organic beauty, gentle ingredients, glowing skin, clean beauty', 'Cuidado Natural de la Piel | Pinterest', 'Rutinas naturales para una piel radiante y saludable', true),
((SELECT id FROM public.niche_categories WHERE slug = 'beauty'), 'Maquillaje para Principiantes', 'beginner-makeup', 'Tutoriales básicos de maquillaje', 'Crea un pin de Pinterest sobre maquillaje para principiantes. Enfócate en técnicas básicas, productos esenciales, y looks simples pero efectivos. Perfecto para quienes están empezando.', 'Beginner makeup, simple techniques, basic products, natural looks, makeup tutorial', 'Maquillaje para Principiantes | Pinterest', 'Aprende maquillaje desde cero con tutoriales fáciles', false),

-- Fitness y Bienestar
((SELECT id FROM public.niche_categories WHERE slug = 'fitness'), 'Ejercicios en Casa', 'home-workouts', 'Rutinas de ejercicio sin salir de casa', 'Crea un pin de Pinterest sobre ejercicios en casa. Enfócate en rutinas que no requieren equipamiento, ejercicios para espacios pequeños, y entrenamientos efectivos desde casa.', 'Home workout, bodyweight exercises, fitness at home, no equipment needed, healthy lifestyle', 'Ejercicios en Casa Efectivos | Pinterest', 'Rutinas de ejercicio sin salir de casa, sin equipamiento', true),
((SELECT id FROM public.niche_categories WHERE slug = 'fitness'), 'Yoga para Principiantes', 'beginner-yoga', 'Poses y rutinas de yoga para empezar', 'Crea un pin de Pinterest sobre yoga para principiantes. Enfócate en poses básicas, respiración, y rutinas simples para empezar a practicar yoga. Incluye beneficios y tips de relajación.', 'Beginner yoga, basic poses, meditation, flexibility, wellness, mindfulness', 'Yoga para Principiantes | Pinterest', 'Inicia tu práctica de yoga con poses y rutinas básicas', false);
