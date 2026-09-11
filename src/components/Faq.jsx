import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Who can participate?", a: "Any college student with a valid student ID. We also have special prize categories for all-girls teams and first-time hackers." },
  { q: "How much does it cost?", a: "HackBIOS is completely free! We provide meals, workspace, and a ton of swag. You just need to bring your laptop and energy." },
  { q: "What is the team size?", a: "You can form a team of 2 to 4 members." },
  { q: "Is it an online or offline hackathon?", a: "HackBIOS 3.0 is fundamentally an offline, in-person hackathon held at Shri Shankaracharya Technical Campus, Bhilai." },
  { q: "Will there be food?", a: "Yes, absolutely! We will provide regular meals, midnight snacks, and endless coffee to keep you running." },
  { q: "What if I don't know how to code?", a: "Hackathons are the best place to learn! We'll have mentors, workshops, and beginner-friendly resources. Design and presentation skills are equally important." },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Hero character — left side, outside the panel, in the empty margin */}
      <div className="hidden xl:block absolute left-4 bottom-16 z-10 pointer-events-none select-none">
        <div className="relative">
          <div className="absolute -top-20 left-4 bg-[#050a05]/90 border border-[#00ff41]/40 rounded-lg px-4 py-3 font-mono text-[#00ff41] text-xs leading-relaxed whitespace-nowrap drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]">
            Got questions?<br />I've got you covered.<br />Let's break it down.
          </div>
          <img
            src="/characters/faq-hero.png"
            alt=""
            aria-hidden="true"
            className="w-64 2xl:w-80 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
          />
        </div>
      </div>

      {/* Ship — right side, outside the panel, in the empty margin */}
      <img
        src="/characters/faq-ship.png"
        alt=""
        aria-hidden="true"
        className="hidden xl:block absolute right-0 top-1/3 -translate-y-1/2 w-72 2xl:w-96 h-auto object-contain opacity-90 pointer-events-none select-none drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-3xl">
        {/* Floating glass panel */}
        <div className="relative bg-[#050a05]/85 backdrop-blur-xl border border-[#00ff41]/10 rounded-xl p-8 md:p-12">
          <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02] pointer-events-none rounded-xl"></div>
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-6 glitch uppercase tracking-tighter" data-text="/ FAQ">
                <span className="text-[#00ff41]">/</span> FAQ
              </h2>
              <p className="text-gray-400 font-sans">Common queries from the grid.</p>

              {/* Mobile-only compact character row — hero + speech bubble + ship, in normal
                  flow (the desktop versions need real side-margin outside this panel that
                  doesn't exist below xl, so they can't just be un-hidden as-is). */}
              <div className="xl:hidden flex items-end justify-center gap-3 mt-6 pointer-events-none select-none">
                <img
                  src="/characters/faq-ship.png"
                  alt=""
                  aria-hidden="true"
                  className="h-12 sm:h-16 w-auto object-contain opacity-80 mb-2"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,65,0.12))' }}
                />
                <div className="relative">
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#050a05]/90 border border-[#00ff41]/40 rounded-lg px-3 py-2 font-mono text-[#00ff41] text-[10px] leading-tight whitespace-nowrap drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]">
                    Got questions? I've got you.
                  </div>
                  <img
                    src="/characters/faq-hero.png"
                    alt=""
                    aria-hidden="true"
                    className="h-20 sm:h-28 w-auto object-contain drop-shadow-[0_0_16px_rgba(0,255,65,0.15)]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border transition-all duration-300 rounded-lg ${openIndex === index ? 'border-[#00ff41] bg-[#0a120a]/80 backdrop-blur-sm' : 'border-[#00ff41]/20 bg-[#050a05]/60 backdrop-blur-sm hover:border-[#00ff41]/50'}`}
                >
                  <button 
                    className="w-full text-left px-6 py-4 font-mono text-white flex justify-between items-center interactive focus:outline-none"
                    onClick={() => toggle(index)}
                  >
                    <span className={`pr-4 ${openIndex === index ? 'text-[#00ff41]' : ''}`}>&gt; {faq.q}</span>
                    <ChevronDown 
                      className={`transition-transform duration-300 ${openIndex === index ? 'transform rotate-180 text-[#00ff41]' : 'text-gray-500'}`} 
                      size={20} 
                    />
                  </button>
                  
                  <div 
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openIndex === index ? '200px' : '0px' }}
                  >
                    <div className="px-6 pb-4 text-gray-400 font-sans text-sm md:text-base border-t border-[#00ff41]/10 mt-2 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;