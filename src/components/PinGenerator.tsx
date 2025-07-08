import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePinGeneration, type GenerationResult } from "@/hooks/usePinGeneration";
import { AuthRequiredSection } from "./pin-generator/AuthRequiredSection";
import { FeatureShowcase } from "./pin-generator/FeatureShowcase";
import { GenerationProgress } from "./pin-generator/GenerationProgress";
import { PinResults } from "./pin-generator/PinResults";
import { ExamplePins } from "./pin-generator/ExamplePins";

export function PinGenerator() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<GenerationResult | null>(null);
  const { generatePins, isGenerating, progress } = usePinGeneration();

  const handleGenerate = async () => {
    if (!url) return;
    
    const result = await generatePins(url, user);
    if (result) {
      setResults(result);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('generator.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('generator.subtitle')}
          </p>
        </div>

        <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('generator.title')}</CardTitle>
            <CardDescription>
              {t('generator.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder={t('generator.placeholder')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-lg h-12"
              />
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={handleGenerate}
                disabled={!url || isGenerating}
                className="px-8"
              >
                {isGenerating ? (progress || t('pinGenerator.generating')) : t('generator.button')}
              </Button>
            </div>

            {!user ? (
              <AuthRequiredSection />
            ) : (
              <FeatureShowcase />
            )}

            {isGenerating && (
              <GenerationProgress progress={progress} />
            )}

            {results && (
              <PinResults results={results} onDownloadImage={downloadImage} />
            )}

            {!results && !isGenerating && (
              <ExamplePins />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}