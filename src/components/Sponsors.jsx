import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Tier data — real sponsors, correct colors, no invented tiers,     */
/*  no fake filler copy                                               */
/* ------------------------------------------------------------------ */
const tiers = [
  {
    name: 'Diamond',
    tagline: 'Premier innovation partners powering the hackathon.',
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.1)',
    glowHover: 'rgba(0,229,255,0.25)',
    sponsors: [
      {
        src: 'https://raw.githubusercontent.com/devfolio/brand-assets/main/Logo/Devfolio_Logo-White.svg',
        fallback: 'https://devfolio.co/blog/content/images/2021/04/Devfolio_Logo-White.png',
        alt: 'DEVFOLIO',
      },
      {
        src: 'https://cdn.simpleicons.org/github/ffffff',
        alt: 'GITHUB',
      },
      {
        src: 'https://cdn.simpleicons.org/elevenlabs/ffffff',
        alt: 'ELEVENLABS',
      },
    ],
  },
  {
    name: 'Gold',
    tagline: 'Elevating builders with premium resources.',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.1)',
    glowHover: 'rgba(255,215,0,0.25)',
    sponsors: [],
    emptyMessage: 'No sponsors yet — be the first to power the transformation.',
  },
  {
    name: 'Silver',
    tagline: 'Community-driven backing for every team.',
    color: '#c0c0c0',
    glow: 'rgba(192,192,192,0.1)',
    glowHover: 'rgba(192,192,192,0.25)',
    sponsors: [],
    emptyMessage: 'No sponsors yet — be the first to power the transformation.',
  },
  {
    name: 'Bronze',
    tagline: 'Foundational supporters of the hackathon ecosystem.',
    color: '#cd7f32',
    glow: 'rgba(205,127,50,0.1)',
    glowHover: 'rgba(205,127,50,0.25)',
    sponsors: [
  {
    src: '/past sponsors icons/xyz.webp',
    alt: 'XYZ DOMAINS',
  },
],
  },
];

/* ------------------------------------------------------------------ */
/*  Circuit-trace connector between tiers                             */
/* ------------------------------------------------------------------ */
const TierConnector = ({ color = '#00ff41' }) => (
  <div className="flex justify-center py-2 pointer-events-none select-none" aria-hidden="true">
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="opacity-30">
      <line x1="14" y1="0" x2="14" y2="12" stroke={color} strokeWidth="1" />
      <polyline points="14,12 22,12 22,24" stroke={color} strokeWidth="1" fill="none" />
      <line x1="22" y1="24" x2="14" y2="24" stroke={color} strokeWidth="1" />
      <circle cx="14" cy="12" r="2" fill={color} opacity="0.6" />
      <circle cx="22" cy="12" r="1.5" fill={color} opacity="0.5" />
      <circle cx="22" cy="24" r="1.5" fill={color} opacity="0.5" />
      <circle cx="14" cy="24" r="2" fill={color} opacity="0.6" />
      <line x1="14" y1="24" x2="14" y2="36" stroke={color} strokeWidth="1" />
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Individual sponsor capsule                                        */
/* ------------------------------------------------------------------ */
const SponsorCapsule = ({ sponsor, tierColor, tierGlow, tierGlowHover, refProp, tierIndex }) => {
  if (sponsor.placeholder) {
    return (
      <div
        ref={refProp}
        data-tier={tierIndex}
        className="flex items-center justify-center w-40 h-20 md:w-48 md:h-24 rounded-xl border border-dashed transition-all duration-300 px-3"
        style={{ borderColor: `${tierColor}33` }}
      >
        <span
          className="font-mono text-xs md:text-sm uppercase tracking-[0.15em] font-bold text-center"
          style={{ color: `${tierColor}77` }}
        >
          {sponsor.text}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={refProp}
      data-tier={tierIndex}
      className="capsule flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden"
      style={{
        borderColor: `${tierColor}55`,
        boxShadow: `inset 0 1px 2px ${tierColor}15, 0 0 28px ${tierGlowHover}`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'scale(1.06) translateY(-3px)';
        el.style.boxShadow = `inset 0 1px 2px ${tierColor}22, 0 8px 28px ${tierGlowHover}, 0 0 36px ${tierGlowHover}`;
        el.style.borderColor = `${tierColor}88`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = `inset 0 1px 2px ${tierColor}15, 0 0 28px ${tierGlowHover}`;
        el.style.borderColor = `${tierColor}55`;
      }}
    >
      {/* Internal glass gradient */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: `linear-gradient(180deg, ${tierColor}08 0%, transparent 40%, ${tierColor}05 100%)`,
        }}
      />
      <img
        src={sponsor.src}
        alt={sponsor.alt}
        onError={(e) => {
          e.target.onerror = null;
          if (sponsor.fallback) e.target.src = sponsor.fallback;
        }}
        className="h-6 md:h-8 w-auto object-contain pointer-events-none relative z-10"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.08))' }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Empty-state capsule (Gold / Silver)                               */
/* ------------------------------------------------------------------ */
const EmptyStateCapsule = ({ message, tierColor, refProp, tierIndex }) => (
  <div
    ref={refProp}
    data-tier={tierIndex}
    className="capsule flex items-center justify-center w-full max-w-md h-24 md:h-28 rounded-xl border border-dashed transition-all duration-300 relative overflow-hidden"
    style={{
      borderColor: `${tierColor}22`,
      boxShadow: `inset 0 1px 3px ${tierColor}06`,
    }}
  >
    <div
      className="absolute inset-0 pointer-events-none rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${tierColor}04, transparent 50%)`,
      }}
    />
    <p
      className="font-mono text-xs md:text-sm text-center px-6 relative z-10"
      style={{ color: `${tierColor}55` }}
    >
      {message}
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
const Sponsors = () => {
  const sectionRef = useRef(null);
  const tierRefs = useRef([]);
  const logoRefs = useRef([]);
  const logoIndexRef = useRef(0);

  // Reset counter each render
  logoIndexRef.current = 0;

  const setLogoRef = (el) => {
    if (el) {
      logoRefs.current[logoIndexRef.current] = el;
      logoIndexRef.current += 1;
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      tierRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { x: -120, opacity: 0 });
      });

      logoRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { scale: 0.6, opacity: 0 });
      });

      // Master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tierRefs.current.forEach((tierEl, tierIndex) => {
        if (!tierEl) return;

        // Slide tier in from left
        tl.to(tierEl, {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
        }, tierIndex === 0 ? '+=0.3' : '-=0.15');

        // Pop in capsules
        const tierLogos = logoRefs.current.filter(
          (el) => el && el.dataset.tier === String(tierIndex)
        );

        if (tierLogos.length > 0) {
          tl.to(tierLogos, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.7)',
            stagger: 0.07,
          }, '-=0.2');
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="sponsors" className="py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00e5ff]/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-6 glitch uppercase tracking-tighter"
            data-text="/ SPONSORS"
          >
            <span className="text-[#00ff41]">/</span> SPONSORS
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base max-w-xl mx-auto opacity-70">
            Each tier powers a different layer of HackBIOS 3.0.
          </p>
        </div>

        {/* Tier stack — full width, vertically connected */}
        <div className="flex flex-col items-center w-full">
          {tiers.map((tier, tierIndex) => {
            const hasSponsors = tier.sponsors.length > 0;

            return (
              <React.Fragment key={tier.name}>
                {/* Tier rig */}
                <div
                  ref={(el) => (tierRefs.current[tierIndex] = el)}
                  className="relative group w-full rounded-xl overflow-hidden"
                >
                  {/* Gradient border */}
                  <div className="absolute inset-0 rounded-xl p-[1px]">
                    <div
                      className="absolute inset-0 opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(180deg, ${tier.color}88, rgba(255,255,255,0.04) 50%, ${tier.color}33)`,
                      }}
                    />
                  </div>

                  {/* Card body */}
                  <div
                    className="relative bg-[#050a05]/90 backdrop-blur-xl rounded-xl border border-white/5 transition-shadow duration-500 px-6 py-8 md:px-10 md:py-10"
                    style={{ boxShadow: `0 0 40px ${tier.glow}` }}
                  >
                    {/* Corner rivets */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: `${tier.color}30` }} />
                    <div className="absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: `${tier.color}30` }} />
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: `${tier.color}30` }} />
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: `${tier.color}30` }} />

                    {/* Tier header */}
                    <div className="text-center mb-8">
                      <h3
                        className="font-mono text-lg md:text-xl uppercase tracking-[0.25em] font-bold mb-2"
                        style={{ color: tier.color, textShadow: `0 0 16px ${tier.glow}` }}
                      >
                        {tier.name} Partners
                      </h3>
                      <p className="font-sans text-xs md:text-sm opacity-50" style={{ color: tier.color }}>
                        {tier.tagline}
                      </p>
                    </div>

                    {/* Capsule row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
                      {hasSponsors ? (
                        tier.sponsors.map((sponsor, logoIndex) => (
                          <SponsorCapsule
                            key={logoIndex}
                            sponsor={sponsor}
                            tierColor={tier.color}
                            tierGlow={tier.glow}
                            tierGlowHover={tier.glowHover}
                            refProp={setLogoRef}
                            tierIndex={tierIndex}
                          />
                        ))
                      ) : (
                        <EmptyStateCapsule
                          message={tier.emptyMessage}
                          tierColor={tier.color}
                          refProp={setLogoRef}
                          tierIndex={tierIndex}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Circuit connector to next tier */}
                {tierIndex < tiers.length - 1 && (
                  <TierConnector color={tier.color} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;