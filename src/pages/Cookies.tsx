import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Cookies = () => {
  const { t, language } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro — {t('pages.cookies.title')}</title>
        <meta name="description" content={t('pages.cookies.desc')} />
        <link rel="canonical" href="https://pincraft.pro/cookies" />
      </Helmet>
      <Header />
      <main>
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
            <h1>{t('pages.cookies.title')}</h1>
            <p><strong>{language === 'es' ? 'Última actualización' : 'Last updated'}:</strong> {language === 'es' ? 'Agosto 2025' : 'August 2025'}</p>

            {language === 'es' ? (
              <>
                <section>
                  <h2>¿Qué son las cookies?</h2>
                  <p>Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando visitas un sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia.</p>
                </section>
                <section>
                  <h2>Tipos de cookies que usamos</h2>
                  <h3>1. Estrictamente necesarias</h3>
                  <p>Imprescindibles para el funcionamiento básico del sitio (autenticación, seguridad, preferencias esenciales). No pueden desactivarse sin afectar la funcionalidad.</p>
                  <h3>2. Preferencias</h3>
                  <p>Guardan tu idioma y otras elecciones de interfaz.</p>
                  <h3>3. Analíticas</h3>
                  <p>Nos permiten entender cómo se usa la plataforma para mejorarla. Se usan de forma agregada y, cuando procede, con tu consentimiento.</p>
                  <h3>4. Marketing</h3>
                  <p>Solo si las habilitas, para medir campañas y atribución.</p>
                </section>
                <section>
                  <h2>Cookies de terceros</h2>
                  <ul>
                    <li><strong>Supabase</strong> (autenticación y sesión)</li>
                    <li><strong>Stripe</strong> (pagos y facturación)</li>
                    <li><strong>Herramientas de analítica</strong> (si se habilitan)</li>
                  </ul>
                </section>
                <section>
                  <h2>Gestión de cookies</h2>
                  <p>Puedes gestionar tus preferencias desde nuestro banner de cookies o a través de la configuración de tu navegador. También puedes restablecer tu elección aquí mismo:</p>
                  <button
                    onClick={() => {
                      try {
                        localStorage.removeItem('cookie-consent');
                        window.location.reload();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="inline-flex items-center rounded-md border border-border px-3 py-1 text-sm hover:bg-accent/20 transition"
                  >
                    Reiniciar preferencias de cookies
                  </button>
                </section>
                <section>
                  <h2>Cómo desactivar cookies en tu navegador</h2>
                  <ul>
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
                    <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
                  </ul>
                </section>
                <section>
                  <h2>Contacto</h2>
                  <p>Para cualquier consulta, escríbenos a <a href="mailto:info@pincraft.pro">info@pincraft.pro</a>. Hecho con ❤️ en Madrid.</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2>What are cookies?</h2>
                  <p>Cookies are small files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>
                </section>
                <section>
                  <h2>Types of cookies we use</h2>
                  <h3>1. Strictly necessary</h3>
                  <p>Essential for the basic operation of the site (authentication, security, essential preferences). Cannot be disabled without affecting functionality.</p>
                  <h3>2. Preferences</h3>
                  <p>Store your language and other interface choices.</p>
                  <h3>3. Analytics</h3>
                  <p>Help us understand how the platform is used to improve it. Used in aggregate and, where applicable, with your consent.</p>
                  <h3>4. Marketing</h3>
                  <p>Only if enabled, to measure campaigns and attribution.</p>
                </section>
                <section>
                  <h2>Third-party cookies</h2>
                  <ul>
                    <li><strong>Supabase</strong> (authentication and session)</li>
                    <li><strong>Stripe</strong> (payments and billing)</li>
                    <li><strong>Analytics tools</strong> (if enabled)</li>
                  </ul>
                </section>
                <section>
                  <h2>Managing cookies</h2>
                  <p>You can manage your preferences from our cookie banner or via your browser settings. You can also reset your choice right here:</p>
                  <button
                    onClick={() => {
                      try {
                        localStorage.removeItem('cookie-consent');
                        window.location.reload();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="inline-flex items-center rounded-md border border-border px-3 py-1 text-sm hover:bg-accent/20 transition"
                  >
                    Reset cookie preferences
                  </button>
                </section>
                <section>
                  <h2>How to disable cookies in your browser</h2>
                  <ul>
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
                    <li><a href="https://support.microsoft.com/edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
                  </ul>
                </section>
                <section>
                  <h2>Contact</h2>
                  <p>For any inquiries, email us at <a href="mailto:info@pincraft.pro">info@pincraft.pro</a>. Made with ❤️ in Madrid.</p>
                </section>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
