import React from 'react';
import { Globe, Mail, MessageCircle, Terminal } from 'lucide-react';
import { LocationMap } from './ui/expand-map';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020502] border-t border-[#00ff41]/20 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.05]"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold font-mono text-white mb-4 glitch" data-text="HACKBIOS 3.0">
              <span className="text-[#00ff41]">HACKBIOS</span> 3.0
            </h2>
            <p className="text-gray-400 font-sans max-w-sm mb-6">
              Central India's premier hackathon. Join us to boot your ideas into reality. Organized by SSTC Bhilai.
            </p>
            
            <div className="mb-6">
              <LocationMap 
                location="SSTC Bhilai, CG" 
                coordinates="21.1938° N, 81.3509° E"
                className="scale-90 origin-left"
              />
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-[#00ff41] hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all interactive">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-[#00ff41] hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all interactive">
                <Mail size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-[#00ff41] hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all interactive">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-[#00ff41] hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all interactive">
                <Terminal size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-mono font-bold mb-6 text-lg tracking-wider">SYSTEM.LINKS</h3>
            <ul className="space-y-3 font-mono text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-[#00ff41] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00ff41]">&gt;</span> About</a></li>
              <li><a href="#tracks" className="text-gray-400 hover:text-[#00ff41] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00ff41]">&gt;</span> Tracks</a></li>
              <li><a href="#timeline" className="text-gray-400 hover:text-[#00ff41] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00ff41]">&gt;</span> Timeline</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-[#00ff41] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00ff41]">&gt;</span> FAQ</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-[#00ff41] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00ff41]">&gt;</span> Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-mono font-bold mb-6 text-lg tracking-wider">SYSTEM.LEGAL</h3>
            <ul className="space-y-3 font-mono text-sm">
              <li><a href="#" className="text-gray-400 hover:text-[#00e5ff] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00e5ff]">&gt;</span> Code of Conduct</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00e5ff] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00e5ff]">&gt;</span> Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00e5ff] transition-colors interactive inline-flex items-center gap-2"><span className="text-[#00e5ff]">&gt;</span> Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-gray-500">
            &copy; {currentYear} HackBIOS 3.0 @ SSTC. All rights reserved.
          </p>
          <div className="font-mono text-xs font-bold text-[#00ff41] animate-pulse">
            SYSTEM.STATUS: ONLINE
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
