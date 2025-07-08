import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface PricingBadgeProps {
  type: 'launch' | 'popular' | 'savings';
  savings?: string;
  text?: string;
}

export function PricingBadge({ type, savings, text }: PricingBadgeProps) {
  const { t } = useLanguage();
  
  if (type === 'launch') {
    return (
      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-3 py-1 animate-pulse">
        🚀 {text || t('pricing.launchOffer')}
      </Badge>
    );
  }
  
  if (type === 'popular') {
    return (
      <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-4 py-1">
        {text || "Más Popular"}
      </Badge>
    );
  }
  
  if (type === 'savings') {
    return (
      <Badge className="bg-green-500/90 text-white font-semibold px-2 py-1 text-xs border border-green-400/50">
        {t('pricing.save')} {savings}/mes
      </Badge>
    );
  }
  
  return null;
}