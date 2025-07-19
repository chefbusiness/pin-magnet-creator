
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GenerationResult } from "@/hooks/usePinGeneration";

interface PinResultsProps {
  results: GenerationResult;
  onDownloadImage: (imageUrl: string, filename: string) => Promise<void>;
}

export function PinResults({ results, onDownloadImage }: PinResultsProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Function to translate generic style names to Spanish
  const translateStyle = (style: string) => {
    const translations: Record<string, string> = {
      'profesional-elegante': 'Profesional',
      'moderno-llamativo': 'Moderno',
      'aesthetic-tendencia': 'Aesthetic',
      'modern': 'Moderno',
      'creative': 'Creativo', 
      'elegant': 'Elegante'
    };
    return translations[style] || style;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">
          {t('pinGenerator.resultTitle').replace('{count}', results.count.toString())}
        </h3>
        <Badge variant="secondary">
          URL: {results.urlAnalysis.title || t('pinGenerator.contentAnalyzed')}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.pins.map((pin, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-[9/16] relative">
              <img 
                src={pin.imageUrl} 
                alt={pin.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzM2IiBoZWlnaHQ9IjExMDQiIHZpZXdCb3g9IjAgMCA3MzYgMTEwNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjczNiIgaGVpZ2h0PSIxMTA0IiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjM2OCIgeT0iNTUyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkVycm9yIGFsIGNhcmdhciBpbWFnZW48L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-white/90">
                  {translateStyle(pin.style)}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                {pin.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {pin.description}
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownloadImage(pin.imageUrl, `pin-${index + 1}-${translateStyle(pin.style)}.png`)}
                  className="flex-1"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {t('pinGenerator.download')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(pin.imageUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="px-6"
          >
            {t('pinGenerator.viewDashboard')}
          </Button>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            {t('pinGenerator.tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
