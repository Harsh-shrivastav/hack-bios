"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

export const HackerText = ({ text, className = "", as: Component = "span" }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }
    
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        prev.split("").map((letter, index) => {
          if (index < iterations) {
            return text[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <Component 
      // No CSS transition here: StaggeredMenu animates this element's
      // transform with GSAP, and a `transition-all` restarts a 300ms tween on
      // every GSAP frame — the label lags far behind, then snaps (the
      // menu-open shake). Only the text changes on hover, which can't transition.
      className={cn("whitespace-nowrap", className)}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </Component>
  );
};
