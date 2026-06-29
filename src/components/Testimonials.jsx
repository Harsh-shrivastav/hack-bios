import React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn } from "./ui/testimonials-columns-1";

const testimonials = [
  {
    text: "HackBIOS completely pushed my limits. The environment was electric, and building our blockchain prototype alongside expert mentors was an experience of a lifetime.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Priya Sharma",
    role: "HackBIOS 2.0 Winner"
  },
  {
    text: "The energy here is unmatched! From the midnight snacks to the 4 AM debugging sessions, every second I spent here helped me grow as a developer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Arjun Patel",
    role: "Frontend Developer"
  },
  {
    text: "Incredible organization and infrastructure. We had zero downtime on our sponsor APIs and the tech talks were phenomenal networking opportunities.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Rhea Iyer",
    role: "AI/ML Track Lead"
  },
  {
    text: "I came to HackBIOS with an idea and left with a fully functional startup prototype. The tracks are incredibly well thought out and challenging.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Vikram Singh",
    role: "Fullstack Engineer"
  },
  {
    text: "The sponsor bounties were fantastic. Our team managed to secure the Web3 prize, and the swag we got at the end was the cherry on top!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ananya Desai",
    role: "Web3 Enthusiast"
  },
  {
    text: "Being a mentor at HackBIOS showed me the incredible talent hidden in Central India. These hackers are building the systems of tomorrow.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Rahul Verma",
    role: "Industry Mentor"
  },
  {
    text: "The sheer amount of caffeine and code output over the 48 hours was insane. HackBIOS is central India's finest technical playground.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Karan Johar",
    role: "Cybersecurity Analyst"
  },
  {
    text: "A truly chaotic yet beautiful 48-hour sprint. Met amazing people, stayed awake on energy drinks, and learned more than I did in an entire semester.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sara Khan",
    role: "Student Hacker"
  },
  {
    text: "The hardware provided for the IoT track was top-notch. It was so seamless testing our smart-agri sensors thanks to the incredible SSTC lab support.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Dev Malhotra",
    role: "IoT Specialist"
  }
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#050a05] relative overflow-hidden border-t border-[#00ff41]/20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#00ff41]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="border border-[#00e5ff]/30 text-[#00e5ff] py-1.5 px-4 rounded-full font-mono text-sm tracking-widest uppercase bg-[#00e5ff]/5 backdrop-blur-sm">
              Terminal Logs
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white tracking-tighter mb-6 glitch" data-text="WHAT HACKERS SAY">
            WHAT <span className="text-[#00ff41]">HACKERS</span> SAY
          </h2>
          <p className="text-gray-400 font-sans text-lg">
            Read the output logs from our previous participants. Real stories of grit, code, and 48-hour caffeine fueled development.
          </p>
        </motion.div>

        {/* CSS Mask for smooth fade at top and bottom */}
        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[600px] md:max-h-[800px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={15} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
