import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Status = () => {
  const { t } = useLanguage();
  const updated = new Date().toLocaleString();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('footer.serviceStatus')}</title>
        <meta name="description" content={t('pages.status.desc')} />
        <link rel="canonical" href="https://pincraft.pro/status" />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{t('pages.status.title')}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-gradient-primary/10">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              <span>{t('status.operational')}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{t('status.updated')} {updated}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Status;
