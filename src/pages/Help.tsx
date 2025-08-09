import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const Help = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('footer.helpCenter')}</title>
        <meta name="description" content={t('pages.help.desc')} />
        <link rel="canonical" href="https://pincraft.pro/help" />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8">{t('pages.help.title')}</h1>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t('help.faq1.q')}</AccordionTrigger>
                <AccordionContent>{t('help.faq1.a')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t('help.faq2.q')}</AccordionTrigger>
                <AccordionContent>{t('help.faq2.a')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>{t('help.faq3.q')}</AccordionTrigger>
                <AccordionContent>{t('help.faq3.a')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>{t('help.faq4.q')}</AccordionTrigger>
                <AccordionContent>{t('help.faq4.a')}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
