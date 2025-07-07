import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg"></div>
              <span className="text-xl font-bold">PinCraft</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.home')}
              </a>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.features')}
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.pricing')}
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="uppercase text-xs">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('es')}>
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm">
              {t('nav.login')}
            </Button>
            <Button variant="default" size="sm">
              {t('nav.signup')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}