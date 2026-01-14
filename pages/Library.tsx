
import React, { useEffect, useState } from 'react';
import { useData, useAuth } from '../context/AuthContext';
import { LibraryItem } from '../types';
import { Search, Play, Maximize2, X, Crosshair, Link, ToggleLeft, ToggleRight, Filter } from 'lucide-react';

const Library: React.FC = () => {
  const { data } = useData();
  const { student } = useAuth();
  const items = data?.library || [];
  const [filtered, setFiltered] = useState<LibraryItem[]>([]);
  const [search, setSearch] = useState('');

  // New State: Default to "My Belt Only"
  const [isMyBeltOnly, setIsMyBeltOnly] = useState(true);
  const [activeBelt, setActiveBelt] = useState('All');
  const [activeCat, setActiveCat] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<LibraryItem | null>(null);

  useEffect(() => {
    let res = items;

    // 1. First Apply "My Belt Only" Logic
    if (isMyBeltOnly && student?.belt) {
      // Strict matching for current belt
      res = res.filter(i => i.belt.toLowerCase() === student.belt.toLowerCase());
    } else {
      // 2. Otherwise allow standard Belt Filter
      if (activeBelt !== 'All') res = res.filter(i => i.belt === activeBelt);
    }

    // 3. Category Filter
    if (activeCat !== 'All') res = res.filter(i => i.category === activeCat);

    // 4. Search Filter
    if (search) res = res.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

    setFiltered(res);
  }, [items, isMyBeltOnly, activeBelt, activeCat, search, student]);

  // Derive available filters based on full dataset (not just filtered)
  const belts = ['All', ...Array.from(new Set(items.map(i => i.belt)))];
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <>
      <div className="animate-fade-in pb-24 md:pb-12 min-h-screen">

        {/* Header Section */}
        <div className="mb-0 px-4 md:px-0 bg-white md:bg-transparent pb-6 md:pb-0 pt-2 md:pt-0 sticky top-0 z-30 md:static border-b md:border-b-0 border-slate-50 shadow-sm md:shadow-none">

          {/* Top Row: Title & Toggle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[#131950] tracking-tight mb-1">Library <span className="text-blue-600">.</span></h1>
              <p className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Curriculum & Techniques</p>
            </div>

            {/* My Belt Toggle */}
            <div
              onClick={() => setIsMyBeltOnly(!isMyBeltOnly)}
              className={`cursor-pointer group flex items-center justify-between md:justify-start gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-95 ${isMyBeltOnly ? 'bg-[#131950] border-[#131950] text-white shadow-lg shadow-[#131950]/20' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:shadow-md'}`}
            >
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">My Belt Only</span>
                <span className={`text-[10px] font-bold leading-none mt-1 ${isMyBeltOnly ? 'text-blue-300' : 'text-[#131950]'}`}>{student.belt} Curriculum</span>
              </div>
              {isMyBeltOnly ? <ToggleRight size={26} className="text-emerald-400" /> : <ToggleLeft size={26} className="text-slate-300" />}
            </div>
          </div>

          {/* Search Bar - Prominent */}
          <div className="relative group max-w-4xl mx-auto mb-6 z-20">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#131950] transition-colors duration-300">
              <Search size={20} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search by technique name..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-[#131950] outline-none focus:bg-white focus:border-[#131950]/10 focus:ring-4 focus:ring-[#131950]/5 transition-all placeholder:text-slate-400 placeholder:font-semibold"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters Section - Left Aligned & Clean Indentation */}
          <div className="flex flex-col items-start gap-4 animate-slide-up mb-2" style={{ animationDelay: '100ms' }}>

            {/* Row 1: Category Filters */}
            <div className="w-full flex justify-start overflow-x-auto no-scrollbar pb-1 md:pb-0 px-1 -ml-1">
              <div className="flex gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`shrink-0 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${activeCat === c ? 'bg-[#131950] text-white border-[#131950] shadow-md shadow-[#131950]/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-[#131950]'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Belt Filters (Conditional) */}
            {!isMyBeltOnly && (
              <div className="w-full flex justify-start overflow-x-auto no-scrollbar pb-1 md:pb-0 px-1 -ml-1 border-t border-slate-50 pt-4 md:border-none md:pt-0">
                <div className="flex gap-2">
                  {belts.map(b => (
                    <button
                      key={b}
                      onClick={() => setActiveBelt(b)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all duration-300 border ${activeBelt === b ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'}`}
                    >
                      {b === 'All' ? 'All Ranks' : b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Grid - Compact Mobile Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 px-4 md:px-0">
          {filtered.length === 0 ? (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
              </div>
              <h3 className="text-[#131950] font-black text-xl mb-2">No videos found</h3>
              <p className="text-slate-400 font-bold text-xs max-w-xs mx-auto leading-relaxed">We couldn't find any videos matching your search criteria. Try adjusting your filters.</p>
              {isMyBeltOnly && <button onClick={() => setIsMyBeltOnly(false)} className="mt-8 px-6 py-3 bg-white border border-slate-200 text-[#131950] rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#131950] hover:bg-[#131950] hover:text-white transition-all shadow-sm">View Full Library</button>}
            </div>
          ) : filtered.map((item, idx) => {
            const vidId = getYoutubeId(item.videoUrl);
            return (
              <div key={item.id} onClick={() => setSelectedVideo(item)} className="group bg-white rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(19,25,80,0.15)] hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 cursor-pointer flex flex-col h-full animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>

                {/* Thumbnail */}
                <div className="aspect-video bg-[#0b0f2e] relative overflow-hidden">
                  {vidId ? (
                    <img src={`https://img.youtube.com/vi/${vidId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" alt={item.title} loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30"><X size={32} /></div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-[#131950]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play size={16} fill="white" className="ml-0.5 md:ml-1 md:w-5 md:h-5" />
                    </div>
                  </div>

                  {/* Belt Tag */}
                  <div className="absolute top-2 left-2 px-1.5 py-1 md:px-2 md:py-1 rounded text-[7px] md:text-[8px] font-black uppercase tracking-widest bg-[#131950] text-white shadow-sm border border-white/10">
                    {item.belt}
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[7px] md:text-[8px] font-bold bg-black/60 text-white backdrop-blur-sm border border-white/10">
                    Video
                  </div>
                </div>

                {/* Info Content - Structure & Info */}
                <div className="p-3 md:p-5 flex-1 flex flex-col relative bg-white">

                  <div className="mb-2 md:mb-3">
                    <span className="text-[8px] md:text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">{item.category}</span>
                    <h4 className="font-extrabold text-[#131950] text-xs md:text-base leading-tight mt-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{item.title}</h4>
                  </div>

                  {/* Description Snippet (Hidden on very small screens if needed, or truncated more) */}
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                    {item.title} - {item.category} technique.
                  </p>

                  {/* Footer Stats */}
                  <div className="mt-auto flex items-center justify-between pt-2 md:pt-3 border-t border-slate-50 group-hover:border-blue-50 transition-colors">
                    <div className="flex items-center gap-1">
                      <Crosshair size={10} className="text-slate-300 md:w-3 md:h-3" />
                      <span className="text-[8px] md:text-[10px] font-bold text-slate-400 truncate max-w-[60px] md:max-w-none">{item.focus || 'Tech'}</span>
                    </div>
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#131950] group-hover:text-white transition-all duration-300">
                      <Maximize2 size={8} strokeWidth={3} className="md:w-[10px] md:h-[10px]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cinema Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center animate-fade-in p-0 md:p-8">
          <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 active:scale-90"><X size={20} /></button>

          <div className="w-full md:max-w-6xl h-full md:h-auto md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden bg-black md:rounded-[2.5rem] shadow-2xl relative animate-zoom-in">

            {/* Player Container */}
            <div className="w-full md:w-[70%] bg-black flex items-center justify-center relative aspect-video md:aspect-auto">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.videoUrl)}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>

            {/* Sidebar Info (Scrollable on Mobile) */}
            <div className="flex-1 bg-zinc-900 p-6 md:p-8 overflow-y-auto text-white border-l border-white/5 custom-scrollbar pb-24 md:pb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest">{selectedVideo.belt}</span>
                <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-[10px] font-black uppercase tracking-widest border border-zinc-700">{selectedVideo.category}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black mb-1 leading-tight">{selectedVideo.title}</h3>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-6">{selectedVideo.subTitle}</p>

              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 mb-6">
                <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedVideo.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20"><Crosshair size={14} /></div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Focus</p>
                    <p className="text-xs font-bold text-zinc-200">{selectedVideo.focus || 'General Technique'}</p>
                  </div>
                </div>
                {selectedVideo.prerequisite && (
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20"><Link size={14} /></div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Prerequisite</p>
                      <p className="text-xs font-bold text-zinc-200">{selectedVideo.prerequisite}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Library;
