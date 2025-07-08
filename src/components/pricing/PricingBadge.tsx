import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface PricingBadgeProps {
  type: 'popular';
  text?: string;
}

export function PricingBadge({ type, text }: PricingBadgeProps) {
  if (type === 'popular') {
    return (
      <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-4 py-1">
        {text || "Más Popular"}
      </Badge>
    );
  }
  
  return null;
}