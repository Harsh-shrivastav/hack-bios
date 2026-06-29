import React, { useState, useEffect } from 'react';
import LetterGlitch from './LetterGlitch';

const BootAnimation = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isSequenceDone, setIsSequenceDone] = useState(false);

  const bootSequence = [
    "BIOS Date 04/17/26 17:42:39 Ver 3.0.1",
    "CPU: Quantum Processing Unit @ 4.2GHz",
    "Speed: 4.20 GHz",
    "Memory Test: 6400000K OK",
    "Loading kernel...",
    "Mounting file systems...",
    "Starting neural networks...",
    "Securing connection...",
    "> INITIALIZING HACKBIOS 3.0...",
    "> SYSTEM READY. WAITING FOR USER INPUT..."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsSequenceDone(true);
      }
    }, 150); // Speed of text coming in

    return () => clearInterval(interval);
  }, []);

  const handleOverrideClick = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500); // Wait for fade out
  };

  if (!isVisible && lines.length === bootSequence.length + 1) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 bg-black ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* LetterGlitch Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <LetterGlitch 
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          glitchColors={['#00ff41', '#00e5ff', '#050a05']}
        />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-6 bg-transparent">
        
        {/* Terminal Boot Text Box centered and glowing */}
        <div className="max-w-3xl w-full text-[#00ff41] font-mono mb-12 p-8 border border-[#00ff41]/30 bg-[#050a05]/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,65,0.2)]">
          {lines.map((line, index) => (
            <div key={index} className="mb-1 text-sm md:text-base">
              {line}
            </div>
          ))}
          {isVisible && !isSequenceDone && (
            <div className="w-3 h-5 bg-[#00ff41] animate-pulse mt-2 inline-block"></div>
          )}
        </div>

        {/* Enter Mainframe Button */}
        <div className={`transition-all duration-700 ${isSequenceDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button 
            onClick={handleOverrideClick}
            className="px-12 py-4 bg-transparent border-2 border-[#00ff41] text-[#00ff41] font-mono text-xl uppercase tracking-[0.2em] hover:bg-[#00ff41] hover:text-[#050a05] transition-all duration-300 box-shadow-neon interactive hover:-translate-y-1"
          >
            ENTER THE MAINFRAME
          </button>
        </div>

      </div>
    </div>
  );
};

export default BootAnimation;
