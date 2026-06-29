import React from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';

const About = () => {
  return (
    <section id="about" className="py-32 relative bg-[#050a05] overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#00ff41]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#00e5ff]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-6 glitch tracking-tighter" data-text="/ MISSION_CORE">
            <span className="text-[#00ff41]">/</span> MISSION_CORE
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00ff41] to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* HackBIOS Info */}
          <div className="cinematic-card bg-[#0a120a]/80 backdrop-blur-md p-10 border border-[#00ff41]/10 group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 border-2 border-[#00ff41] flex items-center justify-center text-[#00ff41] group-hover:bg-[#00ff41] group-hover:text-[#050a05] transition-all duration-500 shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                <span className="font-mono text-2xl font-bold">01</span>
              </div>
              <h3 className="text-3xl font-mono text-white">The HackBIOS Protocol</h3>
            </div>
            
            <TextGenerateEffect words="HackBIOS 3.0 is Central India's premier hackathon, organized by the brightest minds at SSTC Bhilai. It's a 36-hour crucible where innovation meets execution." className="text-gray-400 font-sans text-lg leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <TextGenerateEffect words="Now in its 3rd iteration, we are pushing the boundaries of what's possible, bringing together developers, designers, and visionaries to boot their ideas into reality. Expect intense coding, sleepless nights, and the birth of revolutionary tech." className="text-gray-400 font-sans text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="mt-8 flex gap-2 opacity-20 group-hover:opacity-50 transition-opacity">
              {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 border border-[#00ff41]"></div>)}
            </div>
          </div>

          {/* SSTC Info */}
          <div className="cinematic-card bg-[#0a120a]/80 backdrop-blur-md p-10 border border-[#00e5ff]/10 group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 border-2 border-[#00e5ff] flex items-center justify-center text-[#00e5ff] group-hover:bg-[#00e5ff] group-hover:text-[#050a05] transition-all duration-500 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <span className="font-mono text-2xl font-bold">02</span>
              </div>
              <h3 className="text-3xl font-mono text-white">Technological Epicenter</h3>
            </div>
            
            <TextGenerateEffect words="SSTC Bhilai has been the epicenter of technical excellence in Chhattisgarh. We strongly believe in practical knowledge, cultivating a culture of hands-on building." className="text-gray-400 font-sans text-lg leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <TextGenerateEffect words="With top-tier infrastructure, experienced faculty, and a vibrant student community, SSTC stands as the proud host of HackBIOS, continuing its legacy of empowering the next generation of technologists." className="text-gray-400 font-sans text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="mt-8 flex gap-2 opacity-20 group-hover:opacity-50 transition-opacity">
              {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 border border-[#00e5ff]"></div>)}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
