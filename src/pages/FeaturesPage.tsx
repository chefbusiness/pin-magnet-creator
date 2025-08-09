import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('nav.features')}</title>
        <meta name="description" content={t('pages.features.desc')} />
        <link rel="canonical" href="https://pincraft.pro/features" />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 px-4 bg-background/50">
          <div className="container mx-auto max-w-6xl text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold">{t('pages.features.title')}</h1>
            <p className="text-lg text-muted-foreground mt-4">{t('features.subtitle')}</p>
          </div>
          <Features />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
