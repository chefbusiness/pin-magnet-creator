import { Hero } from "@/components/Hero";
import { PinGenerator } from "@/components/PinGenerator";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Hero />
      <PinGenerator />
      <Features />
      <Pricing />
    </div>
  );
};

export default Index;