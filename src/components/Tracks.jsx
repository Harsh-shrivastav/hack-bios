import React, { useEffect } from 'react';
import {
  HeartPulse,
  Blocks,
  Code2,
  ShieldCheck,
  BrainCircuit,
  Landmark,
  GraduationCap,
  Lightbulb
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const trackData = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: HeartPulse,
    desc: 'Develop solutions to revolutionize patient care, diagnostics, and medical accessibility using modern tech.'
  },
  {
    id: 'web3',
    title: 'Web3 / Blockchain',
    icon: Blocks,
    desc: 'Build decentralized apps, smart contracts, and blockchain-powered tools for a trustless future.'
  },
  {
    id: 'webdev',
    title: 'Web Development',
    icon: Code2,
    desc: 'Craft fast, functional, and beautifully designed web experiences that solve real problems.'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: ShieldCheck,
    desc: 'Defend systems and data — build tools for threat detection, secure infrastructure, and digital safety.'
  },
  {
    id: 'aiml',
    title: 'AI / ML',
    icon: BrainCircuit,
    desc: 'Train models, build intelligent systems, and push the boundaries of what machines can learn and do.'
  },
  {
    id: 'fintech',
    title: 'FinTech',
    icon: Landmark,
    desc: 'Reimagine payments, banking, and financial access with tech-first solutions for a digital economy.'
  },
  {
    id: 'edtech',
    title: 'EdTech',
    icon: GraduationCap,
    desc: 'Build tools that make learning more accessible, engaging, and effective for students everywhere.'
  },
  {
    id: 'open',
    title: 'Open Innovation',
    icon: Lightbulb,
    desc: 'Got a wild idea that doesn\'t fit? This track is for bold, unbounded concepts that defy categorization.'
  }
];

const Tracks = () => {
  useEffect(() => {
    // Refresh ScrollTrigger after ScrollStack has rendered
    const refresh = () => {
      ScrollTrigger.refresh(true);
    };

    const timer1 = setTimeout(refresh, 500);
    const timer2 = setTimeout(refresh, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section
      id="tracks"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14 md:mb-24">
          <h2
            className="
              text-3xl
              sm:text-4xl
              md:text-6xl
              font-mono
              font-bold
              mb-4
              md:mb-6
              glitch
              uppercase
              tracking-tight
              md:tracking-tighter
            "
            data-text="/ TRACKS"
          >
            <span className="text-[#00ff41]">/</span> TRACKS
          </h2>

          <p
            className="
              text-gray-400
              font-mono
              text-[9px]
              sm:text-xs
              tracking-[0.25em]
              sm:tracking-[0.4em]
              uppercase
              opacity-60
            "
          >
            SELECT_ZONE_FOR_INFILTRATION
          </p>
        </div>

        {/* Track Cards */}
        <div className="w-full max-w-4xl mx-auto mt-0 md:-mt-10">

          <ScrollStack
            useWindowScroll={true}
            itemDistance={40}
            itemScale={0.03}
            itemStackDistance={30}
            stackPosition="20%"
            scaleEndPosition="10%"
            baseScale={0.88}
            rotationAmount={0}
            blurAmount={1.5}
            className="w-full"
          >
            {trackData.map((track) => {
              const Icon = track.icon;

              return (
                <ScrollStackItem
                  key={track.id}
                  itemClassName="w-full relative z-20"
                >
                  <div
                    className="
                      cinematic-card
                      bg-[#050a05]
                      border
                      border-[#00ff41]/30

                      p-6
                      sm:p-8
                      md:p-10

                      flex
                      flex-col
                      sm:flex-row

                      items-center
                      sm:items-start

                      text-center
                      sm:text-left

                      group
                      interactive
                      relative

                      shadow-2xl

                      min-h-[280px]
                      sm:min-h-[240px]

                      h-auto
                      w-full
                      mx-auto
                    "
                  >

                    {/* Icon */}
                    <div
                      className="
                        w-16
                        h-16
                        sm:w-20
                        sm:h-20
                        md:w-24
                        md:h-24

                        rounded-full

                        bg-[#00ff41]/5

                        flex
                        items-center
                        justify-center

                        sm:mr-6
                        md:mr-8

                        mb-5
                        sm:mb-0

                        border
                        border-[#00ff41]/20

                        group-hover:scale-110
                        transition-all
                        duration-500

                        group-hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]

                        group-hover:bg-[#00ff41]/10

                        flex-shrink-0
                      "
                    >
                      <Icon
                        className="text-[#00ff41]"
                        size={30}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Content */}
                    <div className="w-full sm:flex-1 min-w-0">

                      <h3
                        className="
                          text-xl
                          sm:text-2xl
                          md:text-3xl

                          font-mono
                          text-white

                          mb-3
                          md:mb-4

                          group-hover:text-[#00ff41]
                          transition-colors

                          uppercase

                          tracking-wide
                          md:tracking-wider

                          break-words
                        "
                      >
                        {track.title}
                      </h3>

                      <p
                        className="
                          text-sm
                          sm:text-base

                          text-gray-400

                          font-sans

                          leading-relaxed

                          opacity-80

                          group-hover:opacity-100

                          transition-opacity

                          max-w-lg

                          mx-auto
                          sm:mx-0
                        "
                      >
                        {track.desc}
                      </p>

                    </div>

                    {/* Corner Details */}
                    <div
                      className="
                        absolute
                        top-3
                        left-3
                        md:top-4
                        md:left-4
                        w-3
                        h-3
                        md:w-4
                        md:h-4
                        border-t
                        border-l
                        border-[#00ff41]/30
                      "
                    ></div>

                    <div
                      className="
                        absolute
                        top-3
                        right-3
                        md:top-4
                        md:right-4
                        w-3
                        h-3
                        md:w-4
                        md:h-4
                        border-t
                        border-r
                        border-[#00ff41]/30
                      "
                    ></div>

                    <div
                      className="
                        absolute
                        bottom-3
                        left-3
                        md:bottom-4
                        md:left-4
                        w-3
                        h-3
                        md:w-4
                        md:h-4
                        border-b
                        border-l
                        border-[#00ff41]/30
                      "
                    ></div>

                    <div
                      className="
                        absolute
                        bottom-3
                        right-3
                        md:bottom-4
                        md:right-4
                        w-3
                        h-3
                        md:w-4
                        md:h-4
                        border-b
                        border-r
                        border-[#00ff41]/30
                      "
                    ></div>

                  </div>
                </ScrollStackItem>
              );
            })}
          </ScrollStack>

        </div>
      </div>
    </section>
  );
};

export default Tracks;