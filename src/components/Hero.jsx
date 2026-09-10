import React, { useEffect, useRef } from 'react';
import { LocationTag } from './ui/location-tag';
import AnimatedTextCycle from './ui/animated-text-cycle';

const FINAL_SCALE = 0.78;
const REVEAL_VH = 180; // extra scroll distance (in viewport-heights) the reveal takes
const DEVFOLIO_LINK = 'https://hackbios2k26.devfolio.co/';

const ease = (t) => t * t * (3 - 2 * t);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Hero = () => {
  const outerRef = useRef(null);     // tall scroll-distance container — holds the "camera" in place while it's scrolled through
  const wrapRef = useRef(null);      // the "camera" — sticky, stays put for the reveal's duration
  const windowRef = useRef(null);    // the physical window: glass + content + frame, scales as ONE object
  const stationRef = useRef(null);   // ancient station architecture, hidden until reveal
  const frameRef = useRef(null);     // window frame chrome, hidden until reveal

  useEffect(() => {
    // Staggered entrance for the content on first load — independent of the scroll reveal.
    const animEls = document.querySelectorAll('.hero-animate');
    animEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.1}s, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.1}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });

    // Scroll-driven reveal — reads real layout position every frame, so it
    // works correctly regardless of Lenis/any smooth-scroll library, no
    // pin/spacer measurement involved.
    let raf;
    function update() {
      const outer = outerRef.current;
      if (outer) {
        const rect = outer.getBoundingClientRect();
        const total = outer.offsetHeight - window.innerHeight;
        const raw = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
        const t = ease(raw);
        const scale = 1 - t * (1 - FINAL_SCALE);

        if (windowRef.current) windowRef.current.style.transform = `scale(${scale})`;
        if (stationRef.current) stationRef.current.style.opacity = String(t);
        if (frameRef.current) frameRef.current.style.opacity = String(clamp((raw - 0.08) / 0.45, 0, 1));
      }
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={outerRef} className="relative w-full" style={{ height: `${100 + REVEAL_VH}vh` }}>
    <div ref={wrapRef} className="sticky top-0 w-full h-screen overflow-hidden bg-transparent">
      {/* ================= ANCIENT STATION — hidden until reveal ================= */}
      <div ref={stationRef} className="absolute inset-0 z-0 opacity-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 46%, rgba(95,108,98,.20), transparent 42%), linear-gradient(90deg, #090c0a 0%, #202722 13%, #0a0e0c 50%, #202722 87%, #090c0a 100%)'
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0 6.5%, #3a433e 6.6% 6.9%, transparent 7% 21%, #303934 21.1% 21.35%, transparent 21.45% 78.55%, #303934 78.65% 78.9%, transparent 79% 93.1%, #3a433e 93.2% 93.5%, transparent 93.6%), linear-gradient(0deg, transparent 0 11%, #303934 11.1% 11.35%, transparent 11.45% 88.55%, #303934 88.65% 88.9%, transparent 89%), repeating-linear-gradient(90deg, transparent 0 125px, rgba(190,200,192,.05) 126px 128px), repeating-linear-gradient(0deg, transparent 0 82px, rgba(190,200,192,.035) 83px 85px)"
            }}
          ></div>
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 160px 45px #000' }}></div>
        </div>

        {/* structural panels */}
        {[
          { cls: 'left-[1.5%] top-[5%] w-[24%] h-[42%]' },
          { cls: 'right-[1.5%] top-[5%] w-[24%] h-[42%]' },
          { cls: 'left-[2%] bottom-[4%] w-[29%] h-[26%]' },
          { cls: 'right-[2%] bottom-[4%] w-[29%] h-[26%]' }
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.cls} border-2`}
            style={{
              background: 'linear-gradient(145deg, #252d29, #0d1210 50%, #1a211e)',
              borderColor: '#39423d',
              boxShadow: 'inset 0 0 35px #000'
            }}
          >
            <div className="absolute inset-[11px] border" style={{ borderColor: '#252d29' }}></div>
          </div>
        ))}

        {/* structural ribs */}
        <div className="absolute left-[7%] top-0 w-[34px] h-full" style={{ background: '#252d29', border: '1px solid #454e48', boxShadow: '0 0 15px #000' }}></div>
        <div className="absolute right-[7%] top-0 w-[34px] h-full" style={{ background: '#252d29', border: '1px solid #454e48', boxShadow: '0 0 15px #000' }}></div>
        <div className="absolute left-0 top-[9%] w-full h-[28px]" style={{ background: '#252d29', border: '1px solid #454e48', boxShadow: '0 0 15px #000' }}></div>
        <div className="absolute left-0 bottom-[12%] w-full h-[24px]" style={{ background: '#252d29', border: '1px solid #454e48', boxShadow: '0 0 15px #000' }}></div>

        {/* consoles outside the window */}
        {['left-[9%]', 'right-[9%]'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} top-[52%] w-[100px] h-[90px] md:w-[120px] md:h-[105px] p-3`}
            style={{
              background: '#0a0f0c',
              border: '2px solid #3a443e',
              boxShadow: 'inset 0 0 22px #000, 0 8px 20px #000',
              color: '#69756d',
              fontFamily: 'monospace',
              fontSize: '8px',
              letterSpacing: '2px'
            }}
          >
            <span className="block mb-3">{i === 0 ? 'OBSERVATION' : 'DECK 07'}</span>
            <i className="block h-[2px] w-[70%] my-[7px]" style={{ background: '#35423a' }}></i>
            <i className="block h-[2px] w-[70%] my-[7px]" style={{ background: '#35423a' }}></i>
          </div>
        ))}

        {/* old lamps */}
        <div className="absolute left-[13%] top-[22%] w-[10px] h-[10px] rounded-full" style={{ background: '#9b8256', boxShadow: '0 0 16px rgba(180,145,72,.7)' }}></div>
        <div className="absolute right-[13%] top-[22%] w-[10px] h-[10px] rounded-full" style={{ background: '#9b8256', boxShadow: '0 0 16px rgba(180,145,72,.7)' }}></div>

        {/* floor line */}
        <div
          className="absolute left-[8%] right-[8%] bottom-[14%] h-[3px]"
          style={{ background: '#3b443f', boxShadow: '0 -22px 0 rgba(49,59,53,.7), 0 18px 0 rgba(22,28,25,.8)' }}
        ></div>
      </div>

      {/* ================= THE WINDOW — glass + content + frame, one physical object ================= */}
      <div ref={windowRef} className="absolute inset-0 z-[5]" style={{ transformOrigin: 'center center' }}>
        <div className="scanline z-10 opacity-15 pointer-events-none"></div>

        {/* Readability scrim */}
        <div
          className="absolute inset-0 z-[15] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(1,4,1,0.78) 0%, rgba(1,4,1,0.55) 35%, rgba(1,4,1,0.15) 65%, transparent 85%)'
          }}
        ></div>

        {/* Vertical wordmark */}
        <div className="hero-animate hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-2 pointer-events-none">
          <span
            className="font-mono text-sm tracking-[0.6em] uppercase text-[#00ff41]"
            style={{
              writingMode: 'vertical-rl',
              textShadow: '0 0 8px rgba(0,255,65,0.6), 0 0 18px rgba(0,255,65,0.35)'
            }}
          >
            Hackbios · 3.0
          </span>
        </div>

        <div className="relative z-20 w-full h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 overflow-hidden">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-[#00ff41]/20 blur-[110px] pointer-events-none accent-breathe"></div>

          <h1 className="hero-animate relative font-black font-mono uppercase leading-[0.9] tracking-tight text-white text-[11vw] md:text-[6.5vw] lg:text-[5.5vw] mb-4 md:mb-6">
            <span className="glitch-heading text-shadow-neon" data-text="Hackbios">Hackbios</span>{' '}
            <span className="glitch-heading text-[#00ff41] text-shadow-neon" data-text="3.0">3.0</span>
          </h1>

          <div className="hero-animate mb-3 md:mb-4">
            <LocationTag city="Bhilai" country="IND" timezone="IST" />
          </div>

          <p className="hero-animate font-mono text-[#00e5ff] text-xs md:text-base tracking-[0.25em] mb-3 md:mb-4 uppercase text-shadow-neon">
            Shri Shankaracharya Technical Campus
          </p>

          <p className="hero-animate font-sans text-base md:text-xl text-gray-300 mb-5 md:mb-8 max-w-2xl leading-snug md:leading-relaxed opacity-80">
            Where ideas boot into{' '}
            <AnimatedTextCycle
              words={["reality", "innovation", "code", "the future", "execution"]}
              interval={2500}
              className="text-[#00ff41] font-mono tracking-wide drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]"
            />
            . Build, innovate, and conquer at Central India's premier hackathon.
          </p>

          <div className="hero-animate flex flex-row gap-4 md:gap-6 items-center">
            <a
              href={DEVFOLIO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive hover:-translate-y-1 transition-transform duration-300"
            >
              <img src="/devfolio-apply-button.png" alt="Apply with Devfolio" className="h-[38px] md:h-[48px] w-auto" />
            </a>

            <a
              href="https://discord.gg/kDpNBsU3qt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center min-w-[150px] md:min-w-[220px] px-4 md:px-6 py-2.5 md:py-3.5 bg-transparent border-2 border-[#00e5ff] text-[#00e5ff] font-mono text-xs md:text-base uppercase tracking-widest hover:bg-[#00e5ff] hover:text-[#050a05] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] interactive hover:-translate-y-1 whitespace-nowrap"
            >
              Join Discord
            </a>
          </div>
        </div>

        <a
          href="#about"
          className="hero-animate absolute bottom-4 right-6 md:right-16 lg:right-24 z-20 flex items-center gap-3 interactive group"
        >
          <p className="text-white font-mono text-xs uppercase tracking-[0.3em] animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:opacity-80 transition-opacity">
            Scroll to explore
          </p>
          <div className="w-8 h-[1px] bg-gradient-to-l from-white to-transparent"></div>
        </a>

        {/* ---- window frame chrome, child of the window, fades in with reveal ---- */}
        <div ref={frameRef} className="absolute inset-0 z-30 opacity-0 pointer-events-none">
          <div
            className="absolute inset-0 border-[5px]"
            style={{
              borderColor: '#4d554f',
              background:
                'linear-gradient(145deg, transparent 0%, transparent 100%)',
              boxShadow: '0 35px 100px #000, inset 0 0 0 8px #111613, inset 0 0 40px #000'
            }}
          ></div>
          <div className="absolute inset-[10px] border-2" style={{ borderColor: '#171d1a', boxShadow: 'inset 0 0 0 1px #59615b' }}></div>
          <div className="absolute inset-[18px] border border-dashed" style={{ borderColor: 'rgba(190,198,190,.2)' }}></div>

          {[
            'top-[12px] left-[12px]', 'top-[12px] right-[12px]',
            'bottom-[12px] left-[12px]', 'bottom-[12px] right-[12px]'
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4 rounded-full`}
              style={{
                background: 'radial-gradient(circle at 34% 30%, #aab0aa 0 7%, #59615b 11% 40%, #181d1a 44%)',
                border: '1px solid #080b09',
                boxShadow: '0 2px 4px #000'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Hero;