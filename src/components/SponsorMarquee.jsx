import React from 'react';

const SponsorMarquee = () => {
  const sponsors = [
    "391.jpeg", "427.png", "506.png", "64.png", "696.png", "972.png",
    "IMG_1683.PNG", "IMG_1684.JPG", "IMG_1685.JPG", "IMG_1686.PNG",
    "IMG_1687.PNG", "IMG_1688.PNG", "IMG_1689.PNG", "IMG_1690.PNG",
    "IMG_1691.PNG", "IMG_1692.PNG", "IMG_1693.PNG", "IMG_1694.PNG",
    "IMG_1695.PNG", "IMG_1696.PNG", "IMG_1697.PNG"
  ];

  // Double the array for seamless looping
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="py-12 bg-[#050a05] border-y border-[#00ff41]/10 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050a05] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050a05] to-transparent z-10"></div>
      
      <div className="mb-6 px-4">
        <h3 className="text-center font-mono text-[#00ff41] text-xs uppercase tracking-[0.5em] opacity-50">
          / PAST_PARTNERS_DATABASE
        </h3>
      </div>

      <div className="flex animate-marquee hover:pause whitespace-nowrap">
        {duplicatedSponsors.map((icon, i) => (
          <div 
            key={i} 
            className="inline-flex items-center justify-center mx-8 w-32 h-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <img 
              src={`/past sponsors icons/${icon}`} 
              alt="Sponsor" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx="true">{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default SponsorMarquee;
