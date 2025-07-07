import { useLanguage } from "@/contexts/LanguageContext";

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
              <li><a href="#" className="hover:text-foreground transition-colors">{t('nav.features')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('nav.pricing')}</a></li>
              <li><a href="/pinterest-guide" className="hover:text-foreground transition-colors">{t('nav.pinterestGuide')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.api')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.integrations')}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.tutorials')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.serviceStatus')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PinCraft. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}