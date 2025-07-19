
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, User, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut, getRemainingPins, isSuperAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'starter': return 'Starter';
      case 'pro': return 'Pro';
      case 'business': return 'Agency';
      default: return planType;
    }
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="h-6 w-6 md:h-8 md:w-8 bg-gradient-primary rounded-lg"></div>
              <span className="text-lg md:text-xl font-bold">PinCraft</span>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.home')}
                  </Link>
                  <Link to="/generate-pins" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.generatePins')}
                  </Link>
                  <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.profile')}
                  </Link>
                </>
              ) : (
                <>
                  <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.home')}
                  </a>
                  <Link to="/generate-pins" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.generatePins')}
                  </Link>
                  <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.features')}
                  </a>
                  <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                    {t('nav.pricing')}
                  </a>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
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
                    <Badge variant="destructive" className="bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-xs">
                      SUPER ADMIN
                    </Badge>
                  )}
                  {profile && !isSuperAdmin() && (
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {getRemainingPins()}/{profile.monthly_limit}
                    </div>
                  )}
                  {profile && isSuperAdmin() && (
                    <div className="text-xs md:text-sm text-muted-foreground">
                      ∞
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden lg:inline">{profile?.full_name || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          {t('nav.dashboard')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          {t('nav.profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled>
                        {t('nav.plan')}: {getPlanName(profile?.plan_type || 'starter')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('nav.logout')}
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

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-gradient-primary rounded-lg"></div>
                      <span>PinCraft</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col space-y-4">
                    {/* Language Selector */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">{t('nav.language')}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
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
                    </div>

                    {/* Navigation Links */}
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium truncate">
                              {profile?.full_name || user.email}
                            </span>
                          </div>
                          {isSuperAdmin() ? (
                            <Badge variant="destructive" className="bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-xs">
                              SUPER ADMIN
                            </Badge>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {getRemainingPins()}/{profile?.monthly_limit} {t('nav.pins')}
                            </div>
                          )}
                        </div>

                        <Link to="/" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.home')}</span>
                        </Link>
                        <Link to="/generate-pins" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.generatePins')}</span>
                        </Link>
                        <Link to="/dashboard" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.dashboard')}</span>
                        </Link>
                        <Link to="/profile" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.profile')}</span>
                        </Link>
                        
                        <div className="border-t pt-4">
                          <div className="text-xs text-muted-foreground mb-2 px-3">
                            {t('nav.plan')}: {getPlanName(profile?.plan_type || 'starter')}
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              signOut();
                              closeSheet();
                            }}
                            className="w-full justify-start gap-3"
                          >
                            <LogOut className="h-4 w-4" />
                            {t('nav.logout')}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <a href="#home" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.home')}</span>
                        </a>
                        <Link to="/generate-pins" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.generatePins')}</span>
                        </Link>
                        <a href="#features" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.features')}</span>
                        </a>
                        <a href="#pricing" onClick={closeSheet} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <span>{t('nav.pricing')}</span>
                        </a>
                        
                        <div className="border-t pt-4 space-y-2">
                          <Button variant="ghost" asChild className="w-full justify-start">
                            <Link to="/auth" onClick={closeSheet}>{t('nav.login')}</Link>
                          </Button>
                          <Button variant="default" asChild className="w-full">
                            <Link to="/auth" onClick={closeSheet}>{t('nav.signup')}</Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
