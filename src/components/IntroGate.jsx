import React, { useEffect, useRef, useState } from 'react';
import CodonStream from './CodonStream';
import OmniWatch from './OmniWatch/OmniWatch';

// Change this if the confirmed start time changes — this is the only
// place it needs updating.
const HACKATHON_START = new Date('2026-10-09T10:30:00+05:30'); // 9 Oct, 10:30 AM IST

function getCountdown() {
  const diff = HACKATHON_START.getTime() - Date.now();
  if (diff <= 0) return null; // event has started
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

const IntroGate = ({ onEnter, muted }) => {
  const [countdown, setCountdown] = useState(getCountdown());
  const [flashing, setFlashing] = useState(false);
  const flashRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleEnter = () => {
    if (flashing) return;
    setFlashing(true);
    if (!muted) {
      const sfx = new Audio('/audio/omnitrix-transform.mp3');
      sfx.volume = 0.7;
      sfx.play().catch(() => {}); // Enter is a real user click, so this should always be allowed to play
    }
    // Reveal the real site right as the flash reaches full-white coverage,
    // so it's already there underneath by the time the flash fades out.
    setTimeout(() => onEnter(), 320);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#010401]">
      {/* Same flowing space background as Hero, behind the watch */}
      <div className="absolute inset-0">
        <CodonStream />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[380px] md:max-w-[440px]">
          <OmniWatch muted={muted} />
        </div>

        {countdown ? (
          <div className="mt-6 md:mt-8 flex items-center gap-4 md:gap-6 font-mono">
            {[
              { v: countdown.days, l: 'DAYS' },
              { v: countdown.hours, l: 'HRS' },
              { v: countdown.minutes, l: 'MIN' },
              { v: countdown.seconds, l: 'SEC' }
            ].map((u) => (
              <div key={u.l} className="flex flex-col items-center">
                <span
                  className="text-2xl md:text-4xl font-bold text-[#00ff41] tabular-nums"
                  style={{ textShadow: '0 0 10px rgba(0,255,65,0.6)' }}
                >
                  {String(u.v).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 mt-1">{u.l}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 font-mono text-[#00ff41] text-lg tracking-widest">SYSTEM ONLINE // LIVE NOW</p>
        )}

        <button
          onClick={handleEnter}
          className="interactive mt-10 md:mt-12 px-10 py-3.5 border-2 border-[#00ff41] text-[#00ff41] font-mono text-sm md:text-base uppercase tracking-[0.3em] hover:bg-[#00ff41] hover:text-[#010401] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,65,0.5)]"
        >
          Enter
        </button>
      </div>

      {/* Transformation flash — white-hot core expanding from the watch's
          position (screen center), green afterglow trailing behind it */}
      {flashing && (
        <div
          ref={flashRef}
          className="fixed inset-0 z-[110] pointer-events-none omniwatch-flash"
        >
          <div className="omniwatch-flash-core"></div>
          <div className="omniwatch-flash-ring"></div>
        </div>
      )}
    </div>
  );
};

export default IntroGate;