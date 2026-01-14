
import React, { useEffect, useState } from 'react';
import { useData, useAuth } from '../context/AuthContext';
import { Promotion } from '../types';
import { Star, CheckCircle } from 'lucide-react';
import { formatDate } from '../utils/date';

const BeltHistory: React.FC = () => {
  const { student } = useAuth();
  const { data } = useData();
  // Filter history for current student if logical, but data.history is already student specific
  const history = data?.history || [];

  const getBeltStyle = (beltName: string) => {
    const b = beltName.toLowerCase();

    if (b.includes("yellow")) return {
      theme: "yellow",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-amber-900",
      subtext: "text-amber-600/60",
      accent: "bg-yellow-400",
      shadow: "shadow-yellow-200/50",
      gradient: "from-yellow-400 to-amber-500"
    };
    if (b.includes("green")) return {
      theme: "green",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-900",
      subtext: "text-emerald-600/60",
      accent: "bg-emerald-500",
      shadow: "shadow-emerald-200/50",
      gradient: "from-emerald-400 to-green-600"
    };
    if (b.includes("blue")) return {
      theme: "blue",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      subtext: "text-blue-600/60",
      accent: "bg-blue-600",
      shadow: "shadow-blue-200/50",
      gradient: "from-blue-500 to-indigo-600"
    };
    if (b.includes("red")) return {
      theme: "red",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      subtext: "text-red-600/60",
      accent: "bg-red-600",
      shadow: "shadow-red-200/50",
      gradient: "from-red-500 to-rose-700"
    };
    if (b.includes("brown")) return {
      theme: "brown",
      bg: "bg-[#fdf6ec]", // warmer/lighter brown bg
      border: "border-[#dcbfa3]",
      text: "text-[#5d4037]",
      subtext: "text-[#8d6e63]",
      accent: "bg-[#795548]",
      shadow: "shadow-orange-200/50",
      gradient: "from-[#8d6e63] to-[#5d4037]"
    };
    if (b.includes("black")) return {
      theme: "black",
      bg: "bg-slate-900",
      border: "border-slate-800",
      text: "text-white",
      subtext: "text-slate-400",
      accent: "bg-slate-800",
      shadow: "shadow-slate-900/50",
      gradient: "from-slate-800 to-black"
    };
    // Default / White
    return {
      theme: "white",
      bg: "bg-white",
      border: "border-slate-100",
      text: "text-slate-800",
      subtext: "text-slate-400",
      accent: "bg-slate-200",
      shadow: "shadow-slate-200/50",
      gradient: "from-slate-100 to-slate-200"
    };
  };

  return (
    <div className="animate-slide-up pb-20 md:p-4">
      <div className="px-4 md:px-0 mb-8">
        <h1 className="text-2xl font-black text-[#131950] tracking-tight">Belt Journey</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1 w-8 bg-brand-gold rounded-full"></div>
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Path to Mastery</p>
        </div>
      </div>

      <div className="relative mx-4 md:mx-0 pl-4">
        {/* Connection Line with Gradient */}
        <div className="absolute left-[34px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-transparent"></div>

        <div className="space-y-10">
          {history.map((promo, idx) => {
            const s = getBeltStyle(promo.rank);
            return (
              <div key={promo.id} className="group relative flex items-stretch gap-8 animate-slide-in-right" style={{ animationDelay: `${idx * 150}ms` }}>

                {/* Timeline Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full bg-white border-[4px] border-white shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ring-1 ring-slate-100`}>
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-inner`}>
                      {/* Center Dot for belt appearance */}
                      <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm flex items-center justify-center">
                        <Star size={10} className="text-white fill-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 ${s.bg} border ${s.border} rounded-[1.5rem] p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${s.shadow}`}>

                  {/* TKD Authentic Pattern / Watermark */}
                  <div className="absolute right-0 top-0 w-28 h-28 opacity-[0.03] pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                      <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                    </svg>
                  </div>
                  <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full ${s.accent} opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                  {/* Arrow matching card bg */}
                  <div className={`absolute top-6 -left-2 w-4 h-4 ${s.bg} border-b border-l ${s.border} transform rotate-45`}></div>

                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h3 className={`text-lg font-black ${s.text} tracking-tight`}>{promo.rank} Belt</h3>
                      <p className={`text-[10px] font-bold ${s.subtext} tracking-wide mt-0.5`}>Promotion Test Result</p>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/20 shadow-sm backdrop-blur-sm ${s.theme === 'black' ? 'bg-white/10 text-white' : 'bg-white text-slate-600'}`}>
                      <CheckCircle size={10} strokeWidth={3} className={s.theme === 'black' ? 'text-emerald-400' : 'text-emerald-500'} />
                      <span className="text-[9px] font-black tracking-wide">{promo.result}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className={`px-2.5 py-1 rounded-lg ${s.theme === 'black' ? 'bg-white/10' : 'bg-white/60'} border border-transparent`}>
                      <p className={`text-[10px] font-bold ${s.theme === 'black' ? 'text-slate-300' : 'text-slate-500'} tracking-wide`}>{formatDate(promo.date)}</p>
                    </div>
                  </div>

                  {/* Belt Visual Bar */}
                  <div className="h-2.5 w-full bg-white/50 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className={`h-full w-full rounded-full bg-gradient-to-r ${s.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-[1px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BeltHistory;
