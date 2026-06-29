import React from 'react';
import { Trophy, Medal, Award, GraduationCap } from 'lucide-react';

const PrizePool = () => {
  return (
    <section id="prizes" className="py-32 relative bg-[#050a05] overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff41]/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-24 relative">
          <h2 className="text-4xl md:text-7xl font-mono font-bold mb-6 glitch text-white uppercase tracking-tighter" data-text="/ REWARD_VAULT">
            <span className="text-[#00ff41]">/</span> REWARD_VAULT
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-[#00ff41]/30"></div>
            <p className="text-[#00e5ff] font-mono text-xl tracking-[0.2em] uppercase shadow-glow">₹ 1,00,000+ IN BOUNTY</p>
            <div className="h-[1px] w-12 bg-[#00ff41]/30"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-8 max-w-6xl mx-auto px-4">
          
          {/* Runner Up */}
          <div className="cinematic-card w-full md:w-1/3 bg-gradient-to-t from-[#c0c0c0]/10 to-transparent border border-[#c0c0c0]/20 p-10 text-center relative mt-20 md:mt-16 order-2 md:order-1 flex flex-col items-center group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c0c0c0] to-transparent opacity-50"></div>
            <div className="w-20 h-20 rounded-full bg-[#c0c0c0]/5 flex items-center justify-center mb-6 border border-[#c0c0c0]/20 group-hover:scale-110 transition-transform">
              <Medal size={48} className="text-[#c0c0c0]" />
            </div>
            <h3 className="text-2xl font-mono text-[#c0c0c0] mb-3 uppercase tracking-wider">SILVER_PROTO</h3>
            <div className="text-4xl font-black font-mono text-white mb-2">₹ 25,000</div>
            <p className="text-gray-500 text-sm font-mono tracking-widest uppercase mb-6">Execution_Bonus: Swags + API</p>
          </div>

          {/* Winner */}
          <div className="cinematic-card w-full md:w-2/5 bg-gradient-to-t from-[#00ff41]/20 to-[#00ff41]/5 border-2 border-[#00ff41] p-12 text-center relative z-10 md:translate-y-[-2rem] order-1 md:order-2 shadow-[0_0_50px_rgba(0,255,65,0.2)] flex flex-col items-center group overflow-visible">
            {/* Crown decoration */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#ffd700]/10 blur-2xl rounded-full"></div>
            <div className="absolute -top-1 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent animate-pulse"></div>
            
            <div className="w-28 h-28 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-8 border-2 border-[#ffd700]/50 shadow-[0_0_30px_rgba(255,215,0,0.3)] group-hover:scale-110 transition-all duration-700">
              <Trophy size={64} className="text-[#ffd700] drop-shadow-[0_0_15px_#ffd700]" />
            </div>
            
            <h3 className="text-3xl font-mono text-[#ffd700] mb-3 uppercase tracking-widest text-shadow-neon font-black">ROOT_ADMIN</h3>
            <p className="text-[#00ff41] font-mono text-xs mb-4 tracking-tighter">PREMIER_AWARD_PROTOCOL</p>
            <div className="text-6xl font-black font-mono text-white mb-4 tracking-tighter">₹ 50,000</div>
            <p className="text-[#00ff41] font-mono text-sm tracking-widest uppercase">Full_Access_Unlocking...</p>
          </div>

          {/* 2nd Runner Up */}
          <div className="cinematic-card w-full md:w-1/3 bg-gradient-to-t from-[#cd7f32]/10 to-transparent border border-[#cd7f32]/20 p-10 text-center relative mt-20 md:mt-16 order-3 flex flex-col items-center group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#cd7f32] to-transparent opacity-50"></div>
            <div className="w-20 h-20 rounded-full bg-[#cd7f32]/5 flex items-center justify-center mb-6 border border-[#cd7f32]/20 group-hover:scale-110 transition-transform">
              <Award size={48} className="text-[#cd7f32]" />
            </div>
            <h3 className="text-2xl font-mono text-[#cd7f32] mb-3 uppercase tracking-wider">BRONZE_NODE</h3>
            <div className="text-4xl font-black font-mono text-white mb-2">₹ 10,000</div>
            <p className="text-gray-500 text-sm font-mono tracking-widest uppercase mb-6">Node_Bonus: Swags + API</p>
          </div>

        </div>

        {/* Special prizes */}
        <div className="mt-24 flex justify-center">
          <div className="cinematic-card group inline-flex items-center gap-6 bg-[#0a120a]/80 backdrop-blur-md border border-[#00e5ff]/40 px-10 py-6 rounded-sm shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:border-[#00e5ff]">
            <div className="w-14 h-14 bg-[#00e5ff]/10 flex items-center justify-center rounded-full border border-[#00e5ff]/30 group-hover:scale-110 transition-all duration-500">
              <GraduationCap className="text-[#00e5ff]" size={32} />
            </div>
            <div className="text-left">
              <h4 className="text-[#00e5ff] font-mono text-xs uppercase tracking-[0.3em] font-bold opacity-70">Scholar_Uplink</h4>
              <div className="text-3xl font-black font-mono text-white tracking-tighter">BEST_SCHOOL_TEAM: ₹ 5,000</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PrizePool;
