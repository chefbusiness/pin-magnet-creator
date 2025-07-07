import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut, getRemainingPins, isSuperAdmin } = useAuth();

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
            
            {user ? (
              <>
                {isSuperAdmin() && (
                  <Badge variant="destructive" className="bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold">
                    SUPER ADMIN
                  </Badge>
                )}
                {profile && !isSuperAdmin() && (
                  <div className="text-sm text-muted-foreground">
                    {getRemainingPins()}/{profile.monthly_limit} pines
                  </div>
                )}
                {profile && isSuperAdmin() && (
                  <div className="text-sm text-muted-foreground">
                    ∞ pines ilimitados
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {profile?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      Plan: {profile?.plan_type || 'free'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">{t('nav.login')}</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/auth">{t('nav.signup')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}