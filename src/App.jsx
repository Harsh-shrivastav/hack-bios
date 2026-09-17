import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

import CustomCursor from './components/CustomCursor';
import StaggeredMenu from './components/StaggeredMenu';
import FloatingSocials from './components/FloatingSocials';
import CodonStream from './components/CodonStream';
import IntroGate from './components/IntroGate';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import PreviousEdition from './components/PreviousEdition';
import Faq from './components/Faq';
import Contact from './components/Contact';
import { CinematicFooter } from './components/ui/motion-footer';
//import Sponsors from './components/PastPartners';
import PastPartners from './components/PastPartners';
import TeamPage from './components/TeamPage';
import Tracks from './components/Tracks';
import Submission from './components/Submission';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MLHBadge from './components/MLHBadge';
import PartnerBanners from './components/PartnerBanners';



gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  // Lands on the right section when arriving via a "#about"/"#faq"/"#contact"
  // link from another route (e.g. the Team page's nav, which now routes
  // here instead of trying to scroll a section that doesn't exist on that
  // page). React Router doesn't auto-scroll to a hash on client-side
  // navigation the way a full page load does, so this does it by hand
  // once the section has actually mounted — using the same Lenis instance
  // the rest of the page scrolls with (exposed on window by the effect
  // below) so it's a smooth scroll, not a jump, and doesn't fight Lenis
  // on the next frame the way a plain scrollIntoView() would.
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400); // gives Hero/section layout + ScrollTrigger a moment to settle first
    return () => clearTimeout(t);
  }, [location.hash]);

  return (
    <main className="relative">
      {/* Global cinematic background particles/glow could go here.
          These used to be solid-color circles with a large blur() filter
          animating via animate-pulse — combining a big blur with a
          continuous animation forces the browser to redo that blur
          convolution on every pulse frame, for as long as the home page
          is mounted. A radial-gradient is soft at the edges by
          construction, so it gives the same glow with none of that cost;
          the pulse animation is unchanged. */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(0,255,65,0.05) 0%, rgba(0,255,65,0) 70%)' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, rgba(0,229,255,0) 70%)', animationDelay: '2s' }}
        ></div>
      </div>

      <div id="hero-section"><Hero /></div>
      <div className="relative z-10">
        {/* EventIntro — merged into Hero */}
        <Submission />
        <Stats />
        <About />
        <Tracks />
        {/* PrizePool, Timeline — not currently used on the site;
            see src/components/ if reintroducing them (Timeline in
            particular pulls in three.js — only import it if it's
            actually going back on the page) */}
        <PartnerBanners />
        {/* <Sponsors /> */}
        <PastPartners />
        <PreviousEdition />
        <Contact />
        <Faq />
        <CinematicFooter />
      </div>
    </main>
  );
}


function App() {
  const [introDone, setIntroDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const themeIntroRef = useRef(null);
  const themeLoopRef = useRef(null);

  useEffect(() => {
    const intro = new Audio('/audio/theme-intro.m4a');
    const loop = new Audio('/audio/theme-loop.m4a');
    intro.preload = 'auto';
    loop.preload = 'auto';
    loop.loop = true;
    intro.volume = muted ? 0 : 0.5;
    loop.volume = muted ? 0 : 0.5;
    intro.addEventListener('ended', () => {
      loop.play().catch(() => {});
    });
    themeIntroRef.current = intro;
    themeLoopRef.current = loop;
    intro.load();
    loop.load();
  }, []);

  const startTheme = () => {
    const intro = themeIntroRef.current;
    if (intro) intro.play().catch(() => {}); // fired from the Enter click, so this counts as a real user gesture
  };

  // Mute toggles both the currently-playing piece and whichever one starts next.
  useEffect(() => {
    if (themeIntroRef.current) themeIntroRef.current.volume = muted ? 0 : 0.5;
    if (themeLoopRef.current) themeLoopRef.current.volume = muted ? 0 : 0.5;
  }, [muted]);

  const menuItems = [
    { label: 'About', link: '#about' },
    // { label: 'Tracks', link: '#tracks' },
    // { label: 'Timeline', link: '#timeline' },
    { label: 'Team', link: '/team' },
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
    // Exposed so other components (e.g. HomePage's #about/#faq/#contact
    // landing scroll) can drive the same smoothed scroll instead of
    // fighting it with a raw scrollIntoView().
    window.__lenis = lenis;

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
      if (window.__lenis === lenis) window.__lenis = null;
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [introDone]);

  return (
    <div className="bg-transparent text-white min-h-screen selection:bg-[#00ff41] selection:text-[#050a05]">
         <CustomCursor />
   <FloatingSocials />
   <MLHBadge />

   {/* One shared mute control — covers the intro's dial/transform sounds
       AND the theme music. Persists across the whole session (not inside
       IntroGate) since the theme keeps playing after the intro unmounts. */}
   <button
     onClick={() => setMuted((m) => !m)}
     aria-label={muted ? 'Unmute' : 'Mute'}
     className="interactive fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[200] w-14 h-14 flex items-center justify-center border border-[#00ff41]/40 text-[#00ff41] bg-[#010401]/60 backdrop-blur-sm hover:bg-[#00ff41]/10 transition-colors duration-200"
   >
     {muted ? (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
         <path d="M11 5 6 9H2v6h4l5 4V5Z" />
         <line x1="23" y1="9" x2="17" y2="15" />
         <line x1="17" y1="9" x2="23" y2="15" />
       </svg>
     ) : (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
         <path d="M11 5 6 9H2v6h4l5 4V5Z" />
         <path d="M15.5 8.5a5 5 0 0 1 0 7" />
         <path d="M18.5 5.5a9 9 0 0 1 0 13" />
       </svg>
     )}
   </button>

   {!introDone && (
           <IntroGate
             muted={muted}
             onEnter={() => {
               startTheme();
               setIntroDone(true);
             }}
           />
         )}
         {introDone && <CodonStream />}
   
         <div className={`animate-fade-in ${!introDone ? 'h-screen overflow-hidden' : ''}`}>
           {introDone && (
             <>
               <StaggeredMenu
                 items={menuItems}
                 socialItems={socialItems}
               />
   
               <Routes>
                 <Route path="/" element={<HomePage />} />
                 <Route path="/team" element={<TeamPage />} />
               </Routes>
             </>
           )}
         </div>
       </div>
     );
   }
   
   export default App;