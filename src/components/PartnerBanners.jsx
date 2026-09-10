import React from 'react';

const banners = [
  {
    name: 'MLH',
    label: 'Event Partner',
    logo: '/partners/mlh.png',
    href: 'https://mlh.io/',
    color: '#00ff41',
    whiteBadge: false,
  },
  {
    name: 'Devfolio',
    label: 'Platform Partner',
    logo: '/partners/devfolio.webp',
    href: 'https://hackbios2k26.devfolio.co/overview',
    color: '#00e5ff',
    whiteBadge: true,
  },
];

const PartnerBanners = () => {
  return (
    <section className="py-16 relative bg-[#020502] overflow-visible border-t border-[#00ff41]/10">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="relative flex flex-col items-center gap-6 max-w-3xl mx-auto">

          {/* Argit — mobile: simple, stacked above the cards, no overlap needed since there's no side room */}
          <div className="md:hidden relative mb-2 pointer-events-none select-none">
            <p className="font-mono text-[#00ff41] text-xs italic tracking-wide mb-1 ml-2 drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]">
              mine... all mine...
            </p>
            <img
              src="/characters/sly.png"
              alt=""
              aria-hidden="true"
              className="w-32 sm:w-44 h-auto object-contain mx-auto drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
            />
          </div>

          {/* Argit — desktop: grabbing the MLH card. Same image rendered twice, clipped in half:
              body layer sits BEHIND the card (negative z-index), arm/claw layer sits ABOVE it (z-30).
              Both layers share this absolutely-positioned wrapper so cards never shift/resize. */}
          <div className="hidden md:block absolute md:-left-[18rem] lg:-left-[26rem] xl:-left-[30rem] md:top-[-12rem] lg:top-[-12rem] xl:top-[-12rem] pointer-events-none select-none w-72 lg:w-[34rem] xl:w-[40rem]">
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

            <p
              className="absolute -top-4 left-4 font-mono text-[#00ff41] text-xs italic tracking-wide drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]"
              style={{ zIndex: 30 }}
            >
              mine... all mine...
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
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
                <div className="w-full bg-white rounded-lg border-2 border-red-500 px-6 py-8 md:py-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-transform duration-300 group-hover:scale-105">
                  <img src={partner.logo} alt={partner.name} className="h-10 md:h-14 w-auto object-contain" />
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