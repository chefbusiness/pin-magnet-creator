import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePinGeneration } from "@/hooks/usePinGeneration";
import { Loader2, Sparkles, Globe, FileText, Image, Download, ImageOff } from "lucide-react";
import { GenerationProgress } from "@/components/pin-generator/GenerationProgress";
import { PinResults } from "@/components/pin-generator/PinResults";
import { StyleTagSelector } from "@/components/niche/StyleTagSelector";
import { getStyleTagsForNiche } from "@/data/nicheStyleTags";
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
    slug: string;
  };
}

const NicheGenerator = ({ nicheData, categoryData }: NicheGeneratorProps) => {
  const [url, setUrl] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [inputMode, setInputMode] = useState<"url" | "custom">("url");
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([]);
  const [selectedTrendTags, setSelectedTrendTags] = useState<string[]>([]);
  const [noTextOverlay, setNoTextOverlay] = useState(false);
  const [magicPromptEnabled, setMagicPromptEnabled] = useState(true);
  const { user, canGeneratePins } = useAuth();
  const { language } = useLanguage();
  const { generatePins, isGenerating, progress, generatedPins, reset } = usePinGeneration();

  // Get available style tags and trends for this niche category
  const nicheTagsData = getStyleTagsForNiche(categoryData.slug);

  const handleGenerate = async () => {
    if (!user || !canGeneratePins()) {
      toast.error("Necesitas una suscripción activa para generar pines");
      window.location.href = '/#pricing';
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
      // Combine selected style and trend tags into the image style prompt
      let enhancedImageStylePrompt = nicheData.image_style_prompt;
      
      const allSelectedTags = [
        ...nicheTagsData.visualStyles.filter(tag => selectedStyleTags.includes(tag.id)),
        ...nicheTagsData.trends.filter(tag => selectedTrendTags.includes(tag.id))
      ];
      
      if (allSelectedTags.length > 0) {
        // Build strong, prioritized modifiers from user selection
        const styleModifiers = allSelectedTags.map(tag => tag.promptModifier).join(', ');
        // Remove default "Tendencias: ..." block to avoid leaking styles like "boho" por defecto
        let cleanedBase = (nicheData.image_style_prompt || '')
          .replace(/Tendencias:[^\.\n]*[\.\n]?/i, '')
          .trim();
        
        // If user selected any tags, strip style biases from base to keep selections pure
        const biasTokens = [
          'scandinavian nordic style','scandinavian','nordic','hygge aesthetic','hygge',
          'bohemian','boho','botanical','plant-filled','industrial','modern','contemporary',
          'vintage','retro','minimalist','minimal','rustic','farmhouse','aesthetic'
        ];
        if (biasTokens.length) {
          const biasRegex = new RegExp(`\\b(${biasTokens.map(t=>t.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|')})\\b`,`gi`);
          cleanedBase = cleanedBase.replace(biasRegex, '').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();
        }
        
        // Put user-selected modifiers first so the model las priorice, then keep neutral quality/composition bits from base
        enhancedImageStylePrompt = `${styleModifiers}, ${cleanedBase}`.replace(/,\s*,/g, ', ').trim();
      }

      await generatePins({
        url: inputMode === "url" ? url : undefined,
        customContent: inputMode === "custom" ? customContent : undefined,
        nicheId: nicheData.id,
        specializedPrompt: nicheData.specialized_prompt,
        imageStylePrompt: enhancedImageStylePrompt,
        noTextOverlay,
        magicPromptEnabled
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
    setSelectedStyleTags([]);
    setSelectedTrendTags([]);
    setNoTextOverlay(false);
    setMagicPromptEnabled(true);
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
            <h3 className="font-semibold mb-2">Tendencias Pinterest</h3>
            <p className="text-sm text-muted-foreground">
              Incorpora las tendencias más populares de Pinterest
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

          {/* Style Tag Selector */}
          <StyleTagSelector
            availableStyleTags={nicheTagsData.visualStyles}
            availableTrendTags={nicheTagsData.trends}
            selectedStyleTags={selectedStyleTags}
            selectedTrendTags={selectedTrendTags}
            onStyleTagsChange={setSelectedStyleTags}
            onTrendTagsChange={setSelectedTrendTags}
            nicheName={nicheData.name}
            hideIllustration={inputMode === "url"}
          />

          {/* Magic Prompt Toggle */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <label htmlFor="magic-prompt" className="text-sm font-medium cursor-pointer">
                      Magic Prompt (mejorar automáticamente)
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Optimiza el prompt para obtener mejores resultados visuales
                    </p>
                  </div>
                </div>
                <Switch
                  id="magic-prompt"
                  checked={magicPromptEnabled}
                  onCheckedChange={setMagicPromptEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* No Text Overlay Toggle */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <ImageOff className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <label htmlFor="no-text-overlay" className="text-sm font-medium cursor-pointer">
                      Generar imágenes sin texto overlay
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Las imágenes se generarán sin texto superpuesto, solo con el dominio al pie
                    </p>
                  </div>
                </div>
                <Switch
                  id="no-text-overlay"
                  checked={noTextOverlay}
                  onCheckedChange={setNoTextOverlay}
                />
              </div>
            </CardContent>
          </Card>

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
            {(selectedStyleTags.length > 0 || selectedTrendTags.length > 0) && ` y las opciones seleccionadas`}
            {noTextOverlay && ` (sin texto overlay)`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NicheGenerator;
