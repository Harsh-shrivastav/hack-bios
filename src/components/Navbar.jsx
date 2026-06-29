import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Tracks', href: '#tracks' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[#050a05]/80 backdrop-blur-md border-b border-[#00ff41]/20 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 z-50">
          <span className="text-xl md:text-2xl font-bold font-mono text-white glitch interactive" data-text="HACKBIOS">HACKBIOS</span>
          <span className="text-[#00ff41] font-mono font-bold">3.0</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 font-mono text-sm tracking-wider">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-gray-300 hover:text-[#00ff41] transition-colors interactive">
                  <span className="text-[#00e5ff] mr-1 opacity-70">/</span>{link.name}
                </a>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={onRegisterClick}
            className="px-6 py-2 border border-[#00ff41] text-[#00ff41] font-mono text-sm uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#050a05] transition-all duration-300 box-shadow-neon interactive"
          >
            Register
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[#00ff41] z-50 interactive"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050a05] flex flex-col justify-center items-center z-40 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="absolute inset-0 bg-circuit-pattern opacity-5 pointer-events-none"></div>
        <ul className="flex flex-col gap-8 font-mono text-2xl text-center relative z-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="text-gray-300 hover:text-[#00ff41] transition-colors interactive"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => {
            onRegisterClick();
            setMobileMenuOpen(false);
          }}
          className="mt-12 px-8 py-3 border border-[#00ff41] text-[#00ff41] font-mono uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#050a05] transition-all duration-300 neon-border interactive"
        >
          Register Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
