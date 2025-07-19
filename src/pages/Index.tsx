
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { EarlyAccess } from "@/components/EarlyAccess";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <EarlyAccess />
      <Footer />
    </div>
  );
};

export default Index;
