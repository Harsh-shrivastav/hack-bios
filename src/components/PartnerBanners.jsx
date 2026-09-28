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
    <section
      className="py-16 relative overflow-visible border-t border-[#00ff41]/10"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="relative flex flex-col items-center gap-6 max-w-3xl mx-auto">

          {/* Sly — mobile */}
          <div className="md:hidden relative z-20 flex justify-start w-full -mb-10 pointer-events-none select-none">
            <div className="relative ml-2">
              <img
                src="/characters/sly.webp"
                alt=""
                aria-hidden="true"
                className="w-44 sm:w-56 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
              />
            </div>
          </div>

          {/* Sly — desktop. Sits wholly outside the card box (16px gap) and
              is sized to the gutter beside it: fixed offsets can't work, since
              the box is a fixed 48rem while the gutter shrinks with the
              viewport — at 1280px a 36rem Sly either covers the MLH card or
              runs off-screen. 33px = 16px gap + up to 17px scrollbar, which
              100vw includes. Feet stay level with the card bottoms. */}
          <div
            className="hidden md:block absolute bottom-0 pointer-events-none select-none"
            style={{ right: 'calc(100% + 16px)', width: 'min(36rem, calc((100vw - 100%) / 2 - 33px))' }}
          >

            {/* Invisible sizer */}
            <img
              src="/characters/sly.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-contain opacity-0"
            />

            {/* Body */}
            <img
              src="/characters/sly.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,255,65,0.15)]"
              style={{
                clipPath: 'inset(0 38% 0 0)',
                zIndex: -1
              }}
            />

            {/* Arm / claw */}
            <img
              src="/characters/sly.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                clipPath: 'inset(0 0 0 52%)',
                zIndex: 30
              }}
            />
          </div>

          {/* Simian — mobile */}
          <div className="md:hidden relative z-20 flex justify-end w-full -mb-10 pointer-events-none select-none">
            <div className="relative mr-2">
              <img
                src="/characters/simian.webp"
                alt=""
                aria-hidden="true"
                className="w-44 sm:w-56 h-auto object-contain drop-shadow-[0_0_20px_rgba(0,150,255,0.15)]"
              />
            </div>
          </div>

          {/* Simian — desktop. Mirror of Sly; the 20% drop keeps its feet
              hanging just below the Devfolio card at any size. */}
          <div
            className="hidden md:block absolute bottom-0 translate-y-[20%] pointer-events-none select-none"
            style={{ left: 'calc(100% + 16px)', width: 'min(36rem, calc((100vw - 100%) / 2 - 33px))' }}
          >

            {/* Invisible sizer */}
            <img
              src="/characters/simian.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-contain opacity-0"
            />

            {/* Body */}
            <img
              src="/characters/simian.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,150,255,0.15)]"
              style={{
                clipPath: 'inset(0 0 0 48%)',
                zIndex: -1
              }}
            />

            {/* Arm / claw */}
            <img
              src="/characters/simian.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                clipPath: 'inset(0 52% 0 0)',
                zIndex: 30
              }}
            />
          </div>

          {/* Partner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full relative z-10">

            {banners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >

                <span
                  className="
                    font-mono
                    text-sm
                    md:text-lg
                    uppercase
                    tracking-[0.15em]
                    font-bold
                    text-white
                    mb-3
                    text-center
                  "
                >
                  {partner.label}
                </span>

                <div
                  className="
                    w-full
                    h-[152px]
                    md:h-[152px]
                    bg-white
                    rounded-lg
                    border-2
                    border-red-500
                    px-6
                    flex
                    items-center
                    justify-center
                    shadow-[0_0_20px_rgba(255,0,0,0.15)]
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
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