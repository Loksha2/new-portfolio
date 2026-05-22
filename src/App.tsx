import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { SiteSettingsProvider } from './components/SiteSettingsContext';
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
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ParticleBackground from './components/ParticleBackground';
import AdminDashboard from './components/AdminDashboard'; 

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#admin') {
    return (
      <SiteSettingsProvider>
        <AdminDashboard />
      </SiteSettingsProvider>
    );
  }

  return (
    <SiteSettingsProvider>
      <ThemeProvider>
        <ParticleBackground />
        <SplashScreen onDone={handleSplashDone} />
        <div
          className="relative min-h-screen theme-root"
          style={{ opacity: splashDone ? 1 : 0, transition: 'opacity 0.4s ease', position: 'relative', zIndex: 1 }}
        >
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main>
            <Hero isVisible={splashDone} />
            <Marquee />
            <About />
            <Services />
            <Projects />
            <Process />
            <Pricing />
            <FAQ />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </ThemeProvider>
    </SiteSettingsProvider>
  );
}

export default App;
