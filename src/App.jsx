import React, { useState, useEffect, useRef, startTransition } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

import CustomCursor from './components/CustomCursor';
import StaggeredMenu from './components/StaggeredMenu';
import FloatingSocials from './components/FloatingSocials';
import CodonStream from './components/CodonStream';
import IntroGate from './components/IntroGate';
import Hero from './components/Hero';
import Submission from './components/Submission';
import CreateIDSection from './components/CreateIDSection';
import TeamPage from './components/TeamPage';
import Stats from './components/Stats';
import About from './components/About';
import Timeline from './components/Timeline';
import Tracks from './components/Tracks';
import PartnerBanners from './components/PartnerBanners';
import PastPartners from './components/PastPartners';
import PreviousEdition from './components/PreviousEdition';
import Contact from './components/Contact';
import Faq from './components/Faq';
import { CinematicFooter } from './components/ui/motion-footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { requestScrollRefresh } from './lib/scrollRefresh';
import MLHBadge from './components/MLHBadge';
import HackBiosIDCard from './components/HackBiosIDCard';
import { Analytics } from '@vercel/analytics/react';

gsap.registerPlugin(ScrollTrigger);

// Plain client-side navigation (clicking "Team", or "The Team"/logo back to
// Home) doesn't reload the page, so neither the browser nor Lenis reset
// scroll position on their own — the new page just renders wherever
// the old page happened to be scrolled to. A plain window.scrollTo(0,0)
// isn't enough here either, since Lenis tracks its own scroll position and
// would just override that back on the next frame. This resets Lenis itself
// (immediately, not a visible scroll-up animation) on every route change.
// That includes landing on a #section hash (e.g. /team → /#about): without
// the reset, Home first appears at the Team page's old offset (an instant
// jump into mid-page), and HomePage's hash effect below then smooth-scrolls
// from that arbitrary spot instead of from the top.
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

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
          style={{
            background:
              'radial-gradient(circle, rgba(0,255,65,0.05) 0%, rgba(0,255,65,0) 70%)',
          }}
        ></div>

        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(0,229,255,0.05) 0%, rgba(0,229,255,0) 70%)',
            animationDelay: '2s',
          }}
        ></div>
      </div>

      <div id="hero-section">
        <Hero />
      </div>

      <div className="relative z-10">
        <Stats />
        <About />
        <Submission />
        <CreateIDSection />
        <Timeline />
        <Tracks />
        <PartnerBanners />
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
  const location = useLocation();

  const [introDone, setIntroDone] = useState(
    () => window.location.pathname === '/create-id'
  );

  const [muted, setMuted] = useState(false);
  const themeIntroRef = useRef(null);
  const themeLoopRef = useRef(null);
  // Mirrors `muted` for use inside the 'ended' listener below, which is
  // attached once on mount and would otherwise only ever see the initial
  // (stale) value of `muted` from that render.
  const mutedRef = useRef(muted);
  // Tracks whether the user has actually clicked into the site (startTheme
  // called) — before that, nothing is playing yet, so the mute button
  // toggling play/pause has nothing to do.
  const themeStartedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    if (location.pathname === '/create-id') {
      setIntroDone(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const intro = new Audio('/audio/theme-intro.m4a');
    const loop = new Audio('/audio/theme-loop.m4a');

    intro.preload = 'auto';
    loop.preload = 'auto';
    loop.loop = true;
    intro.volume = 0.5;
    loop.volume = 0.5;

    // Muting used to just drop the volume to 0 while both tracks kept
    // playing (and decoding audio) in the background — the "why is it
    // still going" feeling the mute button was supposed to fix. This now
    // actually pauses playback instead, so a muted session stops doing
    // any audio work at all, same as a real pause button.
    intro.addEventListener('ended', () => {
      if (!mutedRef.current) {
        loop.play().catch(() => {});
      }
    });

    themeIntroRef.current = intro;
    themeLoopRef.current = loop;

    intro.load();
    loop.load();
  }, []);

  const startTheme = () => {
    themeStartedRef.current = true;

    if (!muted) {
      themeIntroRef.current?.play().catch(() => {});
    }
  };

  // Mute now pauses/resumes actual playback instead of just silencing
  // volume, so a muted track stops running in the background entirely.
  useEffect(() => {
    if (!themeStartedRef.current) return;

    const intro = themeIntroRef.current;
    const loop = themeLoopRef.current;

    if (muted) {
      intro?.pause();
      loop?.pause();
    } else if (intro && !intro.ended) {
      intro.play().catch(() => {});
    } else {
      loop?.play().catch(() => {});
    }
  }, [muted]);

  const menuItems = [
    { label: 'About', link: '#about' },
    // { label: 'Tracks', link: '#tracks' },
    { label: 'Team', link: '/team' },
    { label: 'FAQ', link: '#faq' },
    { label: 'Contact', link: '#contact' },
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://x.com/thehackBIOS' },
    {
      label: 'LinkedIn',
      link: 'https://www.linkedin.com/company/hackbios-2k26/',
    },
    { label: 'Discord', link: 'https://discord.gg/kDpNBsU3qt' },
  ];

  useEffect(() => {
    // Touch devices already get smooth, GPU-composited native scrolling
    // for free — running Lenis's JS-driven scroll simulation on top of
    // that (via a continuous GSAP-ticker RAF loop, for the entire page
    // lifetime) only adds main-thread work that competes with everything
    // else on the page, which is what made scrolling feel laggy on phones.
    // Desktop wheel/trackpad scrolling isn't smoothed by the browser the
    // same way, so Lenis stays on there.
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // Initialize Lenis for cinematic smooth scrolling (desktop only)
    const lenis = isTouch
      ? null
      : new Lenis({
          duration: 1.5,
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
    const lenisTick = lenis ? (time) => lenis.raf(time * 1000) : null;

    if (lenis) {
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);

      lenis.on('scroll', ScrollTrigger.update);

      // Exposed so other components (e.g. HomePage's #about/#faq/#contact
      // landing scroll) can drive the same smoothed scroll instead of
      // fighting it with a raw scrollIntoView().
      window.__lenis = lenis;
    }

    // Layout (webfonts, images) can still be settling on first mount;
    // re-measure once things stabilize so the Hero pin's scroll distance
    // is calculated correctly.
    const refreshTimer = setTimeout(
      () => requestScrollRefresh(),
      300
    );

    // Mobile browsers resize the real viewport (address bar collapsing/
    // expanding) as the user scrolls, and webfonts can finish loading late —
    // both silently shift where sections actually sit. Without re-measuring,
    // the section-reveal triggers below fire at stale positions, which is
    // what causes content (e.g. Stats) to stay invisible for a stretch of
    // scroll before suddenly popping in.
    const handleViewportChange = () => requestScrollRefresh();

    window.visualViewport?.addEventListener(
      'resize',
      handleViewportChange
    );

    window.addEventListener('resize', handleViewportChange);

    document.fonts?.ready.then(() => requestScrollRefresh());

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
    // Setting up a scroll-reveal ScrollTrigger for every section was
    // running synchronously in the same breath as the rest of the site
    // mounting (right after the "Enter" tap) — real-device profiling
    // showed this contending with the user's very next scroll for main-
    // thread time, adding to that tap-to-scroll delay. requestIdleCallback
    // pushes this setup to run only once the browser is actually free,
    // so it no longer competes with an in-flight scroll gesture. Safari
    // has no requestIdleCallback, hence the setTimeout fallback.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    let idleHandle = null;
    let revealObserver = null;

    if (introDone) {
      idleHandle = idle(() => {
        const sections = document.querySelectorAll('main section');

        // Reveal with an IntersectionObserver instead of ScrollTrigger. It
        // never relies on pre-measured positions, so it cannot go stale when
        // a section above changes height (the Timeline does), which left the
        // sections below it invisible as empty gaps. A section is revealed
        // once, as soon as any part of it is within 15% of the viewport
        // bottom, or is already above the viewport; it is never hidden again.
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { rootMargin: '0px 0px -15% 0px', threshold: 0 }
        );

        sections.forEach((section) => {
          // #create-id sizes itself with `100svh`, which shifts as a
          // phone's address bar collapses/expands while scrolling —
          // exactly during the user's very first scroll, right below
          // Hero. Every re-measure (see the visualViewport listener
          // above) could land its trigger boundary on a slightly
          // different position, flipping "revealed" on/off repeatedly —
          // seen as the section popping in and out while scrolling.
          // It's effectively above-the-fold content anyway, so it just
          // doesn't need a scroll-triggered reveal at all.
          if (section.id === 'create-id') return;

          section.classList.add('section-reveal');
          revealObserver.observe(section);
        });
      });
    }

    return () => {
      clearTimeout(refreshTimer);
      if (idleHandle != null) cancelIdle(idleHandle);
      if (revealObserver) revealObserver.disconnect();

      window.visualViewport?.removeEventListener(
        'resize',
        handleViewportChange
      );

      window.removeEventListener('resize', handleViewportChange);

      if (lenis) {
        gsap.ticker.remove(lenisTick);
        lenis.destroy();

        if (window.__lenis === lenis) {
          window.__lenis = null;
        }
      }

      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [introDone]);

  return (
    <div className="bg-transparent text-white min-h-screen selection:bg-[#00ff41] selection:text-[#050a05]">
      {/* Vercel Analytics */}
      <Analytics />

      <CustomCursor />

      <FloatingSocials />

      <MLHBadge />

      <HackBiosIDCard autoOpen={location.pathname === '/create-id'} />

      {/* One shared mute control — covers the intro's dial/transform sounds
          AND the theme music. Persists across the whole session (not inside
          IntroGate) since the theme keeps playing after the intro unmounts. */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="interactive fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[200] w-14 h-14 flex items-center justify-center border border-[#00ff41]/40 text-[#00ff41] bg-[#010401]/60 md:backdrop-blur-sm hover:bg-[#00ff41]/10 transition-colors duration-200"
      >
        {muted ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
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
            // Flipping introDone mounts the ENTIRE rest of the site in one
            // go — background canvas, nav, and every section on the page —
            // all inside this one tap's event handler. That was measured
            // as the single largest INP (tap-to-response delay) hit on the
            // whole site. startTransition tells React this update is allowed
            // to take a while, so it renders it without blocking the main
            // thread in one synchronous chunk, keeping the tap itself
            // responsive instead of freezing until everything's mounted.
            startTransition(() => {
              setIntroDone(true);
            });
          }}
        />
      )}

      {introDone && <CodonStream />}

      <div
        className={`animate-fade-in ${
          !introDone ? 'h-screen overflow-hidden' : ''
        }`}
      >
        {introDone && (
          <>
            <StaggeredMenu
              items={menuItems}
              socialItems={socialItems}
            />

            <ScrollToTop />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/create-id" element={<HomePage />} />
            </Routes>
          </>
        )}
      </div>
    </div>
  );
}

export default App;