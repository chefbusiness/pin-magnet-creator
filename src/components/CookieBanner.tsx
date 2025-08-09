import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [openPrefs, setOpenPrefs] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({ analytics: false, marketing: false });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const value: ConsentState = { analytics: true, marketing: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    setVisible(false);
  };

  const savePrefs = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
    setOpenPrefs(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-50">
      <div className="container mx-auto max-w-4xl bg-background/95 backdrop-blur border rounded-xl p-4 shadow">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">{t('cookies.banner.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('cookies.banner.desc')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={openPrefs} onOpenChange={setOpenPrefs}>
              <DialogTrigger asChild>
                <Button variant="outline">{t('cookies.banner.customize')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('cookies.banner.title')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('cookies.banner.analytics')}</p>
                      <p className="text-sm text-muted-foreground">Google Analytics, Mixpanel (opcional)</p>
                    </div>
                    <Switch checked={consent.analytics} onCheckedChange={(v) => setConsent((c) => ({ ...c, analytics: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('cookies.banner.marketing')}</p>
                      <p className="text-sm text-muted-foreground">Ads/remarketing (opcional)</p>
                    </div>
                    <Switch checked={consent.marketing} onCheckedChange={(v) => setConsent((c) => ({ ...c, marketing: v }))} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={savePrefs}>{t('cookies.banner.save')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={acceptAll}>{t('cookies.banner.acceptAll')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
