import React, { useState } from 'react';
import { Image as ImageIcon, MessageSquareQuote, Handshake } from 'lucide-react';

const PreviousEdition = () => {
  const [activeTab, setActiveTab] = useState('photos');

  return (
    <section className="py-24 relative bg-[#050a05]">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03]"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 glitch uppercase" data-text="/ LEGACY">
            <span className="text-[#00e5ff]">/</span> LEGACY
          </h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto">Glimpses from our previous editions.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-[#00ff41]/20 pb-4">
          <button 
            onClick={() => setActiveTab('photos')}
            className={`font-mono px-6 py-2 uppercase tracking-wide transition-all interactive flex items-center gap-2 ${activeTab === 'photos' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-gray-500 hover:text-[#00ff41]'}`}
          >
            <ImageIcon size={18} /> Memory Banks
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`font-mono px-6 py-2 uppercase tracking-wide transition-all interactive flex items-center gap-2 ${activeTab === 'testimonials' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-gray-500 hover:text-[#00ff41]'}`}
          >
            <MessageSquareQuote size={18} /> Testimonials
          </button>
          <button 
            onClick={() => setActiveTab('sponsors')}
            className={`font-mono px-6 py-2 uppercase tracking-wide transition-all interactive flex items-center gap-2 ${activeTab === 'sponsors' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-gray-500 hover:text-[#00ff41]'}`}
          >
            <Handshake size={18} /> Past Partners
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px] animate-fade-in">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`bg-[#0a120a] border border-[#00ff41]/20 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-[#00ff41]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500 backdrop-blur-[2px]">
                    <span className="font-mono text-[#00ff41] border border-[#00ff41] px-4 py-2 bg-[#050a05]/80 shadow-[0_0_15px_rgba(0,255,65,0.3)] tracking-widest text-sm">VIEW_IMAGE</span>
                  </div>
                  <div className="w-full h-full bg-[#050a05] flex items-center justify-center">
                    <img 
                      src={`/past photos/${i}.jpg`} 
                      alt={`HackBIOS hackathon memory ${i}`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 mix-blend-screen" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {[
                { name: "Ananya Deshmukh", role: "Finalist, HackBIOS 2025", text: "We built our entire product in under 24 hours — chaotic, but that pressure is exactly what pushed us to actually ship something instead of just planning forever." },
                { name: "Rohan Mehta", role: "Participant, HackBIOS 2025", text: "Got stuck on our API integration around 3 AM and a mentor walked us through it line by line. That kind of support made a real difference." },
                { name: "Sneha Iyer", role: "Team Lead, HackBIOS 2025", text: "The judges clearly knew what they were talking about — the feedback on our pitch was sharper than anything we'd gotten in a college project review." }
              ].map((t, i) => (
                <div key={i} className="bg-[#0a120a] p-6 border-l-2 border-[#00e5ff] relative">
                  <MessageSquareQuote className="absolute top-4 right-4 text-[#00e5ff]/20" size={48} />
                  <p className="text-gray-300 font-sans italic mb-6 relative z-10">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff] flex items-center justify-center">
                      <span className="text-[#00e5ff] font-mono font-bold">{t.name[0]}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-mono">{t.name}</h4>
                      <span className="text-[#00e5ff] text-xs font-mono">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sponsors Tab */}
          {activeTab === 'sponsors' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {[
                  "391.jpeg", "427.png", "506.png", "64.png", "696.png", "972.png",
                  "IMG_1683.jpg", "IMG_1684.JPG", "IMG_1685.JPG", "IMG_1686.jpg",
                  "IMG_1687.jpg", "IMG_1688.jpg", "IMG_1689.jpg", "IMG_1690.jpg",
                  "IMG_1691.jpg", "IMG_1692.jpg", "IMG_1693.jpg", "IMG_1694.jpg",
                  "IMG_1695.jpg", "IMG_1696.jpg", "IMG_1697.jpg"
                ].map((icon, i) => (
                  <div 
                    key={i} 
                    className="bg-[#0a120a] border border-[#00ff41]/10 h-28 p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:border-[#00ff41]/40 hover:bg-[#00ff41]/5 group cursor-pointer relative"
                  >
                    <div className="absolute inset-0 border border-transparent group-hover:border-[#00ff41]/20 group-hover:shadow-[0_0_15px_rgba(0,255,65,0.05)] transition-all"></div>
                    <img 
                      src={`/past sponsors icons/${icon}`} 
                      alt={`Past Sponsor ${i + 1}`} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default PreviousEdition;