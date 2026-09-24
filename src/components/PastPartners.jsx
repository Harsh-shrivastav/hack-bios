import React, { useMemo, useRef, useEffect } from 'react';
import './PastPartners.css';

// Real, properly-named sponsor logos in public/sponsors/
{/*const LOGO_FILES = [
  { file: 'Devfolio.png', name: 'Devfolio' },
  { file: 'ETHIndia.png', name: 'ETHIndia' },
  { file: 'SharpEconomy.png', name: 'Sharp Economy' },
  { file: 'AlpifyTechnologies.png', name: 'Alpify Technologies' },
  { file: 'AlpifyGlobal.png', name: 'Alpify Global' },
  { file: 'InterviewBuddy.png', name: 'Interview Buddy' },
  { file: 'LogiXHunt.png', name: 'LogiXHunt' },
  { file: 'Postman.png', name: 'Postman' },
  { file: 'Polygon.png', name: 'Polygon' },
  { file: 'Replit.png', name: 'Replit' },
  { file: 'Solana.png', name: 'Solana' },
  { file: 'Filecoin.png', name: 'Filecoin' },
  { file: 'XYZ.png', name: '.xyz' },
  { file: 'Echo3d.png', name: 'echo3D' },
  { file: 'Tezos.png', name: 'Tezos' },
  { file: 'Trikon.png', name: 'TRIKON' },
  { file: 'Balsamiq.png', name: 'balsamiq' },
  { file: 'InterviewCake.png', name: 'Interview Cake' },
  { file: 'NewtonSchool.png', name: 'Newton School' },
  { file: 'VerbWire.png', name: 'VERBWIRE' },
  { file: 'Beeceptor.png', name: 'Beeceptor' },
  { file: 'Cybrancee.png', name: 'Cybrancee' },
  { file: 'Rosenfeld.png', name: 'Rosenfeld' },
  { file: 'GiveMyCertificate.png', name: 'GiveMyCertificate' },
];*/}
const LOGO_FILES = [
  { file: 'Devfolio.png', name: 'Devfolio' },
  { file: 'mlh.png', name: 'MLH' },
  { file: 'XYZ.png', name: '.xyz' },
  { file: 'github.png', name: 'GitHub' },
  { file: 'elevenlabs.png', name: 'ElevenLabs' },
  { file: 'purebutton.png', name: 'PureButton', href: 'https://mlh.link/MLHPureButtons-hackathons' },
  { file: 'quillbot.png', name: 'QuillBot' },
  { file: 'tin.png', name: 'Tin' , href: 'https://tin.computer/' },];
const COMMUNITY_LOGO_FILES = [
  { file: 'GDG.png', name: 'GDG' },
  { file:'GFG.png', name:'GFG'},
  { file:'syntaxLogo.png', name:'Syntax'},
  { file:'entropyzero.png', name:'EntropyZero'},
  { file:'nexhack.png', name:'Nexhack'},
  { file:'techsociety.png', name:'TechSociety'},
  { file:'OSEN.png', name:'OSEN'},];

const PastPartners = () => {
  // Each tile has its own infinite float animation plus a backdrop-blur —
  // backdrop-filter has to keep resampling what's behind an element every
  // frame it moves, so 13 of these running continuously even while this
  // section is scrolled miles out of view was pure wasted cost. Pausing
  // the animation via IntersectionObserver when the section isn't visible
  // removes that cost without changing how it looks while it *is* in view.
  const sectionRef = useRef(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('tiles-paused', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Randomize each tile's animation duration/delay once per mount so the
  // field reads as organic independent drifting, not a synced grid bobbing
  // in unison. useMemo keeps these stable across re-renders.
  const timings = useMemo(
    () =>
      LOGO_FILES.map(() => ({
        duration: (3 + Math.random() * 3).toFixed(2), // 3s – 6s
        delay: (Math.random() * 2).toFixed(2), // 0s – 2s
      })),
    []
  );
  const communityTimings = useMemo(
  () =>
    COMMUNITY_LOGO_FILES.map(() => ({
      duration: (3 + Math.random() * 3).toFixed(2),
      delay: (Math.random() * 2).toFixed(2),
    })),
  []
);

  return (
    <section ref={sectionRef} className="py-24 relative ">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-mono font-bold mb-4 glitch uppercase tracking-tighter"
            data-text="/ SPONSORS"
          >
            <span className="text-[#00ff41]">/</span> SPONSORS
          </h2>
          {/*<p className="text-gray-400 font-sans text-sm md:text-base max-w-xl mx-auto opacity-70">
            Organizations that powered previous editions of HackBIOS.
          </p>*/}
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {LOGO_FILES.map((partner, i) => {
            const Tile = partner.href ? 'a' : 'div';
            const tileProps = partner.href
              ? { href: partner.href, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Tile
                key={partner.file}
                {...tileProps}
                className="float-tile w-[45%] sm:w-[30%] md:w-[22%] bg-[#0a120a]/70 backdrop-blur-sm border border-[#00ff41]/10 rounded-xl h-32 md:h-36 p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:border-[#00ff41]/40 hover:bg-[#00ff41]/5 group"
                style={{
                  animationDuration: `${timings[i].duration}s`,
                  animationDelay: `${timings[i].delay}s`,
                }}
              >
                <img
                  src={`/sponsors/${partner.file}`}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Tile>
            );
          })}
        </div>
                <div className="text-center mb-14 mt-20">
          <h2
            className="text-4xl md:text-5xl font-mono font-bold mb-4 glitch uppercase tracking-tighter"
          data-text="/ COMMUNITY PARTNERS"
            >
            <span className="text-[#00ff41]">/</span> COMMUNITY PARTNERS
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
  {COMMUNITY_LOGO_FILES.map((partner, i) => (
    <div
      key={partner.file}
      className="float-tile w-[45%] sm:w-[30%] md:w-[22%] bg-[#0a120a]/70 backdrop-blur-sm border border-[#00ff41]/10 rounded-xl h-32 md:h-36 p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:border-[#00ff41]/40 hover:bg-[#00ff41]/5 group"
      style={{
        animationDuration: `${communityTimings[i].duration}s`,
        animationDelay: `${communityTimings[i].delay}s`,
      }}
    >
      <img
        src={`/sponsors/${partner.file}`}
        alt={partner.name}
        className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  ))}
</div>
<img
  src="/characters/benson.png"
  alt=""
  aria-hidden="true"
  className="hidden xl:block absolute pointer-events-none select-none z-[5]
             xl:h-[26rem] xl:left-[-10%] xl:bottom-[-12%]
             2xl:h-[30rem]
             w-auto opacity-95"
  style={{ filter: 'drop-shadow(0 0 30px rgba(0,255,65,0.15))' }}
/>
<img
  src="/characters/ben-kai.png"
  alt=""
  aria-hidden="true"
  className="hidden xl:block absolute pointer-events-none select-none z-[5]
             xl:h-[24rem] xl:right-[-15%] xl:bottom-[-15%]
             2xl:h-[25rem]
             w-auto opacity-95"
  style={{ filter: 'drop-shadow(0 0 30px rgba(0,255,65,0.15))' }}
/>
      </div>
    </section>
  );
};

export default PastPartners;