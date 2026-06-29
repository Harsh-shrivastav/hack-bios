import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GridScan from './GridScan';
import InfiniteMarquee from './InfiniteMarquee';
import { LocationTag } from './ui/location-tag';
import AnimatedTextCycle from './ui/animated-text-cycle';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ onRegisterClick }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered text reveal on load
      gsap.from('.hero-animate', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.5
      });

      // Parallax and Zoom on Scroll
      gsap.to(bgRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        scale: 1.2,
        y: 100,
        opacity: 0.2,
        ease: 'none'
      });

      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: -150,
        opacity: 0.2,
        scale: 0.9,
        ease: 'none'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#050a05]">
      <div ref={bgRef} className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
        <GridScan
          sensitivity={0.8}
          lineThickness={1}
          linesColor="#00ff41"
          gridScale={0.1}
          scanColor="#00e5ff"
          scanOpacity={0.6}
          enablePost={true}
          bloomIntensity={0.8}
          chromaticAberration={0.003}
          noiseIntensity={0.02}
        />
      </div>
      
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] opacity-30 pointer-events-none"></div>
      
      <div className="scanline z-10 opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] z-0 pointer-events-none"></div>

      <div ref={contentRef} className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="hero-animate mb-8">
          <LocationTag city="Bhilai" country="IND" timezone="IST" />
        </div>
        
        <p className="hero-animate font-mono text-[#00e5ff] text-sm md:text-xl tracking-[0.3em] mb-4 uppercase text-shadow-neon">Shri Shankaracharya Technical Campus</p>
        <h1 className="hero-animate text-5xl md:text-9xl font-black font-mono text-white mb-6 glitch uppercase tracking-tight" data-text="HACKBIOS 3.0">
          <span className="text-shadow-neon">HACKBIOS</span> <span className="text-[#00ff41]">3.0</span>
        </h1>
        <p className="hero-animate font-sans text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed opacity-80">
          Where Ideas Boot Into <br className="md:hidden" />
          <AnimatedTextCycle 
             words={["Reality", "Innovation", "Code", "Future", "Execution"]} 
             interval={2500}
             className="text-[#00ff41] font-mono tracking-wider ml-1.5 drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]"
          />.<br className="hidden md:block"/> { } Build, innovate, and conquer at Central India's premier hackathon.
        </p>

        <div className="hero-animate flex flex-col sm:row gap-6 justify-center items-center">
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onRegisterClick}
              className="px-8 py-4 bg-transparent border-2 border-[#00ff41] text-[#00ff41] font-mono text-lg uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#050a05] transition-all duration-300 box-shadow-neon interactive hover:-translate-y-1"
            >
              Register Now
            </button>
            
            <a 
              href="#" 
              className="px-8 py-4 bg-transparent border-2 border-[#00e5ff] text-[#00e5ff] font-mono text-lg uppercase tracking-widest hover:bg-[#00e5ff] hover:text-[#050a05] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] interactive hover:-translate-y-1"
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <p className="text-[#00ff41] font-mono text-xs uppercase tracking-widest mb-2 opacity-50">Scroll Down</p>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#00ff41] to-transparent mx-auto"></div>
      </div>


      <InfiniteMarquee text="BUILD • INNOVATE • HACK • CREATE • REPEAT" />
    </section>
  );
};

export default Hero;
