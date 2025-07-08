import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: t('testimonials.user1Name'),
      role: t('testimonials.user1Role'),
      content: t('testimonials.user1Content'),
      avatar: "👩‍💻"
    },
    {
      name: t('testimonials.user2Name'),
      role: t('testimonials.user2Role'),
      content: t('testimonials.user2Content'),
      avatar: "👨‍💼"
    },
    {
      name: t('testimonials.user3Name'),
      role: t('testimonials.user3Role'),
      content: t('testimonials.user3Content'),
      avatar: "👩‍🎨"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
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