import React, { useEffect, useRef, useState } from 'react';

const StatBox = ({ target, label, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    let observer;
    let frame;

    const animateCount = () => {
      let current = 0;
      const duration = 2000;
      const stepTime = Math.max(duration / target, 10);
      const inc = Math.max(Math.ceil(target / (duration / stepTime)), 1);

      const step = () => {
        current += inc;
        if (current >= target) {
          setCount(target);
        } else {
          setCount(current);
          frame = requestAnimationFrame(step);
        }
      };
      
      frame = requestAnimationFrame(step);
    };

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCount();
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div ref={boxRef} className="flex flex-col items-center justify-center p-6 border-r border-[#00ff41]/20 last:border-r-0 min-w-[200px]">
      <h3 className="text-4xl md:text-5xl font-mono font-bold text-[#00ff41] mb-2" style={{ textShadow: "0 0 10px rgba(0,255,65,0.5)" }}>
        {prefix}{count}{suffix}
      </h3>
      <p className="font-sans text-gray-400 uppercase tracking-widest text-sm">{label}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="relative pt-24 pb-12 w-full overflow-visible">
      <div className="mx-auto container px-4">
        <div className="relative bg-[#050a05]/85 backdrop-blur-xl border border-[#00ff41]/15 rounded-xl overflow-visible">
          <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02] pointer-events-none rounded-xl overflow-hidden"></div>

          {/* Driba — sitting on the left edge, legs resting on the bar */}
          <img
            src="/characters/driba.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -top-20 md:-top-24 left-4 md:left-10 w-24 md:w-32 h-auto object-contain z-10 pointer-events-none select-none drop-shadow-[0_0_15px_rgba(0,255,65,0.15)]"
          />

          {/* Blubik — sitting on the right edge, legs resting on the bar */}
          <img
            src="/characters/blubik.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -top-20 md:-top-24 right-4 md:right-10 w-24 md:w-32 h-auto object-contain z-10 pointer-events-none select-none drop-shadow-[0_0_15px_rgba(0,255,65,0.15)]"
          />

          <div className="relative flex flex-wrap md:flex-nowrap justify-center md:justify-around items-center gap-8 md:gap-0">
            <StatBox target={300} suffix="+" label="Attendees" />
            <StatBox target={70} suffix="+" label="Teams" />
            <StatBox target={1} prefix="₹" suffix="L+" label="Prizes" />
            <StatBox target={3} label="Editions" />
            <StatBox target={24} label="Hours" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;