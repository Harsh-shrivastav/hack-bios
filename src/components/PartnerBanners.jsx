import React from 'react';

const banners = [
  {
    name: 'MLH',
    label: 'Event Partner',
    logo: '/partners/mlh.png',
    href: 'https://mlh.io/',
    color: '#00ff41',
    size: 'h-10 md:h-14',
  },
  {
    name: 'Devfolio',
    label: 'Platform Partner',
    logo: '/partners/devfolio.webp',
    href: 'https://hackbios2k26.devfolio.co/overview',
    color: '#00e5ff',
    size: 'h-24 md:h-32',
  },
];

const PartnerBanners = () => {
  return (
    <section className="py-16 relative bg-[#020502] overflow-visible border-t border-[#00ff41]/10">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="relative flex flex-col items-center gap-6 max-w-3xl mx-auto">

          {/* Argit — mobile: reaching onto the top-left corner of the first (MLH) card, matching
              the "grabbing" personality from desktop. Simpler than the desktop version (single
              image, no clip-path split-layer) since that technique needs per-viewport tuning
              that's too fragile to get right blind on narrow screens — this still gets the
              key feel across: he's physically reaching for the sponsors, not just floating nearby. */}
          <div className="md:hidden relative z-20 flex justify-start w-full -mb-10 pointer-events-none select-none">
            <div className="relative ml-2">
              <img
                src="/characters/sly.png"
                alt=""
                aria-hidden="true"
                className="w-44 sm:w-56 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
              />
            </div>
          </div>

          {/* Argit — desktop: grabbing the MLH card. Same image rendered twice, clipped in half:
              body layer sits BEHIND the card (negative z-index), arm/claw layer sits ABOVE it (z-30).
              Both layers share this absolutely-positioned wrapper so cards never shift/resize. */}
<div className="hidden md:block absolute md:-left-[18rem] lg:-left-[26rem] xl:-left-[30rem] md:top-[-12rem] lg:top-[-12rem] xl:top-[-12rem] pointer-events-none select-none w-64 lg:w-[30rem] xl:w-[36rem]">
            {/* invisible sizer — establishes the wrapper's real width/height so the two absolute layers below line up exactly */}
            <img src="/characters/sly.png" alt="" aria-hidden="true" className="w-full h-auto object-contain opacity-0" />

            <img
              src="/characters/sly.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
              style={{ clipPath: 'inset(0 38% 0 0)', zIndex: -1 }}
            />
            <img
              src="/characters/sly.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ clipPath: 'inset(0 0 0 52%)', zIndex: 30 }}
            />
          </div>

          {/* Simian — mobile: reaching onto the top-right corner of the second (Devfolio) card,
              mirrored from Sly's mobile treatment on the opposite side. */}
          <div className="md:hidden relative z-20 flex justify-end w-full -mb-10 pointer-events-none select-none">
            <div className="relative mr-2">
              <img
                src="/characters/simian.png"
                alt=""
                aria-hidden="true"
                className="w-44 sm:w-56 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,150,255,0.15)]"
              />
            </div>
          </div>

          {/* Simian — desktop: grabbing the Devfolio card from the right, same split-layer
              technique as Sly but mirrored. In Simian's own artwork his reaching claw sits on
              the LEFT side of the sprite (vs. Sly's claw on the right), so the clip-path sides
              are swapped accordingly: body (behind, z=-1) keeps the right portion, claw
              (front, z=30) keeps the left portion — his claw ends up reaching inward toward
              the card either way. */}
          <div className="hidden md:block absolute md:-right-[18rem] lg:-right-[26rem] xl:-right-[30rem] md:top-[-12rem] lg:top-[-12rem] xl:top-[-12rem] pointer-events-none select-none w-64 lg:w-[30rem] xl:w-[36rem]">
            <img src="/characters/simian.png" alt="" aria-hidden="true" className="w-full h-auto object-contain opacity-0" />

            <img
              src="/characters/simian.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,150,255,0.15)]"
              style={{ clipPath: 'inset(0 0 0 48%)', zIndex: -1 }}
            />
            <img
              src="/characters/simian.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ clipPath: 'inset(0 52% 0 0)', zIndex: 30 }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full relative z-10">
            {banners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <span className="font-mono text-sm md:text-lg uppercase tracking-[0.15em] font-bold text-white mb-3 text-center">
                  {partner.label}
                </span>
                <div className="w-full h-[152px] md:h-[152px] bg-white rounded-lg border-2 border-red-500 px-6 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`${partner.size} w-auto object-contain`}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerBanners;