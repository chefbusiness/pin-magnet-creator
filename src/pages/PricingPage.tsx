import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('nav.pricing')}</title>
        <meta name="description" content={t('pages.pricing.desc')} />
        <link rel="canonical" href="https://pincraft.pro/pricing" />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 px-4 bg-background/50">
          <div className="container mx-auto max-w-6xl text-center mb-2">
            <h1 className="text-3xl lg:text-4xl font-bold">{t('pages.pricing.title')}</h1>
          </div>
          <Pricing />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
