import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(t('pages.contact.subject'));
    const body = encodeURIComponent(`${t('pages.contact.name')}: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@pincraft.pro?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('footer.contact')}</title>
        <meta name="description" content={t('pages.contact.desc')} />
        <link rel="canonical" href="https://pincraft.pro/contact" />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8">{t('pages.contact.title')}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('pages.contact.name')}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('pages.contact.namePlaceholder')} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('pages.contact.email')}</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('pages.contact.message')}</label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('pages.contact.messagePlaceholder')} required rows={6} />
              </div>
              <div className="text-center">
                <Button type="submit" size="lg">{t('pages.contact.send')}</Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
