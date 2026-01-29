import Hero from "./Components/Landing/Hero";
import HowItWorks from "./Components/Landing/HowItWork";
import Benefits from "./Components/Landing/Benefits";
import Security from "./Components/Landing/Security";
import FinalCTA from "./Components/Landing/FinalCTA";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import SmoothScroll from "./Components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Security />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
