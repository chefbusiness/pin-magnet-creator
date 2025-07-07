import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: "María González",
      role: "Blogger de Lifestyle",
      content: "PinCraft me ahorra horas cada semana. Antes tardaba 30 minutos por pin, ahora genero 10 variaciones en menos de 2 minutos.",
      avatar: "👩‍💻"
    },
    {
      name: "Carlos Martín",
      role: "Marketing Manager",
      content: "Nuestro tráfico de Pinterest aumentó 300% desde que empezamos a usar PinCraft. La calidad de los pines es increíble.",
      avatar: "👨‍💼"
    },
    {
      name: "Ana Silva",
      role: "E-commerce Owner",
      content: "Como dueña de una tienda online, necesitaba crear pines constantemente. PinCraft me permite mantener una presencia consistente sin esfuerzo.",
      avatar: "👩‍🎨"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Lo Que Dicen Nuestros Usuarios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de creators ya están multiplicando su tráfico con PinCraft
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}