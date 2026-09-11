import React, { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

import CustomCursor from './components/CustomCursor';
import StaggeredMenu from './components/StaggeredMenu';
import FloatingSocials from './components/FloatingSocials';
import CodonStream from './components/CodonStream';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import PreviousEdition from './components/PreviousEdition';
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
    { label: 'Twitter', link: 'https://x.com/thehackBIOS' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/hackbios-2k26/' },
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

    // Mobile browsers resize the real viewport (address bar collapsing/
    // expanding) as the user scrolls, and webfonts can finish loading late —
    // both silently shift where sections actually sit. Without re-measuring,
    // the section-reveal triggers below fire at stale positions, which is
    // what causes content (e.g. Stats) to stay invisible for a stretch of
    // scroll before suddenly popping in.
    const handleViewportChange = () => ScrollTrigger.refresh();
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.addEventListener('resize', handleViewportChange);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Global Scroll Transitions
    // NOTE: scoped to `main section` only — NOT the structural wrapper divs
    // (the fixed glow layer, #hero-section, the `relative z-10` content
    // wrapper). Every real content block (Stats, About, Contact, Faq, etc.)
    // is already a <section>. Previously this also matched `main > div`,
    // which caught that content wrapper as its own separate fade-in target
    // stacked on top of each section's own trigger — since a parent at
    // opacity:0 hides its children regardless of their own opacity, every
    // section stayed invisible until BOTH triggers fired. The wrapper's
    // trigger position sits right at the end of Hero's 280vh scroll-reveal
    // zone, the least stable measurement on the page (it shifts with screen
    // height, address-bar collapse, and font load timing), which is why the
    // empty gap before Stats showed up differently — but always — across
    // phones.
    if (introDone) {
      const sections = document.querySelectorAll('main section');
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
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
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
   {introDone && <CodonStream />}
      
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
              {/* EventIntro — merged into Hero */}
              <Stats />
              <About />
              {/* Tracks, PrizePool, Timeline — not currently used on the site;
                  see src/components/ if reintroducing them (Timeline in
                  particular pulls in three.js — only import it if it's
                  actually going back on the page) */}
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