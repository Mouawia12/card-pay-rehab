import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CardTypes } from "@/components/CardTypes";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { Industries } from "@/components/Industries";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CardTypes />
      <Benefits />
      <Pricing />
      <Industries />
      <Footer />
    </div>
  );
};

export default Index;
