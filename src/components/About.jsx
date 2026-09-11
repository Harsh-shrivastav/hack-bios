import React from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#020502]">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#00ff41]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#00e5ff]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Large low-opacity background illustration */}
      <img
        src="/decor/plumbers-base.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none select-none"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-0 max-w-6xl mx-auto">

          {/* Max — DESKTOP (lg+): standing full height beside the panel */}
          <img
            src="/characters/max.png"
            alt=""
            aria-hidden="true"
            className="hidden lg:block w-80 xl:w-[26rem] h-auto object-contain flex-shrink-0 -mr-20 xl:-mr-28 relative z-10 drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
          />

          {/* Max — MOBILE/TABLET (below lg): standing prominently above the panel, feet
              resting right at its top edge (negative margin pulls the panel up to meet him) —
              much closer to his desktop scale/presence than a tiny icon next to the heading. */}
          <div className="lg:hidden flex justify-center relative z-20 -mb-6 pointer-events-none select-none">
            <img
              src="/characters/max.png"
              alt=""
              aria-hidden="true"
              className="w-36 sm:w-48 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
            />
          </div>

          {/* Floating glass panel */}
          <div className="relative bg-[#050a05]/85 backdrop-blur-xl border border-[#00ff41]/10 rounded-xl p-8 md:p-16 max-w-4xl w-full">
            <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none rounded-xl"></div>
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold glitch uppercase tracking-tighter" data-text="/ ABOUT">
                  <span className="text-[#00ff41]">/</span> ABOUT
                </h2>
              </div>

              <TextGenerateEffect
                words="HackBIOS is Shri Shankaracharya Technical Campus's flagship hackathon — a hands-on sprint where ideas boot into reality. Now in its 3rd edition, it brings developers, designers, and innovators together to build, break, and ship across open innovation tracks spanning a range of domains and problem statements. Our last edition saw 70+ teams compete head-to-head for prizes topped by a ₹50,000 first prize, making HackBIOS a hub for innovation, collaboration, and talent development — built by students, for students, and proudly hosted by SSTC Bhilai."
                className="max-w-3xl mx-auto text-center text-lg md:text-xl font-normal text-gray-300 leading-relaxed font-sans opacity-90"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;