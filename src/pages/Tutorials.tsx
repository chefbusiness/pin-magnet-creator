import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Tutorials = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('footer.tutorials')}</title>
        <meta name="description" content={t('pages.tutorials.desc')} />
        <link rel="canonical" href="https://pincraft.pro/tutorials" />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{t('pages.tutorials.title')}</h1>
            <p className="text-muted-foreground">{t('common.comingSoon')}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tutorials;
