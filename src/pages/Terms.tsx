import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('footer.terms')}</title>
        <meta name="description" content={t('pages.terms.desc')} />
        <link rel="canonical" href="https://pincraft.pro/terms" />
      </Helmet>
      <Header />
      <main>
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
            <h1>{t('pages.terms.title')}</h1>
            <p>{t('pages.terms.intro')}</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
