import React from 'react';

const SponsorMarquee = () => {
  const sponsors = [
    "391.jpeg", "427.png", "506.png", "64.png", "696.png", "972.png",
    "IMG_1683.jpg", "IMG_1684.JPG", "IMG_1685.JPG", "IMG_1686.jpg",
    "IMG_1687.jpg", "IMG_1688.jpg", "IMG_1689.jpg", "IMG_1690.jpg",
    "IMG_1691.jpg", "IMG_1692.jpg", "IMG_1693.jpg", "IMG_1694.jpg",
    "IMG_1695.jpg", "IMG_1696.jpg", "IMG_1697.jpg"
  ];

  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <section className="py-16 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-transparent to-transparent z-10"></div>
      
      <div className="mb-8 px-4 relative z-20">
        <h3 className="text-center font-mono text-[#00ff41] text-xs uppercase tracking-[0.5em] opacity-50">
          / PAST_PARTNERS_DATABASE
        </h3>
      </div>

      <div className="flex animate-marquee hover:pause whitespace-nowrap relative z-20">
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
    </section>
  );
};

export default SponsorMarquee;
