import React from 'react';
import { FileUp } from 'lucide-react';

// Round 1 PPT submission section.
// Swap SUBMISSION_LINK to the Google Form URL when it's ready.
const SUBMISSION_LINK = ''; // e.g. 'https://forms.gle/xxxxxxx'

const Submission = () => {
  const isLive = Boolean(SUBMISSION_LINK);

  return (
    <section
      id="submission"
      className="py-28 relative overflow-hidden"
    >
      {/* Subtle glass layer */}
      <div className="absolute inset-0 bg-[#050a05]/35 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Subtle circuit texture */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.015] pointer-events-none"></div>

      {/* Subtle green glow */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[600px]
          h-[600px]
          bg-[#00ff41]/[0.025]
          blur-[130px]
          rounded-full
          pointer-events-none
        "
      ></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Glass content panel */}
        <div
          className="
            max-w-3xl
            mx-auto
            text-center

            bg-[#050a05]/40
            backdrop-blur-md

            border
            border-[#00ff41]/10

            rounded-2xl

            px-6
            py-12
            md:px-12
            md:py-14

            shadow-[0_0_40px_rgba(0,0,0,0.15)]
          "
        >

          <p
            className="
              font-mono
              text-[#00ff41]
              text-xs
              tracking-[0.4em]
              uppercase
              mb-4
              opacity-80
            "
          >
            Round 01 // Checkpoint
          </p>

          <h2
            className="
              text-4xl
              md:text-6xl
              font-mono
              font-bold
              mb-6
              glitch
              uppercase
              tracking-tighter
            "
            data-text="/ PPT SUBMISSION"
          >
            <span className="text-[#00ff41]">/</span> PPT Submission
          </h2>

          <p
            className="
              text-gray-400
              font-mono
              text-sm
              md:text-base
              leading-relaxed
              mb-10
              opacity-80
            "
          >
            The submission form will be posted here as soon as it opens — keep this page bookmarked.
          </p>

          {isLive ? (
            <a
              href={SUBMISSION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="
                interactive
                inline-flex
                items-center
                gap-3

                px-10
                py-3.5

                border-2
                border-[#00ff41]

                text-[#00ff41]

                font-mono
                text-sm
                md:text-base

                uppercase
                tracking-[0.3em]

                hover:bg-[#00ff41]
                hover:text-[#050a05]

                transition-all
                duration-300

                hover:shadow-[0_0_25px_rgba(0,255,65,0.5)]
              "
            >
              <FileUp size={18} />
              Submit Your PPT
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="
                inline-flex
                items-center
                gap-3

                px-10
                py-3.5

                border-2
                border-[#00ff41]/30

                text-[#00ff41]/50

                font-mono
                text-sm
                md:text-base

                uppercase
                tracking-[0.3em]

                cursor-not-allowed
                select-none
              "
            >
              <FileUp size={18} />
              Submission Link — Coming Soon
            </span>
          )}

        </div>
      </div>
    </section>
  );
};

export default Submission;