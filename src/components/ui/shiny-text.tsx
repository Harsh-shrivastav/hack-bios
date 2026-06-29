"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const ShinyText = ({ text, className = "", children }) => {
  const STYLES = `
    @keyframes background-shine {
      from { background-position: 200% center; }
      to { background-position: -200% center; }
    }
  `;

  return (
    <>
      <style>{STYLES}</style>
      <span
        className={cn(
          "inline-block font-medium bg-[linear-gradient(110deg,var(--tw-gradient-from),45%,var(--tw-gradient-via),55%,var(--tw-gradient-to))] bg-[length:250%_100%] bg-clip-text text-transparent",
          className
        )}
        style={{
          animation: "background-shine 3s linear infinite",
          "--tw-gradient-from": "rgba(255,255,255,0.4)",
          "--tw-gradient-via": "rgba(255,255,255,1)",
          "--tw-gradient-to": "rgba(255,255,255,0.4)",
        }}
      >
        {text || children}
      </span>
    </>
  );
};
