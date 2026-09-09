import React from 'react';

const banners = [
  {
    name: 'MLH',
    label: 'Event Partner',
    logo: '/partners/mlh.png',
    href: 'https://mlh.io/',
    color: '#00ff41',
  },
  {
    name: 'Devfolio',
    label: 'Platform Partner',
    logo: '/partners/devfolio.webp',
    href: 'https://devfolio.co/',
    color: '#00e5ff',
  },
];

const PartnerBanners = () => {
  return (
    <section className="py-16 relative bg-[#020502] overflow-hidden border-t border-[#00ff41]/10">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center gap-6">
        {banners.map((partner) => (
          <a
            key={partner.name}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full max-w-3xl rounded-2xl p-[1px] overflow-hidden transition-all duration-500 hover:scale-[1.02]"
          >
            <div
              className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(to right, ${partner.color}99, rgba(255,255,255,0.08), transparent)` }}
            ></div>

            <div className="relative flex items-center justify-between gap-6 bg-[#050a05]/90 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/5">
              <div className="flex items-center gap-6">
                <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" />
                <span className="hidden sm:block h-8 w-px bg-white/10"></span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">{partner.label}</span>
              </div>
              <span
                className="font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: partner.color }}
              >
                Visit &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PartnerBanners;