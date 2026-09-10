import React from 'react';

// Photos from /past photos/ — extend this array as new files are added.
// Only files that actually exist will show (onerror hides broken images).
const photos = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  'DSC00060.JPG',
  'DSC00118.JPG',
  'DSC00132.JPG',
  'DSC08925.JPG',
  'DSC09184.JPG',
  'DSC09204.JPG',
  'DSC09248.JPG',
  'DSC09283.JPG',
  'DSC09322.JPG',
  'DSC09336.JPG',
];

// Duplicate the array so the marquee loops seamlessly
const doublePhotos = [...photos, ...photos];

const PhotoMarquee = ({ direction = 'left', speed = 40 }) => (
  <div className="relative overflow-hidden">
    {/* Edge fades */}
    <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#020502] to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#020502] to-transparent z-10 pointer-events-none" />

    <div
      className="flex gap-4 md:gap-5 w-max"
      style={{
        animation: `marquee-${direction} ${speed}s linear infinite`,
      }}
    >
      {doublePhotos.map((photo, i) => (
        <div
          key={`${photo}-${i}`}
          className="relative flex-shrink-0 w-44 h-28 md:w-64 md:h-40 lg:w-72 lg:h-44 rounded-lg overflow-hidden border border-[#00ff41]/10 group"
        >
          <img
            src={`/past photos/${photo}`}
            alt=""
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-[filter,opacity,transform] duration-700"
          />
          {/* Subtle glow border on hover */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[#00ff41]/20 group-hover:shadow-[0_0_12px_rgba(0,255,65,0.1)] transition-[border-color,box-shadow] duration-500 rounded-lg pointer-events-none" />
        </div>
      ))}
    </div>
  </div>
);

const PreviousEdition = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#020502]">
      {/* Section heading — now matches the animated glitch treatment used by every other section title */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 mb-12">
        <h2
          className="text-center text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-4 glitch uppercase tracking-tighter"
          data-text="/ GLIMPSES"
        >
          <span className="text-[#00ff41]">/</span> GLIMPSES
        </h2>
        <p className="text-center text-gray-400 font-sans text-sm md:text-base max-w-xl mx-auto opacity-70">
          Moments from previous editions of HackBIOS.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <PhotoMarquee direction="left" speed={35} />

      {/* Row 2 — scrolls right (reverse direction) */}
      <div className="mt-4 md:mt-5">
        <PhotoMarquee direction="right" speed={42} />
      </div>

      {/* Row 3 — scrolls left, offset start for visual variety */}
      <div className="mt-4 md:mt-5">
        <PhotoMarquee direction="left" speed={50} />
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default PreviousEdition;