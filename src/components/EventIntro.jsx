import React from 'react';
import { LocationTag } from './ui/location-tag';
import AnimatedTextCycle from './ui/animated-text-cycle';

const DEVFOLIO_LINK = 'https://hackbios2k26.devfolio.co/';

const EventIntro = () => {
  return (
    <section className="relative w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-transparent">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(1,4,1,0.7) 0%, rgba(1,4,1,0.4) 45%, transparent 80%)'
        }}
      ></div>
      <div className="relative max-w-3xl">
        <div className="mb-8">
          <LocationTag city="Bhilai" country="IND" timezone="IST" />
        </div>

        <p className="font-mono text-[#00e5ff] text-sm md:text-lg tracking-[0.3em] mb-4 uppercase text-shadow-neon">
          Shri Shankaracharya Technical Campus
        </p>

        <p className="font-sans text-2xl md:text-4xl text-gray-200 leading-relaxed mb-12">
          Where ideas boot into{' '}
          <AnimatedTextCycle
            words={["reality", "innovation", "code", "the future", "execution"]}
            interval={2500}
            className="text-[#00ff41] font-mono tracking-wide drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]"
          />
          . Build, innovate, and conquer at Central India's premier hackathon.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <a
            href={DEVFOLIO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive hover:-translate-y-1 transition-transform duration-300"
          >
            <img src="/devfolio-apply-button.png" alt="Apply with Devfolio" className="h-[52px] w-auto" />
          </a>

          <a
            href="https://discord.gg/kDpNBsU3qt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-w-[280px] px-8 py-4 bg-transparent border-2 border-[#00e5ff] text-[#00e5ff] font-mono text-lg uppercase tracking-widest hover:bg-[#00e5ff] hover:text-[#050a05] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] interactive hover:-translate-y-1 whitespace-nowrap"
          >
            Join Discord
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventIntro;