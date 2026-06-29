import React from 'react';

const Sponsors = () => {
  return (
    <section id="sponsors" className="py-24 relative bg-[#020502] overflow-hidden border-t border-[#00ff41]/10">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>
      
      {/* Subtle blue/silver glow effect for the section background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00e5ff]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-6 glitch uppercase tracking-tighter" data-text="/ SPONSORS">
            <span className="text-[#00ff41]">/</span> SPONSORS
          </h2>
        </div>

        {/* Diamond Sponsor Flash Card */}
        <div className="relative group w-full max-w-sm rounded-2xl p-[1px] overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          {/* Minimal premium glow border */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#00e5ff]/60 via-white/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Card Body - Dark background with glassmorphism */}
          <div className="relative h-full w-full bg-[#050a05]/90 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center p-10 z-10 border border-white/5 shadow-[0_0_40px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_60px_rgba(0,229,255,0.2)]">
            
            {/* Category Title */}
            <div className="absolute top-6">
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-white flex items-center gap-2 font-bold bg-white/5 px-5 py-2 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                💎 Diamond Sponsor
              </span>
            </div>

            {/* Devfolio Logo centered */}
            <div className="mt-16 mb-4 flex items-center justify-center w-full">
              {/* Using Devfolio's official white logo SVG hosted on their platform */}
              <img 
                src="https://raw.githubusercontent.com/devfolio/brand-assets/main/Logo/Devfolio_Logo-White.svg" 
                onError={(e) => {
                  e.target.onerror = null; 
                  // Fallback logo URL if githubusercontent fails
                  e.target.src = "https://devfolio.co/blog/content/images/2021/04/Devfolio_Logo-White.png";
                }}
                alt="Devfolio Logo" 
                className="w-56 h-auto object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
              />
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Sponsors;
