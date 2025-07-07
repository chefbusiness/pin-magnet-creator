import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PinGenerator } from "@/components/PinGenerator";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <Hero />
      <PinGenerator />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;