import React from 'react';
import { Handshake, Award, Users, Download, Mail } from 'lucide-react';

const CallForSponsors = () => {
  const benefits = [
    {
      icon: Users,
      title: "Talent Acquisition",
      desc: "Connect directly with 500+ top-tier developers, designers, and innovators from across Central India."
    },
    {
      icon: Award,
      title: "Brand Visibility",
      desc: "Feature your brand prominently on our landing page, promotional materials, swag, and main stage."
    },
    {
      icon: Handshake,
      title: "Product Adoption",
      desc: "Introduce your APIs, SDKs, or cloud services to developer teams and watch them build active projects on your tech."
    }
  ];

  return (
    <section id="call-for-sponsors" className="py-24 relative bg-[#020502] overflow-hidden border-t border-[#00ff41]/10">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff41]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-6 glitch uppercase tracking-tighter" data-text="/ SPONSOR_UPLINK">
            <span className="text-[#00ff41]">/</span> SPONSOR_UPLINK
          </h2>
          <p className="text-gray-400 font-sans text-lg max-w-2xl mx-auto leading-relaxed opacity-80">
            Empower the next generation of builders. Partner with HackBIOS 3.0 and connect with premium student talent.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index} 
                className="cinematic-card bg-[#050a05]/80 p-8 border border-[#00ff41]/20 hover:border-[#00ff41]/50 transition-all duration-300 relative group"
              >
                {/* Corner details */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#00ff41]/30"></div>
                <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#00ff41]/30"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#00ff41]/30"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#00ff41]/30"></div>

                <div className="w-12 h-12 rounded-full bg-[#00ff41]/10 flex items-center justify-center mb-6 border border-[#00ff41]/20 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-[#00ff41]" size={24} />
                </div>
                <h3 className="text-xl font-mono text-white mb-4 uppercase tracking-wider">{benefit.title}</h3>
                <p className="text-gray-400 font-sans text-sm leading-relaxed opacity-75">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a 
            href="#" 
            className="px-8 py-4 bg-transparent border-2 border-[#00ff41] text-[#00ff41] font-mono text-base uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#050a05] transition-all duration-300 box-shadow-neon interactive hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Download size={18} />
            Sponsorship Deck
          </a>
          <a 
            href="#contact" 
            className="px-8 py-4 bg-transparent border-2 border-[#00e5ff] text-[#00e5ff] font-mono text-base uppercase tracking-widest hover:bg-[#00e5ff] hover:text-[#050a05] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] interactive hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Mail size={18} />
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallForSponsors;
