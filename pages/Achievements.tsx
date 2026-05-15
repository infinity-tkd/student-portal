
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
 bg: 'bg-red-50 dark:bg-brand-red/10', text: 'text-brand-red', border: 'border-red-200 dark:border-brand-red/30',
 gradient: 'from-brand-red to-red-600', iconColor: 'text-white'
 };
 if (m.includes('silver')) return {
 bg: 'bg-slate-100 dark:bg-white/10', text: 'text-slate-700 dark:text-slate-200', border: 'border-slate-300 dark:border-white/10',
 gradient: 'from-slate-400 to-slate-600', iconColor: 'text-white'
 };
 if (m.includes('bronze')) return {
 bg: 'bg-brand-black', text: 'text-white', border: 'border-brand-black dark:border-white/20',
 gradient: 'from-brand-black to-slate-900', iconColor: 'text-white'
 };
 return {
 bg: 'bg-slate-100 dark:bg-brand-black/50', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-white/5',
 gradient: 'from-slate-300 to-slate-400', iconColor: 'text-slate-500'
 };
 };

 return (
 <>
 <div className="animate-fade-in space-y-8 md:p-4 pb-24 font-sans">

 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0 mb-8">
 <div>
 <h1 className="text-2xl font-black text-brand-black dark:text-white tracking-tight mb-2">
 Achievements <span className="text-brand-red">.</span>
 </h1>
 <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-wide">Honors & Achievements</p>
 </div>

 {/* Search */}
 <div className="relative group w-full md:w-72">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 group-focus-within:text-brand-red transition-colors">
 <Search size={18} strokeWidth={2.5} />
 </div>
 <input
 type="text"
 placeholder="Search awards..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1a1a1a] border-2 border-slate-200 dark:border-white/10 rounded-xl text-xs font-black tracking-wide outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all placeholder:text-slate-500 dark:text-slate-300"
 />
 </div>
 </div>

 {/* Stats Rail */}
 <div className="flex gap-4 px-4 md:px-0 overflow-x-auto no-scrollbar pb-2">
 <div className="flex-1 min-w-[100px] bg-brand-black rounded-xl p-4 text-white relative overflow-hidden group border border-transparent dark:border-white/10">
 <div className="absolute top-0 right-0 w-16 h-16 bg-white dark:bg-slate-900/10 rounded-full blur-2xl group-hover:bg-brand-red/20 transition-colors"></div>
 <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Total Awards</p>
 <p className="text-31 font-black">{stats.total}</p>
 </div>
 <StatItem label="Gold" count={stats.gold} color="text-brand-red" bg="bg-red-50 dark:bg-brand-red/10 border-red-100 dark:border-brand-red/20" />
 <StatItem label="Silver" count={stats.silver} color="text-slate-700 dark:text-slate-200" bg="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10" />
 <StatItem label="Bronze" count={stats.bronze} color="text-white" bg="bg-brand-black border-transparent dark:border-white/10" />
 </div>

 {/* Modern Filter Tabs */}
 <div className="px-4 md:px-0 flex gap-2 overflow-x-auto no-scrollbar">
 {['all', 'gold', 'silver', 'bronze', 'participation'].map(type => (
 <button
 key={type}
 onClick={() => setFilterMedal(type)}
 className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${filterMedal === type
 ? 'bg-brand-black text-white shadow-lg shadow-red-900/10 scale-105'
 : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 hover:text-slate-600'
 }`}
 >
 {type}
 </button>
 ))}
 </div>

 {/* Achievements List */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
 {filteredAndSorted.length === 0 ? (
 <div className="col-span-full py-20 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
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
 className="group bg-white dark:bg-[#1a1a1a] rounded-xl p-5 flex items-center gap-5 cursor-pointer border border-slate-200 dark:border-white/10 transition-all duration-300 hover:border-brand-red hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 animate-slide-up"
 style={{ animationDelay: `${idx * 50}ms` }}
 >
 {/* Medal Icon */}
 <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${style.gradient} shadow-lg shadow-slate-200 font-bold text-white text-xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
 <div className="absolute inset-0 bg-white dark:bg-slate-900/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <Award size={28} className="relative z-10 drop-shadow-md" />
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex justify-between items-start">
 <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{year}</span>
 {item.medal.toLowerCase().includes('gold') && <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>}
 </div>
 <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight truncate mt-0.5 group-hover:text-brand-red transition-colors">{item.title}</h4>
 <p className="text-xs text-slate-600 dark:text-slate-400 font-bold truncate mt-1 tracking-wide">{item.division}</p>
 </div>

 <ChevronRight size={18} className="text-slate-500 dark:text-slate-300 group-hover:text-slate-800 dark:hover:text-white group-hover:translate-x-1 transition-all" />
 </div>
 );
 })}
 </div>
 </div>

 {/* CLEAN WHITE AUTHENTIC MODAL WITH MEDAL EFFECTS */}
 {selected && (
 <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm bg-slate-900/60 animate-fade-in">
 <div className="absolute inset-0" onClick={() => setSelected(null)}></div>

 <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-xl sm:rounded-xl overflow-hidden shadow-2xl relative z-10 animate-slide-up max-h-[85vh] flex flex-col transition-all border border-slate-200 dark:border-white/10">

 {/* Header / Hero with Dynamic Glow */}
 <div className="relative p-8 pb-6 shrink-0 bg-slate-50 dark:bg-[#1a1a1a] flex flex-col items-center border-b border-slate-200 dark:border-white/10 overflow-hidden">
 {/* Ambient Background Glow based on Medal */}
 <div className={`absolute top-0 inset-x-0 h-32 opacity-20 bg-gradient-to-b ${getMedalStyle(selected.medal).gradient} to-transparent blur-2xl`}></div>

 <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-white dark:hover:bg-slate-900 hover:text-slate-600 hover:shadow-sm transition-all z-20"><X size={18} /></button>

 {/* Animated Medal Circle */}
 <div className="relative mb-4 group">
 {/* Pulse Effect */}
 <div className={`absolute inset-0 rounded-xl bg-gradient-to-tr ${getMedalStyle(selected.medal).gradient} blur-lg opacity-40 animate-pulse`}></div>

 <div className={`relative w-24 h-24 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border-2 ${getMedalStyle(selected.medal).border} shadow-xl shadow-slate-200 transform group-hover:scale-105 transition-transform duration-500`}>
 <Award size={48} className={`${getMedalStyle(selected.medal).text} drop-shadow-sm`} />

 {/* Shimmer Overlay */}
 <div className="absolute inset-0 rounded-xl overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
 </div>
 </div>
 </div>

 <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center leading-tight tracking-tight uppercase mb-2 relative z-10">{selected.title}</h2>

 <div className={`px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 ${getMedalStyle(selected.medal).border} flex items-center gap-2 shadow-sm relative z-10`}>
 <span className={`w-2 h-2 rounded-full ${getMedalStyle(selected.medal).bg.split(' ')[0]}`}></span>
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

 {/* Judge's Feedback with Red tint */}
 {selected.notes && (
 <div className="relative group">
 <div className="bg-red-50/50 dark:bg-brand-red/10 p-6 rounded-xl border border-red-100 dark:border-brand-red/20 relative overflow-hidden transition-colors hover:bg-red-50 dark:hover:bg-brand-red/20">
 {/* Decorative Quote Icon Background */}
 <Quote size={80} className="absolute -right-4 -bottom-4 text-brand-red/10 rotate-12" />

 <p className="relative z-10 flex items-center gap-2 text-[9px] font-black text-brand-red uppercase tracking-widest mb-3">
 <Quote size={10} className="fill-brand-red" /> Judge's Feedback
 </p>
 <p className="relative z-10 text-slate-800 dark:text-slate-200 font-medium text-sm italic leading-relaxed">"{selected.notes}"</p>
 </div>
 </div>
 )}

 {/* Description */}
 <div>
 <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 pb-2 border-b border-slate-200 dark:border-white/10">About Event</h3>
 <p className="text-sm font-medium text-slate-700 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
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
 <div className={`flex-1 min-w-[100px] rounded-xl p-4 flex flex-col justify-center border border-slate-200 dark:border-white/10 ${bg}`}>
 <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
 <p className={`text-2xl font-black ${color}`}>{count}</p>
 </div>
);

const DetailBox = ({ label, value, icon: Icon }: any) => (
 <div className="bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center">
 <Icon size={14} className="text-slate-600 dark:text-slate-400 mb-2" />
 <p className="text-[9px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-widest mb-0.5">{label}</p>
 <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight line-clamp-1 w-full">{value}</p>
 </div>
);

export default Achievements;
