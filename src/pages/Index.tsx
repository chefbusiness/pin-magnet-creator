
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { EarlyAccess } from "@/components/EarlyAccess";
import { Footer } from "@/components/Footer";
import { PinGenerator } from "@/components/PinGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>PinCraft.pro: Generador de Pines con IA para Pinterest</title>
        <meta name="description" content="Crea pines de Pinterest profesionales en 1 minuto desde cualquier URL con imágenes y textos optimizados automáticamente." />
        <link rel="canonical" href="https://pincraft.pro/" />
      </Helmet>
      <Header />
      <Hero />
      <PinGenerator />
      <Features />
      <Testimonials />
      <Pricing />
      <EarlyAccess />
      <Footer />
    </div>
  );
};

export default Index;
