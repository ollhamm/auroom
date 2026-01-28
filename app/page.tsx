import Hero from "./Components/Landing/Hero";
import HowItWorks from "./Components/Landing/HowItWork";
import Benefits from "./Components/Landing/Benefits";
import Security from "./Components/Landing/Security";
import FinalCTA from "./Components/Landing/FinalCTA";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Benefits />
      <Security />
      <FinalCTA />
      <Footer />
    </main>
  );
}
