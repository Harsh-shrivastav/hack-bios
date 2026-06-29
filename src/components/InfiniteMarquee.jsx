import React from 'react';

const InfiniteMarquee = ({ text }) => {
  return (
    <div className="absolute bottom-0 w-full overflow-hidden border-t border-b border-[#00ff41]/20 bg-[#050a05]/80 backdrop-blur-md py-4 z-30">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex shrink-0">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[#00ff41] font-mono font-bold text-xl md:text-2xl tracking-[0.2em] px-8">
              {text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[#00ff41] font-mono font-bold text-xl md:text-2xl tracking-[0.2em] px-8">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteMarquee;
