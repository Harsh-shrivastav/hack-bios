import React from 'react';
import { FileUp, List } from 'lucide-react';

// Round 1 PPT submission section.
// Swap SUBMISSION_LINK to the Google Form URL when it's ready.
const SUBMISSION_LINK = 'https://forms.gle/NyehdduH8P8Ms6Me6';

const Submission = () => {
  return (
    <section
      id="submission"
      className="py-32 md:py-44 relative overflow-hidden"
    >
      {/* Subtle glass layer */}
      <div className="absolute inset-0 bg-[#050a05]/35 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Subtle circuit texture */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.015] pointer-events-none"></div>

      {/* Ambient aura behind the terminal — two overlapping radial
          gradients (green + cyan), breathing at offset timings, the same
          "glow without blur" technique used on the homepage. This carries
          most of the section's "wow" now instead of one glowing button. */}
      <div
        className="submission-aura absolute top-1/2 left-1/2 w-[750px] h-[750px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,65,0.09) 0%, rgba(0,255,65,0) 70%)' }}
      ></div>
      <div
        className="submission-aura absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, rgba(0,229,255,0) 70%)', animationDelay: '2.3s' }}
      ></div>

      {/* Radar sweep — a conic-gradient beam rotating slowly behind the
          terminal, like the panel is actively scanning. transform:rotate
          only, so this is compositor-cheap even running continuously. */}
      <div
        className="submission-radar absolute top-1/2 left-1/2 w-[820px] h-[820px] rounded-full pointer-events-none"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,255,65,0.12) 25deg, transparent 55deg)' }}
      ></div>

      {/* Drifting particle motes */}
      {[
        { top: '15%', left: '12%', size: 3, delay: '0s', duration: '6s' },
        { top: '70%', left: '8%', size: 2, delay: '1.2s', duration: '7s' },
        { top: '25%', left: '90%', size: 2, delay: '0.6s', duration: '5.5s' },
        { top: '80%', left: '92%', size: 3, delay: '2s', duration: '6.5s' },
        { top: '50%', left: '5%', size: 2, delay: '2.8s', duration: '8s' },
        { top: '40%', left: '95%', size: 2, delay: '1.6s', duration: '7.5s' },
      ].map((p, i) => (
        <span
          key={i}
          className="submission-particle absolute rounded-full bg-[#00ff41] pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            boxShadow: '0 0 6px rgba(0,255,65,0.8)',
          }}
        ></span>
      ))}

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto relative">

          {/* Corner reticle frame — staggered pulse, like an active scan */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#00ff41]/50 pointer-events-none animate-pulse"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#00ff41]/50 pointer-events-none animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#00ff41]/50 pointer-events-none animate-pulse" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#00ff41]/50 pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }}></div>

          {/* Terminal window — the frame itself slowly breathes (border +
              box-shadow only, no blur), so the whole panel feels alive */}
          <div className="submission-frame-glow relative bg-[#050a05]/60 backdrop-blur-md border-2 border-[#00ff41]/20 rounded-xl overflow-hidden">


            {/* Title bar */}
            <div className="relative flex items-center gap-2 px-4 md:px-6 py-3 border-b border-[#00ff41]/10 bg-[#00ff41]/[0.03]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41]/70"></span>

              <span className="ml-3 font-mono text-[10px] md:text-xs text-gray-500 tracking-widest uppercase truncate">
                root@hackbios:~/round-01-checkpoint
              </span>

              {/* Scan sweep — a thin light bar sliding along the title
                  bar's bottom edge, like a system boot/handshake pulse.
                  Anchored to the title bar itself (not a guessed pixel
                  offset) so it always sits exactly on that border line. */}
              <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent submission-scan pointer-events-none"></div>
            </div>

            {/* Body */}
            <div className="relative text-center px-6 py-16 md:px-16 md:py-24">

              {/* Fake boot-log line, typed on a loop */}
              <p className="font-mono text-[#00ff41]/70 text-[11px] md:text-xs tracking-wider mb-6 h-4">
                <span className="submission-typewriter">
                  &gt; awaiting_transmission...
                </span>
              </p>

              {/* Section label */}
              <p
                className="
                  font-mono
                  text-[#00ff41]
                  text-xs
                  md:text-sm
                  tracking-[0.4em]
                  uppercase
                  mb-5
                  opacity-80
                "
              >
                Round 01 // Checkpoint
              </p>

              {/* Heading */}
              <h2
                className="
                  glitch
                  text-5xl
                  md:text-7xl
                  font-mono
                  font-black
                  mb-8
                  uppercase
                  tracking-tighter
                  leading-none
                "
                data-text="/ PPT SUBMISSION"
              >
                <span className="text-[#00ff41]">/</span> PPT{' '}
                <span className="block md:inline">Submission</span>
              </h2>

              {/* Description */}
              <p className="text-gray-400 font-mono text-sm md:text-base leading-relaxed mb-12 opacity-80 max-w-xl mx-auto">
                The submission window is open from{' '}
                <span className="text-[#00ff41]">20–25 September</span>.
                Only Team Leaders can submit the presentation on behalf of their team.
                Please ensure your presentation is in{' '}
                <span className="text-[#00ff41]">PDF format</span> and clearly includes
                your Team Name and Problem Statement. Verify all details before submitting.
                <span className="inline-block w-[0.55em] h-[1em] align-middle bg-[#00ff41]/70 ml-1 animate-pulse"></span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">

                {/* Submit PPT */}
                <a
                  href={SUBMISSION_LINK || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    interactive
                    group
                    relative
                    overflow-hidden
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    px-10
                    py-5
                    min-w-[230px]
                    border
                    border-[#00ff41]/50
                    bg-[#00ff41]/[0.015]
                    text-[#00ff41]/90
                    font-mono
                    text-base
                    md:text-lg
                    uppercase
                    tracking-[0.22em]
                    transition-all
                    duration-300
                    hover:border-[#00ff41]
                    hover:bg-[#00ff41]/[0.08]
                    hover:text-[#00ff41]
                    hover:shadow-[0_0_25px_rgba(0,255,65,0.18)]
                  "
                >
                  {/* Hover sweep */}
                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-[#00ff41]/10
                      to-transparent
                      group-hover:translate-x-full
                      transition-transform
                      duration-700
                      pointer-events-none
                    "
                  ></span>

                  <FileUp
                    size={22}
                    className="
                      relative
                      transition-transform
                      duration-300
                      group-hover:-translate-y-1
                    "
                  />

                  <span className="relative">
                    Submit Your PPT
                  </span>
                </a>

                {/* Guidelines — opens /guidelines.pdf in a new tab. That
                    file needs to live in your project's public/ folder
                    (same pattern as everything under /team, /sponsors,
                    etc.) — see the file handed back alongside this one. */}
                <a
                  href="/guidelines.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    interactive
                    group
                    relative
                    overflow-hidden
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    px-10
                    py-5
                    min-w-[230px]
                    border
                    border-[#00ff41]/50
                    bg-[#00ff41]/[0.015]
                    text-[#00ff41]/90
                    font-mono
                    text-base
                    md:text-lg
                    uppercase
                    tracking-[0.22em]
                    transition-all
                    duration-300
                    hover:border-[#00ff41]
                    hover:bg-[#00ff41]/[0.08]
                    hover:text-[#00ff41]
                    hover:shadow-[0_0_25px_rgba(0,255,65,0.18)]
                  "
                >
                  {/* Hover sweep */}
                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-[#00ff41]/10
                      to-transparent
                      group-hover:translate-x-full
                      transition-transform
                      duration-700
                      pointer-events-none
                    "
                  ></span>

                  <List
                    size={22}
                    className="
                      relative
                      transition-transform
                      duration-300
                      group-hover:rotate-90
                    "
                  />

                  <span className="relative">
                    Guidelines
                  </span>

                  {/* Terminal indicator */}
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-[#00ff41]/60
                      group-hover:bg-[#00ff41]
                      group-hover:shadow-[0_0_8px_#00ff41]
                      transition-all
                    "
                  ></span>
                </a>

              </div>


            </div>

            {/* Scanline texture */}
            <div className="scanline opacity-15 pointer-events-none z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Submission;