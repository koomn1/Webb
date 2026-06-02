'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import VeterinarySection from '@/components/VeterinarySection';
import AIDevSection from '@/components/AIDevSection';
import ScrollVideo from '@/components/ScrollVideo';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import ContactWidget from '@/components/ContactWidget';
import VisitorComments from '@/components/VisitorComments';

export default function Home() {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ['hero', 'veterinary', 'video', 'ai', 'gallery'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Navigation isScrolled={isScrolled} activeSection={activeSection} />
      <div id="hero">
        <Hero />
      </div>
      <div id="veterinary">
        <VeterinarySection />
      </div>
      <div id="video">
        <ScrollVideo />
      </div>
      <div id="ai">
        <AIDevSection />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <div id="comments">
        <VisitorComments />
      </div>
      <Footer />
      <div id="assistant">
        <AIAssistant />
      </div>
      <ContactWidget />
    </main>
  );
}
