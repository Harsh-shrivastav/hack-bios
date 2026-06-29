import React, { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

import BootAnimation from './components/BootAnimation';
import CustomCursor from './components/CustomCursor';
import StaggeredMenu from './components/StaggeredMenu';
import FloatingSocials from './components/FloatingSocials';
import Hero from './components/Hero';
import Stats from './components/Stats';
import GooeyBanner from './components/GooeyBanner';
import About from './components/About';
import Tracks from './components/Tracks';
import PrizePool from './components/PrizePool';
import Timeline from './components/Timeline';
import PreviousEdition from './components/PreviousEdition';
import Testimonials from './components/Testimonials';
import SponsorMarquee from './components/SponsorMarquee';
import Faq from './components/Faq';
import Contact from './components/Contact';
import { CinematicFooter } from './components/ui/motion-footer';
import RegisterModal from './components/RegisterModal';
import CallForSponsors from './components/CallForSponsors';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [booting, setBooting] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const menuItems = [
    // { label: 'About', link: '#about' },
    // { label: 'Tracks', link: '#tracks' },
    // { label: 'Timeline', link: '#timeline' },
    { label: 'FAQ', link: '#faq' },
    { label: 'Contact', link: '#contact' },
    { label: 'Register', link: '#', onClick: () => setIsRegisterOpen(true) }
  ];

  const socialItems = [
    { label: 'GitHub', link: '#' },
    { label: 'Twitter', link: '#' },
    { label: 'LinkedIn', link: '#' },
    { label: 'Discord', link: 'https://discord.gg/JbtFtYrUds' }
  ];

  useEffect(() => {
    // Initialize Lenis for cinematic smooth scrolling
    const lenis = new Lenis({
      duration: 1.5, // Slower, more cinematic scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      lerp: 0.08,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Global Scroll Transitions
    if (!booting) {
      const sections = document.querySelectorAll('section, main > div');
      sections.forEach((section) => {
        section.classList.add('section-reveal');
        
        ScrollTrigger.create({
          trigger: section,
          start: 'top 85%',
          onEnter: () => section.classList.add('revealed'),
          onLeaveBack: () => section.classList.remove('revealed'),
        });
      });
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [booting]);

  return (
    <div className="bg-[#050a05] text-white min-h-screen selection:bg-[#00ff41] selection:text-[#050a05]">
      <CustomCursor />
      <FloatingSocials />
      
      {booting ? (
        <BootAnimation onComplete={() => setBooting(false)} />
      ) : (
        <div className="animate-fade-in overflow-x-hidden">
          <StaggeredMenu 
            items={menuItems}
            socialItems={socialItems}
          />
          
          <main className="relative">
            {/* Global cinematic background particles/glow could go here */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00ff41]/5 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00e5ff]/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div id="hero-section"><Hero onRegisterClick={() => setIsRegisterOpen(true)} /></div>
            <div className="relative z-10">
              <Stats />
              <GooeyBanner />
              {/* <About /> */}
              {/* <Tracks /> */}
              {/* <PrizePool /> */}
              {/* <Timeline /> */}
              <CallForSponsors />
              <SponsorMarquee />
              <PreviousEdition />
              <Testimonials />
              <Faq />
              <Contact />
            </div>
          </main>
          
          <CinematicFooter />


          <RegisterModal 
            isOpen={isRegisterOpen} 
            onClose={() => setIsRegisterOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}

export default App;
