import React, { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

import CustomCursor from './components/CustomCursor';
import StaggeredMenu from './components/StaggeredMenu';
import FloatingSocials from './components/FloatingSocials';
import CircuitBorders from './components/CircuitBorders';
import CodonStream from './components/CodonStream';
import Hero from './components/Hero';
import Stats from './components/Stats';
import GooeyBanner from './components/GooeyBanner';
import About from './components/About';
import Tracks from './components/Tracks';
import PrizePool from './components/PrizePool';
import Timeline from './components/Timeline';
import PreviousEdition from './components/PreviousEdition';
import SponsorMarquee from './components/SponsorMarquee';
import Faq from './components/Faq';
import Contact from './components/Contact';
import { CinematicFooter } from './components/ui/motion-footer';
import Sponsors from './components/Sponsors';
import PastPartners from './components/PastPartners';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MLHBadge from './components/MLHBadge';
import PartnerBanners from './components/PartnerBanners';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const introDone = true;
  const menuItems = [
    { label: 'About', link: '#about' },
    // { label: 'Tracks', link: '#tracks' },
    // { label: 'Timeline', link: '#timeline' },
    { label: 'FAQ', link: '#faq' },
    { label: 'Contact', link: '#contact' }
  ];

  const socialItems = [
    { label: 'GitHub', link: '#' },
    { label: 'Twitter', link: '#' },
    { label: 'LinkedIn', link: '#' },
    { label: 'Discord', link: 'https://discord.gg/kDpNBsU3qt' }
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

    // Keep GSAP ScrollTrigger in sync with Lenis's smoothed scroll —
    // required for the Hero pin/scrub reveal to track accurately.
    // Driving Lenis through GSAP's own ticker (instead of a separate rAF
    // loop) is the documented-correct integration — running both at once
    // is what was causing the Hero pin to mis-measure and never engage.
    const lenisTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    // Layout (webfonts, images) can still be settling on first mount;
    // re-measure once things stabilize so the Hero pin's scroll distance
    // is calculated correctly.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    // Global Scroll Transitions
    if (introDone) {
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
      clearTimeout(refreshTimer);
      gsap.ticker.remove(lenisTick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [introDone]);

  return (
    <div className="bg-transparent text-white min-h-screen selection:bg-[#00ff41] selection:text-[#050a05]">
         <CustomCursor />
   <FloatingSocials />
   <MLHBadge />
   {introDone && (
     <>
       <CodonStream />
       <CircuitBorders />
     </>
   )}
      
      <div className={`animate-fade-in ${!introDone ? 'h-screen overflow-hidden' : ''}`}>
          {introDone && (
            <StaggeredMenu 
              items={menuItems}
              socialItems={socialItems}
            />
          )}
          
          <main className="relative">
            {/* Global cinematic background particles/glow could go here */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00ff41]/5 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00e5ff]/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div id="hero-section"><Hero /></div>
            <div className="relative z-10">
              {/* <EventIntro /> — merged into Hero */}
              <Stats />
              <About />
              {/* <Tracks /> */}
              {/* <PrizePool /> */}
              {/* <Timeline /> */}
              <PartnerBanners />
              <Sponsors />
              <PastPartners />
              <PreviousEdition />
              <Contact />
              <Faq />
              <CinematicFooter />
            </div>
          </main>
          
          
      </div>
    </div>
  );
}

export default App;