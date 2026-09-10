import React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn } from "./ui/testimonials-columns-1";

const testimonials = [
  {
    text: "HackBIOS pushed us hard. Twenty-four hours to go from an idea to a working prototype is no joke, but that pressure is exactly what made it worth it.",
    name: "Priya Sharma",
    role: "Participant, HackBIOS 2025"
  },
  {
    text: "The energy here is unmatched. From late-night debugging to the final demo, every hour taught me something I wouldn't have picked up in a semester of classes.",
    name: "Arjun Patel",
    role: "Frontend Developer"
  },
  {
    text: "Solid organization from start to finish — sponsor APIs worked without a hitch, and the tech talks turned into some genuinely useful networking.",
    name: "Rhea Iyer",
    role: "Participant, HackBIOS 2025"
  },
  {
    text: "I came in with a rough idea and left with an actual working prototype. The healthcare track problem statement pushed us to think practically, not just build something flashy.",
    name: "Vikram Singh",
    role: "Fullstack Engineer"
  },
  {
    text: "Judging was sharp — the panel asked questions that actually tested whether our project worked, not just whether the pitch sounded good.",
    name: "Ananya Desai",
    role: "Finalist, HackBIOS 2025"
  },
  {
    text: "Mentoring at HackBIOS showed me how much talent is out there in Central India. These students build fast, and they're not afraid to scrap an idea at 2 AM and start over.",
    name: "Rahul Verma",
    role: "Industry Mentor"
  },
  {
    text: "Twenty-four hours of nonstop building, way too much chai, and a working robotics demo by the deadline. HackBIOS doesn't slow down for anyone.",
    name: "Karan Mehta",
    role: "Student Hacker"
  },
  {
    text: "A genuinely intense sprint — met great people, barely slept, and still learned more building under pressure than I expected going in.",
    name: "Sara Khan",
    role: "Student Hacker"
  },
  {
    text: "The lab access at SSTC made testing our automation project so much smoother. Having real hardware on hand instead of just simulating everything made a big difference.",
    name: "Dev Malhotra",
    role: "Participant, HackBIOS 2025"
  }
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      
      {/* Background Ambience */}
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
            <div className="border border-[#00ff41]/30 text-[#00ff41] py-1.5 px-4 rounded-full font-mono text-xs tracking-widest uppercase bg-[#00ff41]/5 backdrop-blur-sm">
              / TERMINAL_LOGS
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-white tracking-tighter mb-6 glitch uppercase" data-text="/ WHAT HACKERS SAY">
            <span className="text-[#00ff41]">/</span> WHAT <span className="text-[#00ff41]">HACKERS</span> SAY
          </h2>
          <p className="text-gray-400 font-sans text-lg">
            Read the output logs from our previous participants. Real stories of grit, code, and 24-hour caffeine fueled development.
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
