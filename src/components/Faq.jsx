import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Who can participate?", a: "Any student enrolled in a college or school. We have a dedicated prize pool for school students!" },
  { q: "How much does it cost?", a: "HackBIOS is completely free! We provide meals, workspace, and a ton of swag. You just need to bring your laptop and energy." },
  { q: "What is the team size?", a: "You can form a team of 2 to 4 members. Solo participations are allowed but a team is highly recommended." },
  { q: "Is it an online or offline hackathon?", a: "HackBIOS 3.0 is fundamentally an offline, in-person hackathon held at Shri Shankaracharya Technical Campus, Bhilai." },
  { q: "Will there be food?", a: "Yes, absolutely! We will provide regular meals, midnight snacks, and endless coffee to keep you running." },
  { q: "What if I don't know how to code?", a: "Hackathons are the best place to learn! We'll have mentors, workshops, and beginner-friendly resources. Design and presentation skills are equally important." },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#020502]">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 glitch uppercase" data-text="/ FAQ">
            <span className="text-[#00e5ff]">/</span> FAQ
          </h2>
          <p className="text-gray-400 font-sans">Common queries from the grid.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border transition-all duration-300 ${openIndex === index ? 'border-[#00ff41] bg-[#0a120a]' : 'border-[#00ff41]/20 bg-[#050a05] hover:border-[#00ff41]/50'}`}
            >
              <button 
                className="w-full text-left px-6 py-4 font-mono text-white flex justify-between items-center interactive focus:outline-none"
                onClick={() => toggle(index)}
              >
                <span className={`pr-4 ${openIndex === index ? 'text-[#00ff41]' : ''}`}>&gt; {faq.q}</span>
                <ChevronDown 
                  className={`transition-transform duration-300 ${openIndex === index ? 'transform rotate-180 text-[#00ff41]' : 'text-gray-500'}`} 
                  size={20} 
                />
              </button>
              
              <div 
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIndex === index ? '200px' : '0px' }}
              >
                <div className="px-6 pb-4 text-gray-400 font-sans text-sm md:text-base border-t border-[#00ff41]/10 mt-2 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
