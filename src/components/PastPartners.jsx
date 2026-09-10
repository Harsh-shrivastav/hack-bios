import React, { useMemo } from 'react';
import './PastPartners.css';

// Real files already sitting in public/past sponsors icons/ — filenames are
// case-sensitive, keep the mixed .JPG casing exactly as on disk.
const LOGO_FILES = [
  '391.jpeg', '427.png', '506.png', '64.png', '696.png', '972.png',
  'IMG_1683.jpg', 'IMG_1684.JPG', 'IMG_1685.JPG', 'IMG_1686.jpg',
  'IMG_1687.jpg', 'IMG_1688.jpg', 'IMG_1689.jpg', 'IMG_1690.jpg',
  'IMG_1691.jpg', 'IMG_1692.jpg', 'IMG_1693.jpg', 'IMG_1694.jpg',
  'IMG_1695.jpg', 'IMG_1696.jpg', 'IMG_1697.jpg',
];

const PastPartners = () => {
  // Randomize each tile's animation duration/delay once per mount so the
  // field reads as organic independent drifting, not a synced grid bobbing
  // in unison. useMemo keeps these stable across re-renders.
  const timings = useMemo(
    () =>
      LOGO_FILES.map(() => ({
        duration: (3 + Math.random() * 3).toFixed(2), // 3s – 6s
        delay: (Math.random() * 2).toFixed(2), // 0s – 2s
      })),
    []
  );

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-mono font-bold mb-4 glitch uppercase tracking-tighter"
            data-text="/ PAST PARTNERS"
          >
            <span className="text-[#00ff41]">/</span> PAST PARTNERS
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base max-w-xl mx-auto opacity-70">
            Organizations that powered previous editions of HackBIOS.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 md:gap-6">
          {LOGO_FILES.map((file, i) => (
            <div
              key={file}
              className="float-tile bg-[#0a120a]/70 backdrop-blur-sm border border-[#00ff41]/10 rounded-xl h-24 p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:border-[#00ff41]/40 hover:bg-[#00ff41]/5 group"
              style={{
                animationDuration: `${timings[i].duration}s`,
                animationDelay: `${timings[i].delay}s`,
              }}
            >
              <img
                src={`/past sponsors icons/${file}`}
                alt={`Past partner ${i + 1}`}
                className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastPartners;
