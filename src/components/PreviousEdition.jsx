import React from 'react';

// Photos from /past photos/ — extend this array as new files are added.
// Only files that actually exist will show (onerror hides broken images).
const photos = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
];

// Duplicate the array so the marquee loops seamlessly
const doublePhotos = [...photos, ...photos];

const PhotoMarquee = ({ direction = 'left', speed = 40 }) => (
  <div className="relative overflow-hidden">
    {/* Edge fades */}
    <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#050a05] to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#050a05] to-transparent z-10 pointer-events-none" />

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
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          {/* Subtle glow border on hover */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[#00ff41]/20 group-hover:shadow-[0_0_12px_rgba(0,255,65,0.1)] transition-all duration-500 rounded-lg pointer-events-none" />
        </div>
      ))}
    </div>
  </div>
);

const PreviousEdition = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Minimal label */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 mb-10">
        <p className="text-center font-mono text-[#00ff41] text-xs uppercase tracking-[0.5em] opacity-40">
          / GLIMPSES
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
