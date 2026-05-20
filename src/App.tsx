import { useState, useCallback } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import SplashScreen from './components/SplashScreen';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Process from './components/Process';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <ThemeProvider>
      {/* Interactive particle background — fixed behind everything */}
      <ParticleBackground />

      {/* Splash — only on first visit per session */}
      <SplashScreen onDone={handleSplashDone} />

      <div
        className="relative min-h-screen theme-root"
        style={{ opacity: splashDone ? 1 : 0, transition: 'opacity 0.4s ease', position: 'relative', zIndex: 1 }}
      >
        {/* Scroll progress bar */}
        <ScrollProgress />

        {/* Custom pen-tool cursor */}
        <CustomCursor />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main>
          <Hero />
          <Marquee />
          <About />
          <Services />
          <Projects />
          <Process />
          <Pricing />
          <Testimonials />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Back to top */}
        <BackToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;
