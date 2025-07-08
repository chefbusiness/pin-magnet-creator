import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function EarlyAccess() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call for now
    setTimeout(() => {
      toast({
        title: t('earlyAccess.thankYou'),
        description: t('earlyAccess.notification'),
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-gradient-primary">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="text-white space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">
            {t('earlyAccess.title')}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {t('earlyAccess.subtitle')}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t('earlyAccess.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
            <Button 
              type="submit" 
              variant="secondary" 
              size="lg"
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? t('earlyAccess.sending') : t('earlyAccess.button')}
            </Button>
          </form>
          
          <div className="flex justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{t('earlyAccess.feature1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{t('earlyAccess.feature2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{t('earlyAccess.feature3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}