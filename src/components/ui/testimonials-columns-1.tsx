import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const TestimonialsColumn = (props) => {
  return (
    <div className={cn("overflow-hidden", props.className)}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 rounded-3xl border border-[#00ff41]/20 shadow-lg shadow-[#00ff41]/5 max-w-xs w-full bg-[#0a0f0a] text-gray-300 relative overflow-hidden group" key={i}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,65,0.05),_transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 leading-relaxed text-sm">{text}</div>
                  <div className="flex items-center gap-3 mt-6 relative z-10">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full border border-[#00ff41]/40"
                    />
                    <div className="flex flex-col">
                      <div className="font-mono text-white text-sm tracking-tight leading-5">{name}</div>
                      <div className="text-xs leading-5 text-[#00ff41]/70 tracking-tight font-mono">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
