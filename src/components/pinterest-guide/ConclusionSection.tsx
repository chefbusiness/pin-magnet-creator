import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConclusionSection() {
  return (
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
  );
}