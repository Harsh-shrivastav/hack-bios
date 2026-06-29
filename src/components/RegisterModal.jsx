import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Dynamically load the Devfolio SDK script
    const script = document.createElement('script');
    script.src = 'https://apply.devfolio.co/v2/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050a05]/95 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-[#0a120a] border border-[#00ff41]/50 w-full max-w-md p-8 shadow-[0_0_30px_rgba(0,255,65,0.15)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent"></div>
        <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
        <div className="scanline"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#00ff41] transition-colors interactive"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-mono font-bold text-white mb-2 glitch" data-text="INITIATE_UPLINK">INITIATE_UPLINK</h2>
        <p className="text-[#00e5ff] font-mono text-sm mb-8">&gt; Register for HackBIOS 3.0</p>

        <div className="flex flex-col items-center justify-center py-8 relative z-10">
          <div 
            className="apply-button" 
            data-hackathon-slug="hackbios3" 
            data-button-theme="dark"
            style={{ height: '44px', width: '312px' }}
          >
            {/* Fallback button that renders before SDK loads/verifies */}
            <a
              href="https://devfolio.co"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center bg-[#3770FF] hover:bg-[#2b5cd4] text-white font-sans font-semibold text-[15px] rounded-[4px] w-full h-full transition-colors shadow-lg cursor-pointer"
              style={{ textDecoration: 'none' }}
            >
              <svg className="w-5 h-5 mr-2.5 fill-white" viewBox="0 0 24 24">
                <path d="M3.98 3H12c5.52 0 10 4.48 10 10s-4.48 10-10 10H3.98V3zm8.02 16.5c3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5H7.48v13H12z"/>
              </svg>
              Apply with Devfolio
            </a>
          </div>
          <p className="text-gray-400 font-mono text-xs mt-6 text-center leading-relaxed max-w-xs">
            Apply directly using your Devfolio account.
            <br />
            <span className="text-gray-500 block mt-2 text-[10px]">
              * Note: The button is only visible when the hackathon is verified on Devfolio. Make sure to replace <code className="text-[#00ff41]">"hackbios3"</code> with your actual Devfolio hackathon slug in <code className="text-[#00ff41]">RegisterModal.jsx</code>.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
