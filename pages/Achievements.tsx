
import React, { useEffect, useState, useMemo } from 'react';
import { useData } from '../context/AuthContext';
import { Achievement } from '../types';
import { Award, Trophy, X, ChevronRight, Quote, Calendar, Layers, Hash, Search } from 'lucide-react';
import { formatDate } from '../utils/date';

const Achievements: React.FC = () => {
  const { data } = useData();
  const achievements = data?.achievements || [];
  const [filterMedal, setFilterMedal] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Achievement | null>(null);

  // Sorting Weight Helper
  const getMedalWeight = (medal: string) => {
    const m = (medal || '').toLowerCase();
    if (m.includes('gold')) return 4;
    if (m.includes('silver')) return 3;
    if (m.includes('bronze')) return 2;
    if (m.includes('participation')) return 0;
    return 1;
  };

  const filteredAndSorted = useMemo(() => {
    let res = achievements.filter(a => {
      const matchesFilter = filterMedal === 'all' || a.medal.toLowerCase().includes(filterMedal);
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return res.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const yearA = dateA.getFullYear();
      const yearB = dateB.getFullYear();

      // 1. Sort by Year (Descending)
      if (yearA !== yearB) return yearB - yearA;

      // 2. Then by Medal Weight (Descending)
      const weightA = getMedalWeight(a.medal);
      const weightB = getMedalWeight(b.medal);
      if (weightA !== weightB) return weightB - weightA;

      // 3. Last by Date
      return dateB.getTime() - dateA.getTime();
    });
  }, [achievements, filterMedal, search]);

  const stats = useMemo(() => {
    return {
      gold: achievements.filter(a => a.medal.toLowerCase().includes('gold')).length,
      silver: achievements.filter(a => a.medal.toLowerCase().includes('silver')).length,
      bronze: achievements.filter(a => a.medal.toLowerCase().includes('bronze')).length,
      total: achievements.length,
    };
  }, [achievements]);

  const getMedalStyle = (medal: string) => {
    const m = medal.toLowerCase();
    if (m.includes('gold')) return {
      bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200',
      gradient: 'from-amber-300 to-amber-500', iconColor: 'text-white'
    };
    if (m.includes('silver')) return {
      bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200',
      gradient: 'from-slate-300 to-slate-500', iconColor: 'text-white'
    };
    if (m.includes('bronze')) return {
      bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200',
      gradient: 'from-orange-400 to-red-500', iconColor: 'text-white'
    };
    return {
      bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100',
      gradient: 'from-slate-200 to-slate-300', iconColor: 'text-slate-500'
    };
  };

  return (
    <>
      <div className="animate-fade-in space-y-8 md:p-4 pb-24 font-sans">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#131950] tracking-tight mb-2">
              Achievements <span className="text-amber-500">.</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-wide">Honors & Achievements</p>
          </div>

          {/* Search */}
          <div className="relative group w-full md:w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search awards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-xs font-black tracking-wide outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Stats Rail */}
        <div className="flex gap-4 px-4 md:px-0 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-1 min-w-[100px] bg-[#0f172a] rounded-2xl p-4 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Total Awards</p>
            <p className="text-3xl font-black">{stats.total}</p>
          </div>
          <StatItem label="Gold" count={stats.gold} color="text-amber-600" bg="bg-amber-50" />
          <StatItem label="Silver" count={stats.silver} color="text-slate-600" bg="bg-slate-50" />
          <StatItem label="Bronze" count={stats.bronze} color="text-orange-700" bg="bg-orange-50" />
        </div>

        {/* Modern Filter Tabs */}
        <div className="px-4 md:px-0 flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'gold', 'silver', 'bronze', 'participation'].map(type => (
            <button
              key={type}
              onClick={() => setFilterMedal(type)}
              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${filterMedal === type
                ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-900/10 scale-105'
                : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
          {filteredAndSorted.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
              <Trophy size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">No awards found</p>
            </div>
          ) : filteredAndSorted.map((item, idx) => {
            const style = getMedalStyle(item.medal);
            const dateStr = formatDate(item.date);
            const year = dateStr.includes('-') ? dateStr.split('-')[2] : dateStr;

            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="group bg-white rounded-[2rem] p-5 flex items-center gap-5 cursor-pointer border border-slate-100 transition-all duration-300 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Medal Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${style.gradient} shadow-lg shadow-slate-200 font-bold text-white text-xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Award size={28} className="relative z-10 drop-shadow-md" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{year}</span>
                    {item.medal.toLowerCase().includes('gold') && <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>}
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight truncate mt-0.5 group-hover:text-amber-600 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-bold truncate mt-1 tracking-wide">{item.division}</p>
                </div>

                <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
              </div>
            );
          })}
        </div>
      </div>

      {/* CLEAN WHITE AUTHENTIC MODAL WITH MEDAL EFFECTS */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm bg-slate-900/60 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelected(null)}></div>

          <div className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl relative z-10 animate-slide-up max-h-[85vh] flex flex-col transition-all">

            {/* Header / Hero with Dynamic Glow */}
            <div className="relative p-8 pb-6 shrink-0 bg-slate-50 flex flex-col items-center border-b border-slate-100 overflow-hidden">
              {/* Ambient Background Glow based on Medal */}
              <div className={`absolute top-0 inset-x-0 h-32 opacity-20 bg-gradient-to-b ${getMedalStyle(selected.medal).gradient} to-transparent blur-2xl`}></div>

              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/80 backdrop-blur text-slate-400 flex items-center justify-center hover:bg-white hover:text-slate-600 hover:shadow-sm transition-all z-20"><X size={18} /></button>

              {/* Animated Medal Circle */}
              <div className="relative mb-4 group">
                {/* Pulse Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${getMedalStyle(selected.medal).gradient} blur-lg opacity-40 animate-pulse`}></div>

                <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center bg-white border-2 ${getMedalStyle(selected.medal).border} shadow-xl shadow-slate-200 transform group-hover:scale-105 transition-transform duration-500`}>
                  <Award size={48} className={`${getMedalStyle(selected.medal).text} drop-shadow-sm`} />

                  {/* Shimmer Overlay */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 text-center leading-tight tracking-tight uppercase mb-2 relative z-10">{selected.title}</h2>

              <div className={`px-4 py-1.5 rounded-full bg-white border-2 ${getMedalStyle(selected.medal).border} flex items-center gap-2 shadow-sm relative z-10`}>
                <span className={`w-2 h-2 rounded-full ${getMedalStyle(selected.medal).bg.replace('bg-', 'bg-')}`}></span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${getMedalStyle(selected.medal).text}`}>
                  {selected.medal} Medalist
                </span>
              </div>
            </div>

            {/* Scrollable Details */}
            <div className="p-8 pt-6 overflow-y-auto custom-scrollbar space-y-6">

              {/* Meta Grid */}
              <div className="grid grid-cols-3 gap-3">
                <DetailBox label="Date" value={formatDate(selected.date)} icon={Calendar} />
                <DetailBox label="Category" value={selected.category} icon={Layers} />
                <DetailBox label="Division" value={selected.division} icon={Hash} />
              </div>

              {/* Judge's Feedback with Gold tint */}
              {selected.notes && (
                <div className="relative group">
                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden transition-colors hover:bg-amber-50">
                    {/* Decorative Quote Icon Background */}
                    <Quote size={80} className="absolute -right-4 -bottom-4 text-amber-500/10 rotate-12" />

                    <p className="relative z-10 flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-widest mb-3">
                      <Quote size={10} className="fill-amber-600" /> Judge's Feedback
                    </p>
                    <p className="relative z-10 text-slate-700 font-medium text-sm italic leading-relaxed">"{selected.notes}"</p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 pb-2 border-b border-slate-50">About Event</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">
                  {selected.description}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper Components
const StatItem = ({ label, count, color, bg }: any) => (
  <div className={`flex-1 min-w-[100px] rounded-2xl p-4 flex flex-col justify-center border border-slate-100 ${bg}`}>
    <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{count}</p>
  </div>
);

const DetailBox = ({ label, value, icon: Icon }: any) => (
  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center flex flex-col items-center justify-center">
    <Icon size={14} className="text-slate-400 mb-2" />
    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">{label}</p>
    <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-1 w-full">{value}</p>
  </div>
);

export default Achievements;
