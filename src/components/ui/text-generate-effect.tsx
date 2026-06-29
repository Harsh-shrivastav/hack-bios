"use client";
import React, { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-10%" });
  let wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          filter: "blur(0px)",
        },
        {
          duration: 0.5,
          delay: stagger(0.1),
        }
      );
    }
  }, [scope, animate, isInView]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-inherit opacity-0 inline-block mr-1.5 md:mr-2"
              style={{ filter: "blur(4px)" }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
};
