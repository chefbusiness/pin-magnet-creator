import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t, language } = useLanguage();
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
            <p><strong>{language === 'es' ? 'Última actualización' : 'Last updated'}:</strong> {language === 'es' ? 'Agosto 2025' : 'August 2025'}</p>

            {language === 'es' ? (
              <>
                <section>
                  <h2>1. Aceptación de los Términos</h2>
                  <p>Al acceder y utilizar PinCraft.pro (el "Servicio"), aceptas estos Términos de Uso. Si no estás de acuerdo con alguna parte, no debes utilizar el Servicio.</p>
                </section>
                <section>
                  <h2>2. Descripción del Servicio</h2>
                  <p>PinCraft.pro es una herramienta SaaS que genera pines profesionales para Pinterest a partir de cualquier URL, ofreciendo múltiples variaciones optimizadas para engagement y clics.</p>
                  <ul>
                    <li>Generación de 3–5 variaciones por URL</li>
                    <li>Textos optimizados y descarga en alta resolución</li>
                    <li>Plantillas y estilos profesionales</li>
                    <li>Próximamente: editor, programación y analítica</li>
                  </ul>
                </section>
                <section>
                  <h2>3. Registro y Cuenta</h2>
                  <ul>
                    <li>Debes tener al menos 16 años.</li>
                    <li>Eres responsable de la confidencialidad de tus credenciales.</li>
                    <li>Debes proporcionar información veraz y mantenerla actualizada.</li>
                  </ul>
                </section>
                <section>
                  <h2>4. Suscripciones y Pagos</h2>
                  <p>Ofrecemos planes Freemium, Pro y Business. Los pagos se procesan mediante Stripe. Al suscribirte, autorizas cargos recurrentes según el plan seleccionado.</p>
                  <ul>
                    <li><strong>Renovación:</strong> Mensual (y anual si está disponible).</li>
                    <li><strong>Cancelación:</strong> Puedes cancelar en cualquier momento; el acceso se mantiene hasta el fin del período en curso.</li>
                    <li><strong>Reembolsos:</strong> Salvo disposición legal, no ofrecemos reembolsos por períodos parciales ya disfrutados.</li>
                    <li><strong>Impuestos:</strong> Pueden aplicarse según tu país o región.</li>
                  </ul>
                </section>
                <section>
                  <h2>5. Uso Aceptable</h2>
                  <ul>
                    <li>No realizar ingeniería inversa ni extraer datos masivamente.</li>
                    <li>No usar el Servicio para fines ilegales o no autorizados.</li>
                    <li>No interferir con la seguridad o funcionamiento del Servicio.</li>
                  </ul>
                </section>
                <section>
                  <h2>6. Contenido del Usuario y URLs</h2>
                  <p>Eres responsable del contenido y URLs que proporciones. Debes tener derechos para usar cualquier material (textos, imágenes, marcas) incorporado en los pines generados.</p>
                  <p>Otorgas a PinCraft.pro una licencia limitada para procesar dicho contenido con el único fin de prestar el Servicio.</p>
                </section>
                <section>
                  <h2>7. Propiedad Intelectual</h2>
                  <p>La plataforma, plantillas, marca y software son propiedad de PinCraft.pro. El contenido generado puede utilizar elementos licenciados por terceros. Salvo indicación en contrario, puedes usar los pines generados para tus fines de marketing respetando derechos de terceros.</p>
                </section>
                <section>
                  <h2>8. Limitación de Responsabilidad</h2>
                  <p>El Servicio se proporciona "tal cual". PinCraft.pro no garantiza resultados específicos en engagement o ventas. En la medida permitida por la ley aplicable, nuestra responsabilidad total se limita al importe pagado en los 12 meses anteriores al incidente.</p>
                </section>
                <section>
                  <h2>9. Suspensión y Terminación</h2>
                  <p>Podemos suspender o terminar el acceso por incumplimiento de estos términos o por uso abusivo. Puedes cancelar tu cuenta en cualquier momento.</p>
                </section>
                <section>
                  <h2>10. Cambios en el Servicio o en los Términos</h2>
                  <p>Podemos actualizar el Servicio y estos Términos. Notificaremos cambios sustanciales a través del sitio o por email.</p>
                </section>
                <section>
                  <h2>11. Ley Aplicable y Jurisdicción</h2>
                  <p>Estos términos se rigen por las leyes de España. Cualquier disputa se someterá a los juzgados y tribunales de Madrid, España.</p>
                </section>
                <section>
                  <h2>12. Contacto</h2>
                  <p>Hecho con ❤️ en Madrid. Si tienes preguntas, contáctanos en <a href="mailto:info@pincraft.pro">info@pincraft.pro</a> (John Guerrero).</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2>1. Acceptance of Terms</h2>
                  <p>By accessing and using PinCraft.pro (the "Service"), you agree to these Terms of Use. If you disagree with any part, do not use the Service.</p>
                </section>
                <section>
                  <h2>2. Service Description</h2>
                  <p>PinCraft.pro is a SaaS that generates professional Pinterest pins from any URL, providing multiple variations optimized for engagement and clicks.</p>
                  <ul>
                    <li>Generate 3–5 variations per URL</li>
                    <li>Optimized copy and high-resolution downloads</li>
                    <li>Professional templates and styles</li>
                    <li>Coming soon: editor, scheduling, and analytics</li>
                  </ul>
                </section>
                <section>
                  <h2>3. Registration and Account</h2>
                  <ul>
                    <li>You must be at least 16 years old.</li>
                    <li>You are responsible for safeguarding your credentials.</li>
                    <li>Provide accurate information and keep it up to date.</li>
                  </ul>
                </section>
                <section>
                  <h2>4. Subscriptions and Payments</h2>
                  <p>We offer Freemium, Pro, and Business plans. Payments are processed via Stripe. By subscribing, you authorize recurring charges per your chosen plan.</p>
                  <ul>
                    <li><strong>Renewal:</strong> Monthly (and annual if available).</li>
                    <li><strong>Cancellation:</strong> You can cancel anytime; access continues until the end of the current period.</li>
                    <li><strong>Refunds:</strong> Unless required by law, we do not provide refunds for partial periods already used.</li>
                    <li><strong>Taxes:</strong> May apply based on your country or region.</li>
                  </ul>
                </section>
                <section>
                  <h2>5. Acceptable Use</h2>
                  <ul>
                    <li>No reverse engineering or mass data extraction.</li>
                    <li>Do not use the Service for illegal or unauthorized purposes.</li>
                    <li>Do not interfere with the Service's security or operation.</li>
                  </ul>
                </section>
                <section>
                  <h2>6. User Content and URLs</h2>
                  <p>You are responsible for the content and URLs you provide. You must have the rights to use any material (text, images, trademarks) included in generated pins.</p>
                  <p>You grant PinCraft.pro a limited license to process such content solely to provide the Service.</p>
                </section>
                <section>
                  <h2>7. Intellectual Property</h2>
                  <p>The platform, templates, brand, and software are the property of PinCraft.pro. Generated content may include third-party licensed elements. Unless otherwise indicated, you may use generated pins for your marketing purposes while respecting third-party rights.</p>
                </section>
                <section>
                  <h2>8. Limitation of Liability</h2>
                  <p>The Service is provided "as is". PinCraft.pro does not guarantee specific results in engagement or sales. To the extent permitted by law, our total liability is limited to the amount paid in the 12 months preceding the incident.</p>
                </section>
                <section>
                  <h2>9. Suspension and Termination</h2>
                  <p>We may suspend or terminate access for breaches of these terms or abusive use. You may cancel your account at any time.</p>
                </section>
                <section>
                  <h2>10. Changes to the Service or Terms</h2>
                  <p>We may update the Service and these Terms. We will notify substantial changes via the website or email.</p>
                </section>
                <section>
                  <h2>11. Governing Law and Jurisdiction</h2>
                  <p>These terms are governed by the laws of Spain. Any dispute will be submitted to the courts of Madrid, Spain.</p>
                </section>
                <section>
                  <h2>12. Contact</h2>
                  <p>Made with ❤️ in Madrid. For questions, contact <a href="mailto:info@pincraft.pro">info@pincraft.pro</a> (John Guerrero).</p>
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

export default Terms;
