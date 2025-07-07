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
              <li><a href="/pinterest-guide" className="hover:text-foreground transition-colors">Guía Pinterest</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integraciones</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Tutoriales</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Estado del servicio</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Términos de uso</a></li>
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