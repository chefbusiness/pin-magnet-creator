import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg"></div>
              <span className="text-xl font-bold">PinCraft</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.product')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground transition-colors">{t('nav.features')}</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link to="/generate-pins" className="hover:text-foreground transition-colors">{t('nav.generatePins')}</Link></li>
              <li><span className="hover:text-foreground transition-colors opacity-60 cursor-not-allowed" aria-disabled title={t('common.comingSoon')}>{t('footer.api')}</span></li>
              <li><span className="hover:text-foreground transition-colors opacity-60 cursor-not-allowed" aria-disabled title={t('common.comingSoon')}>{t('footer.integrations')}</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><a href="https://blog.pincraft.pro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{t('footer.blog')}</a></li>
              <li><span className="hover:text-foreground transition-colors opacity-60 cursor-not-allowed" aria-disabled title={t('common.comingSoon')}>{t('footer.careers')}</span></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground transition-colors">{t('footer.helpCenter')}</Link></li>
              <li><Link to="/tutorials" className="hover:text-foreground transition-colors">{t('footer.tutorials')}</Link></li>
              <li><Link to="/status" className="hover:text-foreground transition-colors">{t('footer.serviceStatus')}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">{t('pages.privacy.title')}</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground transition-colors">{t('pages.cookies.title')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PinCraft. {t('footer.rights')} • {t('footer.madeInMadrid')}</p>
        </div>
      </div>
    </footer>
  );
}