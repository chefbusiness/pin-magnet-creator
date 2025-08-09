import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/pinterest-guide/HeroSection";
import { TopSectorsSection } from "@/components/pinterest-guide/TopSectorsSection";
import { OtherSectorsSection } from "@/components/pinterest-guide/OtherSectorsSection";
import { NicheSectorsSection } from "@/components/pinterest-guide/NicheSectorsSection";
import { ConclusionSection } from "@/components/pinterest-guide/ConclusionSection";
import { Helmet } from "react-helmet-async";

const PinterestGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>Guía de Pinterest — Nichos y Sectores | PinCraft.pro</title>
        <meta name="description" content="Explora los sectores y nichos más rentables en Pinterest y genera pines optimizados con IA." />
        <link rel="canonical" href="https://pincraft.pro/generate-pins" />
      </Helmet>
      <Header />
      
      <main className="container mx-auto max-w-6xl py-8 px-4">
        <HeroSection />
        <TopSectorsSection />
        
        <Separator className="my-16" />
        
        <OtherSectorsSection />
        
        <Separator className="my-16" />
        
        <NicheSectorsSection />
        
        <Separator className="my-16" />
        
        <ConclusionSection />
      </main>

      <Footer />
    </div>
  );
};

export default PinterestGuide;