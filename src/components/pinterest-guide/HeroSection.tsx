import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
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
  );
}