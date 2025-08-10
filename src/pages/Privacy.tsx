import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t, language } = useLanguage();
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
            <p><strong>{language === 'es' ? 'Última actualización' : 'Last updated'}:</strong> {language === 'es' ? 'Agosto 2025' : 'August 2025'}</p>

            {language === 'es' ? (
              <>
                <section>
                  <h2>1. Responsable del Tratamiento</h2>
                  <p>PinCraft.pro — Contacto: <a href="mailto:info@pincraft.pro">info@pincraft.pro</a> (John Guerrero). Hecho con ❤️ en Madrid.</p>
                </section>
                <section>
                  <h2>2. Datos que Recopilamos</h2>
                  <ul>
                    <li><strong>Cuenta:</strong> Email y preferencias (idioma).</li>
                    <li><strong>Uso:</strong> Páginas visitadas, acciones dentro de la app, dispositivo/navegador e IP (podría anonimizarse).</li>
                    <li><strong>Contenido proporcionado:</strong> URLs y prompts para generar pines.</li>
                    <li><strong>Pagos:</strong> Datos de facturación procesados por Stripe (no almacenamos números de tarjeta).</li>
                    <li><strong>Cookies:</strong> Ver nuestra Política de Cookies.</li>
                  </ul>
                </section>
                <section>
                  <h2>3. Finalidades y Bases Legales</h2>
                  <ul>
                    <li><strong>Prestación del servicio</strong> (ejecución de contrato).</li>
                    <li><strong>Mejora y analítica</strong> (interés legítimo/consentimiento según corresponda).</li>
                    <li><strong>Comunicaciones</strong> (consentimiento y/o interés legítimo para avisos esenciales).</li>
                    <li><strong>Facturación</strong> (obligación legal y ejecución de contrato).</li>
                    <li><strong>Seguridad</strong> (interés legítimo).</li>
                  </ul>
                </section>
                <section>
                  <h2>4. Conservación</h2>
                  <p>Conservamos los datos mientras la cuenta esté activa y el tiempo necesario para cumplir obligaciones legales. Eliminamos o anonimizamos cuando ya no sean necesarios.</p>
                </section>
                <section>
                  <h2>5. Destinatarios y Encargados</h2>
                  <ul>
                    <li>Proveedores de infraestructura y base de datos (p. ej., Supabase).</li>
                    <li>Procesadores de pago (Stripe).</li>
                    <li>Herramientas de analítica/monitorización (si se habilitan).</li>
                  </ul>
                  <p>No vendemos tus datos. Solo compartimos cuando es necesario para prestar el servicio o por obligación legal.</p>
                </section>
                <section>
                  <h2>6. Transferencias Internacionales</h2>
                  <p>Si se producen, se realizarán con garantías adecuadas (p. ej., cláusulas contractuales tipo) y proveedores con medidas de seguridad equivalentes.</p>
                </section>
                <section>
                  <h2>7. Seguridad</h2>
                  <p>Aplicamos medidas técnicas y organizativas razonables: cifrado en tránsito (TLS), control de accesos y buenas prácticas de seguridad.</p>
                </section>
                <section>
                  <h2>8. Tus Derechos (GDPR)</h2>
                  <ul>
                    <li>Acceso, rectificación, supresión y portabilidad.</li>
                    <li>Limitación u oposición al tratamiento.</li>
                    <li>Retirar el consentimiento en cualquier momento.</li>
                    <li>Reclamar ante la autoridad competente (AEPD en España).</li>
                  </ul>
                  <p>Para ejercer derechos: <a href="mailto:info@pincraft.pro">info@pincraft.pro</a>.</p>
                </section>
                <section>
                  <h2>9. Menores</h2>
                  <p>El servicio no está dirigido a menores de 16 años. Si detectamos datos de menores, los eliminaremos.</p>
                </section>
                <section>
                  <h2>10. Cambios</h2>
                  <p>Podemos actualizar esta política. Publicaremos la versión vigente e indicaremos la fecha de actualización.</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2>1. Data Controller</h2>
                  <p>PinCraft.pro — Contact: <a href="mailto:info@pincraft.pro">info@pincraft.pro</a> (John Guerrero). Made with ❤️ in Madrid.</p>
                </section>
                <section>
                  <h2>2. Data We Collect</h2>
                  <ul>
                    <li><strong>Account:</strong> Email and preferences (language).</li>
                    <li><strong>Usage:</strong> Pages visited, in-app actions, device/browser, and IP (may be anonymized).</li>
                    <li><strong>User-provided content:</strong> URLs and prompts to generate pins.</li>
                    <li><strong>Payments:</strong> Billing data processed by Stripe (we do not store card numbers).</li>
                    <li><strong>Cookies:</strong> See our Cookies Policy.</li>
                  </ul>
                </section>
                <section>
                  <h2>3. Purposes and Legal Bases</h2>
                  <ul>
                    <li><strong>Service delivery</strong> (contract performance).</li>
                    <li><strong>Improvements and analytics</strong> (legitimate interest/consent as applicable).</li>
                    <li><strong>Communications</strong> (consent and/or legitimate interest for essential notices).</li>
                    <li><strong>Billing</strong> (legal obligation and contract performance).</li>
                    <li><strong>Security</strong> (legitimate interest).</li>
                  </ul>
                </section>
                <section>
                  <h2>4. Retention</h2>
                  <p>We retain data while the account remains active and as required to meet legal obligations. We delete or anonymize when no longer needed.</p>
                </section>
                <section>
                  <h2>5. Recipients and Processors</h2>
                  <ul>
                    <li>Infrastructure and database providers (e.g., Supabase).</li>
                    <li>Payment processors (Stripe).</li>
                    <li>Analytics/monitoring tools (if enabled).</li>
                  </ul>
                  <p>We do not sell your data. We only share when necessary to provide the Service or due to legal obligation.</p>
                </section>
                <section>
                  <h2>6. International Transfers</h2>
                  <p>If they occur, they will be carried out with appropriate safeguards (e.g., Standard Contractual Clauses) and providers with equivalent security measures.</p>
                </section>
                <section>
                  <h2>7. Security</h2>
                  <p>We apply reasonable technical and organizational measures: encryption in transit (TLS), access controls, and security best practices.</p>
                </section>
                <section>
                  <h2>8. Your Rights (GDPR)</h2>
                  <ul>
                    <li>Access, rectification, erasure, and portability.</li>
                    <li>Restriction or objection to processing.</li>
                    <li>Withdraw consent at any time.</li>
                    <li>Complain to your local authority (e.g., AEPD in Spain).</li>
                  </ul>
                  <p>To exercise rights: <a href="mailto:info@pincraft.pro">info@pincraft.pro</a>.</p>
                </section>
                <section>
                  <h2>9. Minors</h2>
                  <p>The Service is not directed to individuals under 16. If we detect data from minors, we will delete it.</p>
                </section>
                <section>
                  <h2>10. Changes</h2>
                  <p>We may update this policy and will publish the current version including the update date.</p>
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

export default Privacy;
