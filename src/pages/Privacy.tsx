import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('pages.privacy.title')}</title>
        <meta name="description" content={t('pages.privacy.desc')} />
        <link rel="canonical" href="https://pincraft.pro/privacy" />
      </Helmet>
      <Header />
      <main>
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
            <h1>{t('pages.privacy.title')}</h1>
            <p>{t('pages.privacy.intro')}</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
