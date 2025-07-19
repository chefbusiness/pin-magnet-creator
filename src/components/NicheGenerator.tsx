import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePinGeneration } from "@/hooks/usePinGeneration";
import { Loader2, Sparkles, Globe, FileText, Image, Download } from "lucide-react";
import { GenerationProgress } from "@/components/pin-generator/GenerationProgress";
import { PinResults } from "@/components/pin-generator/PinResults";
import { toast } from "sonner";

interface NicheGeneratorProps {
  nicheData: {
    id: string;
    name: string;
    description: string;
    specialized_prompt: string;
    image_style_prompt: string;
    is_premium: boolean;
  };
  categoryData: {
    name: string;
    emoji: string;
  };
}

const NicheGenerator = ({ nicheData, categoryData }: NicheGeneratorProps) => {
  const [url, setUrl] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [inputMode, setInputMode] = useState<"url" | "custom">("url");
  const { user } = useAuth();
  const { language } = useLanguage();
  const { generatePins, isGenerating, progress, generatedPins, reset } = usePinGeneration();

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Necesitas iniciar sesión para generar pines");
      return;
    }

    if (inputMode === "url" && !url.trim()) {
      toast.error("Por favor ingresa una URL válida");
      return;
    }

    if (inputMode === "custom" && !customContent.trim()) {
      toast.error("Por favor ingresa el contenido para el pin");
      return;
    }

    try {
      await generatePins({
        url: inputMode === "url" ? url : undefined,
        customContent: inputMode === "custom" ? customContent : undefined,
        nicheId: nicheData.id,
        specializedPrompt: nicheData.specialized_prompt,
        imageStylePrompt: nicheData.image_style_prompt
      }, user);
    } catch (error) {
      console.error("Error generating pins:", error);
      toast.error("Error al generar los pines. Inténtalo de nuevo.");
    }
  };

  const handleReset = () => {
    reset();
    setUrl("");
    setCustomContent("");
  };

  if (generatedPins.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Pines Generados</h2>
            <p className="text-muted-foreground">
              Especializados para {nicheData.name}
            </p>
          </div>
          <Button onClick={handleReset} variant="outline">
            Generar Nuevos Pines
          </Button>
        </div>
        <PinResults results={{ pins: generatedPins, count: generatedPins.length, urlAnalysis: {} }} onDownloadImage={async () => {}} />
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Generando Pines Especializados</h2>
          <p className="text-muted-foreground mb-6">
            Creando pines optimizados para {nicheData.name}
          </p>
        </div>
        <GenerationProgress progress={progress} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Prompts Especializados</h3>
            <p className="text-sm text-muted-foreground">
              Optimizado específicamente para {nicheData.name}
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Image className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Estilo Visual Único</h3>
            <p className="text-sm text-muted-foreground">
              Imágenes adaptadas al estilo de {categoryData.name}
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Download className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Alta Calidad</h3>
            <p className="text-sm text-muted-foreground">
              Pines optimizados para máximo engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{categoryData.emoji}</span>
            Generador de Pines - {nicheData.name}
          </CardTitle>
          <CardDescription>
            {nicheData.description}
          </CardDescription>
          {nicheData.is_premium && (
            <Badge variant="secondary" className="w-fit">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Mode Toggle */}
          <div className="flex rounded-lg bg-muted p-1">
            <Button
              variant={inputMode === "url" ? "default" : "ghost"}
              size="sm"
              onClick={() => setInputMode("url")}
              className="flex-1"
            >
              <Globe className="w-4 h-4 mr-2" />
              Desde URL
            </Button>
            <Button
              variant={inputMode === "custom" ? "default" : "ghost"}
              size="sm"
              onClick={() => setInputMode("custom")}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Contenido Personalizado
            </Button>
          </div>

          {/* Input Fields */}
          {inputMode === "url" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">URL del Contenido</label>
              <Input
                type="url"
                placeholder="https://ejemplo.com/mi-articulo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Ingresa la URL de tu blog, producto o contenido
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido Personalizado</label>
              <Textarea
                placeholder={`Describe tu contenido relacionado con ${nicheData.name}...`}
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Describe el contenido para el cual quieres generar pines
              </p>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (!url.trim() && inputMode === "url") || (!customContent.trim() && inputMode === "custom")}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando Pines...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar Pines Especializados
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-muted-foreground">
            Los pines se generarán con prompts especializados para {nicheData.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NicheGenerator;