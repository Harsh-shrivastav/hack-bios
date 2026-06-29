import React from "react";
import { GooeyText } from "./ui/gooey-text-morphing";

const GooeyBanner = () => {
  return (
    <section className="relative py-24 bg-[#050a05] overflow-hidden border-t border-b border-[#00ff41]/10 flex items-center justify-center">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Background glow for the gooey text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#00ff41]/5 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"></div>

      <div className="container mx-auto px-4 relative z-10 w-full flex items-center justify-center min-h-[300px]">
        <GooeyText
          texts={[
            "BUILD.",
            "INNOVATE.",
            "HACK.",
            "CREATE.",
            "DEVELOP.",
            "CONQUER."
          ]}
          morphTime={1.2}
          cooldownTime={0.8}
          className="font-black font-mono w-full"
          textClassName="text-[#00ff41] tracking-tighter drop-shadow-[0_0_20px_rgba(0,255,65,0.4)]"
        />
      </div>
    </section>
  );
};

export default GooeyBanner;
