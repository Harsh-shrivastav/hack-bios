import React, { useEffect } from 'react';
import { HeartPulse, Cpu, Settings, Lightbulb } from 'lucide-react';
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
    id: 'robotics',
    title: 'Robotics',
    icon: Cpu,
    desc: 'Build autonomous systems, smart machines, and physical prototypes to solve real-world problems.'
  },
  {
    id: 'automation',
    title: 'Automation',
    icon: Settings,
    desc: 'Streamline processes, optimize workflows, and build tools that eliminate repetitive tasks through software.'
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
    // Force GSAP to recalculate pin heights after this component renders
    // because ScrollStack significantly alerts document scroll height.
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 1500);
  }, []);

  return (
    <section id="tracks" className="py-32 relative bg-[#020502] overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>
      
      {/* Background glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff41]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-6 glitch uppercase tracking-tighter" data-text="/ SECTORS">
            <span className="text-[#00ff41]">/</span> SECTORS
          </h2>
          <p className="text-gray-400 font-mono text-xs tracking-[0.4em] uppercase opacity-60">SELECT_ZONE_FOR_INFILTRATION</p>
        </div>

        <div className="w-full max-w-4xl mx-auto -mt-10">
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
                <ScrollStackItem key={track.id} itemClassName="w-full relative z-20">
                  <div 
                    className="cinematic-card bg-[#050a05] border border-[#00ff41]/30 p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left group interactive relative shadow-2xl h-full w-full mx-auto"
                  >
                    <div className="w-24 h-24 rounded-full bg-[#00ff41]/5 flex items-center justify-center sm:mr-8 mb-6 sm:mb-0 border border-[#00ff41]/20 group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] group-hover:bg-[#00ff41]/10 flex-shrink-0">
                      <Icon className="text-[#00ff41]" size={42} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-3xl font-mono text-white mb-4 group-hover:text-[#00ff41] transition-colors uppercase tracking-wider">{track.title}</h3>
                      <p className="text-base text-gray-400 font-sans leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity max-w-lg">{track.desc}</p>
                    </div>
                    
                    {/* Corner details */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#00ff41]/30"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#00ff41]/30"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#00ff41]/30"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#00ff41]/30"></div>
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
