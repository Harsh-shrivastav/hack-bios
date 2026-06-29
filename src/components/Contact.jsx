import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative bg-[#050a05] border-t border-[#00ff41]/20">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03]"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 glitch uppercase" data-text="/ CONTACT">
            <span className="text-[#00ff41]">/</span> CONTACT
          </h2>
          <p className="text-gray-400 font-sans">Reach out for any inquiries.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#0a120a] p-8 border border-[#00e5ff]/30 box-shadow-neon relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-[#00e5ff]/30 bg-[#00e5ff]/5"></div>
              <h3 className="text-2xl font-mono text-white mb-6 uppercase tracking-wider text-[#00e5ff]">Organizers</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00e5ff]/10 flex items-center justify-center border border-[#00e5ff]/50">
                    <Phone className="text-[#00e5ff]" size={18} />
                  </div>
                  <div>
                    <p className="font-mono text-white">Harsh Shrivastava</p>
                    <p className="font-mono text-[#00e5ff] text-sm">+91 88178 70843</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00e5ff]/10 flex items-center justify-center border border-[#00e5ff]/50">
                    <Phone className="text-[#00e5ff]" size={18} />
                  </div>
                  <div>
                    <p className="font-mono text-white">Priyanshu Yadav</p>
                    <p className="font-mono text-[#00e5ff] text-sm">+91 62616 73875</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00e5ff]/10 flex items-center justify-center border border-[#00e5ff]/50">
                    <Phone className="text-[#00e5ff]" size={18} />
                  </div>
                  <div>
                    <p className="font-mono text-white">Yuvraj Singh Sahu</p>
                    <p className="font-mono text-[#00e5ff] text-sm">+91 78048 48124</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a120a] p-8 border border-[#00ff41]/30 box-shadow-neon">
              <h3 className="text-2xl font-mono text-white mb-6 uppercase tracking-wider text-[#00ff41]">Faculty Supervisors</h3>
              <p className="font-mono text-gray-300 text-sm leading-loose">
                Dr. Siddhartha Choubey <br/>
                Dr. Abha Choubey <br/>
                SSTC Hackathon Committee
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-[#020502] border border-[#00ff41]/30 p-2 relative h-[400px] lg:h-auto overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41] z-10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-[#00ff41]/5 transition-colors duration-500 z-10 flex items-center justify-center">
               {/* Map overlay targeted crosshair */}
               <div className="w-12 h-12 border border-[#00ff41] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 group-hover:scale-100">
                 <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                 <div className="absolute w-[200%] h-[1px] bg-[#00ff41]/50"></div>
                 <div className="absolute h-[200%] w-[1px] bg-[#00ff41]/50"></div>
               </div>
            </div>
            {/* Embedded Google Map Placeholder - using an iframe for SSTC Bhilai */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.3129188417757!2d81.29528931441857!3d21.21950488589694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a293d052a2ae555%3A0xc3af1179ab8de3ff!2sShri%20Shankaracharya%20Technical%20Campus!5e0!3m2!1sen!2sin!4v1689254000000!5m2!1sen!2sin" 
              className="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="SSTC Bhilai Map"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
