import React from 'react';

// Round 1 PPT submission section — now in its post-close state.
// Submission window: 20–30 September. Update the copy below again once
// shortlisted teams are actually announced.
const Submission = () => {
  return (
    <section
      id="submission"
      className="py-32 md:py-44 relative overflow-hidden"
    >
      {/* Subtle glass layer */}
      <div className="absolute inset-0 bg-[#050a05]/35 md:backdrop-blur-[2px] pointer-events-none"></div>

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

          {/* Corner reticle frame — red now, staggered pulse like an
              active scan, but signaling "alert" instead of "live" */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-red-500/60 pointer-events-none animate-pulse"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-red-500/60 pointer-events-none animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-red-500/60 pointer-events-none animate-pulse" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-red-500/60 pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }}></div>

          {/* Terminal window — the frame itself slowly breathes (border +
              box-shadow only, no blur), now in red to signal the closed
              state at a glance instead of the usual green "live" look */}
          <div className="submission-frame-glow-closed relative bg-[#050a05]/60 md:backdrop-blur-md border-2 border-red-500/30 rounded-xl overflow-hidden">

            {/* Diagonal stamp — the loudest signal on the panel */}
            <span className="submission-closed-stamp">CLOSED</span>


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
                  &gt; transmission_received // reviewing_entries...
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
                Round 01 // Transmission Closed
              </p>

              {/* Heading */}
              <h2
                className="
                  glitch
                  text-5xl
                  md:text-7xl
                  font-mono
                  font-black
                  mb-3
                  uppercase
                  tracking-tighter
                  leading-none
                "
                data-text="/ PPT SUBMISSION"
              >
                <span className="text-[#00ff41]">/</span> PPT{' '}
                <span className="block md:inline">Submission</span>
              </h2>

              {/* Status tag — red/amber instead of green, so it reads as
                  a system state change rather than a section redesign */}
              <p className="font-mono text-red-400/90 text-xs md:text-sm tracking-[0.35em] uppercase mb-8">
                STATUS: CLOSED
              </p>

              {/* Description */}
              <p className="text-gray-400 font-mono text-sm md:text-base leading-relaxed opacity-80 max-w-xl mx-auto">
                The submission window has closed. All received presentations are now
                under review — the{' '}
                <span className="text-[#00ff41]">shortlist will be announced soon</span>.
                Didn't make it into Round 01? There's always the next hack.
                <span className="inline-block w-[0.55em] h-[1em] align-middle bg-[#00ff41]/70 ml-1 animate-pulse"></span>
              </p>

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