import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  ChefHat, 
  Shirt, 
  Sparkles, 
  Users, 
  Baby, 
  Car, 
  Dumbbell, 
  Heart, 
  Camera,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Leaf,
  Palette,
  Music,
  BookOpen,
  Gamepad2,
  Monitor,
  Coffee,
  Scissors,
  Gift,
  Flower,
  TrendingUp,
  Target,
  Globe
} from "lucide-react";

const PinterestGuide = () => {
  const topSectors = [
    {
      icon: Home,
      title: "Decoración del Hogar y DIY",
      emoji: "🏠",
      subcategories: [
        "Decoración de salas de estar",
        "Diseño de dormitorios", 
        "Decoración de cocinas",
        "Baños y espacios pequeños",
        "Decoración estacional (Navidad, Halloween, primavera)",
        "Proyectos DIY para el hogar",
        "Muebles reciclados y upcycling",
        "Organización del hogar",
        "Decoración con presupuesto limitado",
        "Estilos: minimalista, bohemio, rústico, moderno, farmhouse"
      ]
    },
    {
      icon: ChefHat,
      title: "Recetas y Comida",
      emoji: "🍲",
      subcategories: [
        "Recetas saludables",
        "Comida rápida y fácil",
        "Postres y repostería",
        "Meal prep y planificación de comidas",
        "Recetas veganas y vegetarianas",
        "Recetas sin gluten",
        "Cocina internacional",
        "Bebidas y cócteles",
        "Recetas para ocasiones especiales",
        "Técnicas de cocina y tips culinarios"
      ]
    },
    {
      icon: Shirt,
      title: "Moda Femenina",
      emoji: "👗",
      subcategories: [
        "Outfits casuales",
        "Ropa formal y de oficina",
        "Moda de temporada",
        "Guardarropa cápsula",
        "Moda sostenible",
        "Accesorios y joyería",
        "Zapatos y bolsos",
        "Moda para diferentes tipos de cuerpo",
        "Tendencias de moda",
        "Looks para ocasiones especiales"
      ]
    },
    {
      icon: Sparkles,
      title: "Belleza y Cuidado Personal",
      emoji: "💄",
      subcategories: [
        "Tutoriales de maquillaje",
        "Cuidado de la piel",
        "Peinados y cuidado del cabello",
        "Manicura y nail art",
        "Productos de belleza naturales",
        "Rutinas de belleza",
        "Maquillaje para ocasiones especiales",
        "Cuidado anti-edad",
        "Belleza para diferentes tonos de piel",
        "DIY productos de belleza"
      ]
    },
    {
      icon: Users,
      title: "Bodas y Eventos",
      emoji: "👰",
      subcategories: [
        "Vestidos de novia",
        "Decoración de bodas",
        "Centros de mesa",
        "Invitaciones de boda",
        "Peinados para novias",
        "Flores para bodas",
        "Pasteles de boda",
        "Fiestas de cumpleaños",
        "Baby showers",
        "Graduaciones y celebraciones"
      ]
    },
    {
      icon: Baby,
      title: "Maternidad y Bebés",
      emoji: "👶",
      subcategories: [
        "Decoración de nursery",
        "Ropa para bebés",
        "Actividades para niños",
        "Manualidades familiares",
        "Comida para bebés",
        "Juguetes DIY",
        "Organización para familias",
        "Fotografía de bebés",
        "Ideas para fiestas infantiles",
        "Productos para la maternidad"
      ]
    },
    {
      icon: Car,
      title: "Viajes y Aventuras",
      emoji: "✈️",
      subcategories: [
        "Destinos de viaje",
        "Guías de ciudades",
        "Consejos de viaje",
        "Outfits para viajar",
        "Fotografía de viajes",
        "Viajes económicos",
        "Aventuras al aire libre",
        "Mapas y rutas",
        "Hoteles y alojamientos",
        "Gastronomía local"
      ]
    },
    {
      icon: Dumbbell,
      title: "Fitness y Ejercicio",
      emoji: "💪",
      subcategories: [
        "Rutinas de ejercicio",
        "Yoga y meditación",
        "Ejercicios en casa",
        "Motivación fitness",
        "Ropa deportiva",
        "Nutrición deportiva",
        "Entrenamiento con pesas",
        "Cardio y running",
        "Ejercicios específicos",
        "Transformaciones físicas"
      ]
    },
    {
      icon: Heart,
      title: "Salud y Bienestar",
      emoji: "🧘",
      subcategories: [
        "Alimentación saludable",
        "Recetas detox",
        "Cuidado mental",
        "Hábitos saludables",
        "Remedios naturales",
        "Autocuidado",
        "Mindfulness",
        "Vida equilibrada",
        "Suplementos naturales",
        "Terapias alternativas"
      ]
    },
    {
      icon: Camera,
      title: "Fotografía e Inspiración",
      emoji: "📸",
      subcategories: [
        "Técnicas de fotografía",
        "Poses para fotos",
        "Fotografía de paisajes",
        "Retratos y selfies",
        "Fotografía de productos",
        "Edición de fotos",
        "Equipo fotográfico",
        "Fotografía móvil",
        "Composición fotográfica",
        "Inspiración visual"
      ]
    }
  ];

  const otherSectors = [
    {
      icon: Briefcase,
      title: "Negocios y Emprendimiento",
      emoji: "💼",
      subcategories: [
        "Marketing digital",
        "Branding personal",
        "Productividad",
        "Networking",
        "Finanzas personales",
        "Liderazgo",
        "Startup life",
        "Freelancing",
        "Inversiones",
        "Desarrollo profesional"
      ]
    },
    {
      icon: GraduationCap,
      title: "Educación y Aprendizaje",
      emoji: "📚",
      subcategories: [
        "Técnicas de estudio",
        "Idiomas",
        "Cursos online",
        "Habilidades nuevas",
        "Certificaciones",
        "Desarrollo personal",
        "Lectura",
        "Escritura",
        "Matemáticas",
        "Ciencias"
      ]
    },
    {
      icon: Palette,
      title: "Arte y Creatividad",
      emoji: "🎨",
      subcategories: [
        "Pintura y dibujo",
        "Artesanías",
        "Scrapbooking",
        "Caligrafía",
        "Cerámica",
        "Tejido y bordado",
        "Joyería artesanal",
        "Diseño gráfico",
        "Ilustración digital",
        "Arte abstracto"
      ]
    },
    {
      icon: Monitor,
      title: "Tecnología y Gadgets",
      emoji: "💻",
      subcategories: [
        "Gadgets y dispositivos",
        "Apps útiles",
        "Setup de escritorio",
        "Gaming setup",
        "Tech reviews",
        "Programación",
        "Inteligencia artificial",
        "Innovación tecnológica",
        "Smartphones",
        "Accesorios tech"
      ]
    },
    {
      icon: Leaf,
      title: "Jardín y Plantas",
      emoji: "🌱",
      subcategories: [
        "Plantas de interior",
        "Jardinería",
        "Cuidado de plantas",
        "Huertos urbanos",
        "Plantas suculentas",
        "Diseño de jardines",
        "Plantas medicinales",
        "Macetas y decoración",
        "Propagación de plantas",
        "Jardines verticales"
      ]
    },
    {
      icon: Gift,
      title: "Regalos y Ocasiones",
      emoji: "🎁",
      subcategories: [
        "Ideas de regalos",
        "Regalos DIY",
        "Cumpleaños",
        "Navidad",
        "San Valentín",
        "Día de la madre/padre",
        "Aniversarios",
        "Graduaciones",
        "Regalos personalizados",
        "Envoltorio creativo"
      ]
    }
  ];

  const nicheSectors = [
    {
      icon: Heart,
      title: "Mascotas y Animales",
      emoji: "🐕",
      subcategories: [
        "Cuidado de perros",
        "Cuidado de gatos",
        "Accesorios para mascotas",
        "Entrenamiento de mascotas",
        "DIY para mascotas",
        "Alimentación animal",
        "Salud veterinaria",
        "Fotografía de mascotas",
        "Viajes con mascotas",
        "Mascotas exóticas"
      ]
    },
    {
      icon: Car,
      title: "Automóviles y Transporte",
      emoji: "🚗",
      subcategories: [
        "Coches clásicos",
        "Modificaciones de vehículos",
        "Mantenimiento automotriz",
        "Motocicletas",
        "Accesorios para coches",
        "Coches eléctricos",
        "Tuning y personalización",
        "Viajes en carretera",
        "Seguridad vial",
        "Coches de lujo"
      ]
    },
    {
      icon: Dumbbell,
      title: "Deportes Específicos",
      emoji: "⚽",
      subcategories: [
        "Rutinas de entrenamiento",
        "Equipamiento deportivo",
        "Nutrición deportiva",
        "Deportes específicos (fútbol, tenis, natación)",
        "Fitness femenino",
        "Entrenamiento funcional",
        "Deportes extremos",
        "Rehabilitación deportiva",
        "Motivación fitness",
        "Ropa deportiva"
      ]
    },
    {
      icon: Music,
      title: "Música e Instrumentos",
      emoji: "🎵",
      subcategories: [
        "Instrumentos musicales",
        "Producción musical",
        "Festivales y conciertos",
        "Vinyl y coleccionismo",
        "Equipos de audio",
        "Aprendizaje musical",
        "Géneros musicales",
        "Artistas y bandas",
        "Home studio",
        "Karaoke y entretenimiento"
      ]
    },
    {
      icon: BookOpen,
      title: "Literatura y Escritura",
      emoji: "📖",
      subcategories: [
        "Reseñas de libros",
        "Organización de bibliotecas",
        "Book clubs y comunidades lectoras",
        "Escritura creativa",
        "Géneros literarios",
        "Libros para niños",
        "Bookstagram y fotografía de libros",
        "Citas y frases inspiradoras",
        "Autores y biografías",
        "E-books y lectura digital"
      ]
    },
    {
      icon: Gamepad2,
      title: "Gaming y Esports",
      emoji: "🎮",
      subcategories: [
        "Videojuegos",
        "Juegos de mesa",
        "Puzzles y rompecabezas",
        "Juegos de cartas",
        "Gaming setup",
        "Cosplay y disfraces",
        "Streaming y contenido",
        "Torneos y competencias",
        "Coleccionables gaming",
        "Juegos retro"
      ]
    },
    {
      icon: Monitor,
      title: "Tecnología y Gadgets",
      emoji: "📱",
      subcategories: [
        "Gadgets para el hogar",
        "Tecnología wearable",
        "Accesorios para móviles",
        "Setup de oficina en casa",
        "Gaming y entretenimiento",
        "Fotografía y cámaras",
        "Tecnología educativa",
        "Apps y software",
        "Innovaciones tecnológicas",
        "Electrónicos vintage"
      ]
    },
    {
      icon: Globe,
      title: "Historia y Cultura",
      emoji: "🏛️",
      subcategories: [
        "Historia antigua",
        "Culturas del mundo",
        "Monumentos históricos",
        "Arte histórico",
        "Tradiciones culturales",
        "Mitología y leyendas",
        "Arqueología",
        "Museos y patrimonio",
        "Biografías históricas",
        "Eventos históricos"
      ]
    },
    {
      icon: Leaf,
      title: "Sostenibilidad y Vida Eco-Friendly",
      emoji: "🌍",
      subcategories: [
        "Vida zero waste",
        "Productos ecológicos",
        "Energías renovables",
        "Reciclaje y reutilización",
        "Moda sostenible",
        "Alimentación orgánica",
        "Transporte sostenible",
        "Hogar ecológico",
        "Cosmética natural",
        "Activismo ambiental"
      ]
    },
    {
      icon: Camera,
      title: "Fotografía",
      emoji: "📸",
      subcategories: [
        "Técnicas fotográficas",
        "Equipos y accesorios",
        "Edición de fotos",
        "Fotografía de paisajes",
        "Retratos y fotografía de personas",
        "Fotografía de productos",
        "Fotografía callejera",
        "Fotografía de bodas",
        "Fotografía macro",
        "Fotografía nocturna"
      ]
    },
    {
      icon: Calendar,
      title: "Planificación y Organización",
      emoji: "📅",
      subcategories: [
        "Bullet journaling",
        "Planificadores y agendas",
        "Organización del hogar",
        "Productividad personal",
        "Gestión del tiempo",
        "Organización de eventos",
        "Sistemas de archivo",
        "Minimalismo y decluttering",
        "Rutinas diarias",
        "Metas y objetivos"
      ]
    },
    {
      icon: Heart,
      title: "Psicología y Desarrollo Personal",
      emoji: "🧠",
      subcategories: [
        "Autoestima y confianza",
        "Inteligencia emocional",
        "Mindfulness y meditación",
        "Hábitos saludables",
        "Motivación personal",
        "Relaciones interpersonales",
        "Gestión del estrés",
        "Crecimiento personal",
        "Terapia y bienestar mental",
        "Coaching de vida"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto max-w-6xl py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Guía Completa de Pinterest
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Lista Ampliada de Sectores para 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Imágenes de PIN</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Pinterest es una plataforma visual con más de 433 millones de usuarios activos mensuales 
            que buscan inspiración, ideas y productos. Los PINs se organizan en categorías y nichos 
            específicos que atienden a diferentes intereses y necesidades.
          </p>
        </div>

        {/* Top 10 Sectores */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">🏆 Top 10 Sectores Más Populares</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topSectors.map((sector, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <sector.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl">{index + 1}. {sector.title}</span>
                    <span className="text-2xl">{sector.emoji}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground mb-3">Subcategorías:</p>
                    <ul className="space-y-1">
                      {sector.subcategories.map((sub, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Otros Sectores Importantes */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">📈 Otros Sectores Importantes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherSectors.map((sector, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center">
                      <sector.icon className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <span className="text-lg">{sector.title}</span>
                    <span className="text-xl">{sector.emoji}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {sector.subcategories.slice(0, 5).map((sub, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {sub}
                      </li>
                    ))}
                    {sector.subcategories.length > 5 && (
                      <li className="text-sm text-muted-foreground italic">
                        +{sector.subcategories.length - 5} más...
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Nichos Especializados */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">🎯 Nichos Especializados</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nicheSectors.map((sector, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                      <sector.icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="text-lg">{sector.title}</span>
                    <span className="text-xl">{sector.emoji}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {sector.subcategories.slice(0, 5).map((sub, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {sub}
                      </li>
                    ))}
                    {sector.subcategories.length > 5 && (
                      <li className="text-sm text-muted-foreground italic">
                        +{sector.subcategories.length - 5} más...
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Conclusión */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">💡 Conclusión</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Pinterest ofrece oportunidades prácticamente ilimitadas para crear contenido visual 
                atractivo en una amplia variedad de sectores. Desde los nichos más populares como 
                decoración del hogar y recetas, hasta especializaciones como tecnología o 
                sostenibilidad, cada sector tiene su audiencia específica y potencial de engagement.
              </p>
              <div className="mt-6">
                <Badge variant="outline" className="mx-2">433M+ usuarios activos</Badge>
                <Badge variant="outline" className="mx-2">Múltiples nichos</Badge>
                <Badge variant="outline" className="mx-2">Alto engagement</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PinterestGuide;