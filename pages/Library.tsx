import React, { useEffect, useState, useRef } from 'react';
import { useData, useAuth } from '../context/AuthContext';
import { LibraryItem } from '../types';
import { Search, Play, Maximize2, X, Crosshair, Link, ToggleLeft, ToggleRight, Bookmark, BookmarkCheck, History, Info, ChevronRight, ChevronLeft } from 'lucide-react';

// Custom Hook for LocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(error);
    }
  };
  return [storedValue, setValue] as const;
}

const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- VIDEO CARD COMPONENT ---
const VideoCard = ({ item, onClick, isBookmarked, toggleBookmark, index }: { item: LibraryItem, onClick: () => void, isBookmarked: boolean, toggleBookmark: (e: React.MouseEvent, id: string) => void, index: number }) => {
  const vidId = getYoutubeId(item.videoUrl);
  
  return (
    <div className="group w-full bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-red-200 dark:hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col h-[280px] md:h-[320px] animate-slide-up relative" onClick={onClick} style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}>
      {/* Thumbnail */}
      <div className="aspect-video bg-slate-900 relative overflow-hidden shrink-0">
        {vidId ? (
          <img src={`https://img.youtube.com/vi/${vidId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" alt={item.title} loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30"><X size={32} /></div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-brand-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-brand-red dark:text-white border border-white/40 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
            <Play size={20} fill="currentColor" className="ml-1" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-brand-black text-white shadow-sm border border-white/10">
          {item.belt}
        </div>

        <button onClick={(e) => toggleBookmark(e, item.id)} className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white transition-colors border border-white/10 opacity-0 group-hover:opacity-100 sm:opacity-100">
          {isBookmarked ? <BookmarkCheck size={16} className="text-red-400" /> : <Bookmark size={16} />}
        </button>
      </div>

      {/* Info Content */}
      <div className="p-4 md:p-5 flex-1 flex flex-col relative bg-white dark:bg-[#1a1a1a]">
        <div className="mb-2">
          <span className="text-[9px] font-black text-brand-red uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">{item.category}</span>
          <h4 className="font-black text-brand-black dark:text-white text-sm md:text-base leading-tight mt-3 line-clamp-2 group-hover:text-brand-red transition-colors">{item.title}</h4>
        </div>
        
        <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 mt-auto mb-3">
          {item.title} - {item.category} technique focusing on {item.focus || 'general fundamentals'}.
        </p>

        {/* Footer Stats */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <Crosshair size={12} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px] uppercase tracking-wide">{item.focus || 'Technique'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SWIMLANE COMPONENT ---
const Swimlane = ({ title, icon: Icon, items, onVideoClick, bookmarks, toggleBookmark }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-10 relative group">
      <div className="flex items-center gap-3 mb-4 px-4 md:px-8">
        {Icon && <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-brand-red flex items-center justify-center"><Icon size={16} /></div>}
        <h2 className="text-xl md:text-2xl font-black text-brand-black dark:text-white tracking-tight">{title}</h2>
      </div>
      
      {/* Scroll Controls (Desktop only) */}
      <button onClick={() => scroll('left')} className="hidden md:flex absolute left-2 top-[55%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-brand-black/90 shadow-xl border border-slate-200 dark:border-white/10 items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-brand-red transition-all"><ChevronLeft size={24} /></button>
      <button onClick={() => scroll('right')} className="hidden md:flex absolute right-2 top-[55%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-brand-black/90 shadow-xl border border-slate-200 dark:border-white/10 items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-brand-red transition-all"><ChevronRight size={24} /></button>

      <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-6 px-4 md:px-8 custom-scrollbar scroll-smooth snap-x">
        {items.map((item: LibraryItem, idx: number) => (
          <div key={item.id} className="snap-start shrink-0 w-[260px] md:w-[320px]">
            <VideoCard 
              item={item} 
              index={idx}
              onClick={() => onVideoClick(item)} 
              isBookmarked={bookmarks.includes(item.id)} 
              toggleBookmark={toggleBookmark} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};


const Library: React.FC = () => {
  const { data } = useData();
  const { student } = useAuth();
  const allItems = data?.library || [];
  
  const [search, setSearch] = useState('');
  const [isMyBeltOnly, setIsMyBeltOnly] = useState(true);
  const [activeBelt, setActiveBelt] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<LibraryItem | null>(null);

  // Local Storage Hooks
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('infinity_bookmarks', []);
  const [historyIds, setHistoryIds] = useLocalStorage<string[]>('infinity_history', []);

  // Handlers
  const handleVideoClick = (video: LibraryItem) => {
    setSelectedVideo(video);
    // Add to history (keep last 10, move to front if exists)
    setHistoryIds(prev => {
      const newHist = prev.filter(id => id !== video.id);
      newHist.unshift(video.id);
      return newHist.slice(0, 10);
    });
  };

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const toggleBookmarkFromModal = (id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const belts = ['All', ...Array.from(new Set(allItems.map(i => i.belt)))];

  // Base Pool (My Belt vs All)
  const basePool = isMyBeltOnly && student?.belt 
    ? allItems.filter(i => i.belt.toLowerCase() === student.belt.toLowerCase())
    : (activeBelt === 'All' ? allItems : allItems.filter(i => i.belt === activeBelt));

  // Search Results
  const searchResults = search 
    ? basePool.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Hero Video (First Poomsae of current belt, or first video)
  const heroVideo = isMyBeltOnly 
    ? (basePool.find(i => i.category.toLowerCase().includes('poomsae')) || basePool[0]) 
    : basePool[Math.floor(Math.random() * Math.min(10, basePool.length))];

  // History & Bookmarks Data
  const historyItems = historyIds.map(id => allItems.find(i => i.id === id)).filter(Boolean) as LibraryItem[];
  const bookmarkItems = bookmarks.map(id => allItems.find(i => i.id === id)).filter(Boolean) as LibraryItem[];

  // Categorized Swimlanes
  const categories = Array.from(new Set(basePool.map(i => i.category)));

  return (
    <div className="animate-fade-in pb-24 md:pb-12 min-h-screen bg-slate-50 dark:bg-brand-black">
      
      {/* HEADER & SEARCH AREA */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10 sticky top-0 z-30 shadow-sm px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-black dark:text-white tracking-tight">TKD Stream <span className="text-brand-red">.</span></h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Video Curriculum</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group flex-1 md:w-[350px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-red transition-colors">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search techniques..."
              className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-brand-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-brand-black dark:text-white outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-brand-red/50 focus:ring-4 focus:ring-brand-red/10 transition-all placeholder:text-slate-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={16} /></button>}
          </div>

          {/* Belt Toggle */}
          <button
            onClick={() => setIsMyBeltOnly(!isMyBeltOnly)}
            className={`shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${isMyBeltOnly ? 'bg-brand-black border-brand-black text-white shadow-lg shadow-brand-black/20' : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">My Belt</span>
            {isMyBeltOnly ? <ToggleRight size={20} className="text-brand-red" /> : <ToggleLeft size={20} className="text-slate-400" />}
          </button>
        </div>
      </div>

      {/* SECONDARY BELT FILTER (Visible when My Belt is OFF) */}
      {!isMyBeltOnly && (
        <div className="bg-slate-100 dark:bg-[#151515] border-b border-slate-200 dark:border-white/10 px-4 md:px-8 py-3 flex gap-2 overflow-x-auto no-scrollbar shadow-inner">
          {belts.map(b => (
            <button
              key={b}
              onClick={() => setActiveBelt(b)}
              className={`shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${activeBelt === b ? 'bg-brand-black text-white border-brand-black shadow-md' : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-brand-black dark:hover:text-white'}`}
            >
              {b === 'All' ? 'All Ranks' : b}
            </button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="pt-6">
        
        {/* SEARCH RESULTS VIEW */}
        {search ? (
          <div className="px-4 md:px-8">
            <h2 className="text-lg font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-white/10 pb-2">Search Results for "{search}"</h2>
            {searchResults.length === 0 ? (
              <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-black text-brand-black dark:text-white">No matches found</h3>
                <p className="text-sm text-slate-500 mt-2">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((item, idx) => (
                  <VideoCard key={item.id} item={item} index={idx} onClick={() => handleVideoClick(item)} isBookmarked={bookmarks.includes(item.id)} toggleBookmark={toggleBookmark} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* STANDARD STREAMING VIEW */
          <>
            {/* HERO BANNER */}
            {heroVideo && (
              <div className="px-4 md:px-8 mb-12">
                <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-brand-black shadow-2xl group cursor-pointer" onClick={() => handleVideoClick(heroVideo)}>
                  {/* Hero Background Image */}
                  <div className="absolute inset-0">
                    <img src={`https://img.youtube.com/vi/${getYoutubeId(heroVideo.videoUrl)}/maxresdefault.jpg`} alt="Featured" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/50 to-transparent"></div>
                  </div>

                  {/* Hero Content */}
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 animate-slide-up">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-red-600/30">Featured</span>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest border-l border-white/20 pl-3">{heroVideo.belt}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{heroVideo.title}</h2>
                    <p className="text-sm md:text-base text-slate-300 font-medium line-clamp-2 md:line-clamp-3 mb-8 max-w-2xl">{heroVideo.description || `Master the fundamentals of ${heroVideo.category} with this detailed breakdown focusing on ${heroVideo.focus || 'precision and power'}.`}</p>
                    
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 bg-white text-brand-black px-6 py-3 md:px-8 md:py-4 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-slate-200 transition-colors shadow-xl group-hover:scale-105 duration-300">
                        <Play size={20} fill="currentColor" /> Play Now
                      </button>
                      <button onClick={(e) => toggleBookmark(e, heroVideo.id)} className="flex items-center justify-center w-12 h-12 md:w-[52px] md:h-[52px] rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all">
                        {bookmarks.includes(heroVideo.id) ? <BookmarkCheck size={24} className="text-brand-red" /> : <Bookmark size={24} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SWIMLANES */}
            <Swimlane title="Jump Back In" icon={History} items={historyItems} onVideoClick={handleVideoClick} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            <Swimlane title="My Favorites" icon={Bookmark} items={bookmarkItems} onVideoClick={handleVideoClick} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            
            {categories.map(cat => (
              <Swimlane 
                key={cat} 
                title={`${cat} Techniques`} 
                items={basePool.filter(i => i.category === cat)} 
                onVideoClick={handleVideoClick} 
                bookmarks={bookmarks} 
                toggleBookmark={toggleBookmark} 
              />
            ))}
          </>
        )}
      </div>

      {/* CINEMA MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center animate-fade-in p-0 md:p-6 lg:p-12">
          <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all border border-white/20 active:scale-90"><X size={24} /></button>

          <div className="w-full max-w-7xl h-full md:h-[85vh] flex flex-col lg:flex-row overflow-hidden bg-[#111111] md:rounded-[2rem] shadow-2xl relative animate-zoom-in border border-white/10">
            
            {/* Player Container */}
            <div className="w-full lg:w-[70%] bg-black flex items-center justify-center relative aspect-video lg:aspect-auto border-b lg:border-b-0 lg:border-r border-white/10">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.videoUrl)}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>

            {/* Sidebar Info (Scrollable on Mobile) */}
            <div className="flex-1 bg-[#111111] p-6 lg:p-10 overflow-y-auto text-white custom-scrollbar pb-24 md:pb-10 relative">
              
              <button onClick={() => toggleBookmarkFromModal(selectedVideo.id)} className={`absolute top-6 right-6 lg:top-10 lg:right-10 p-3 rounded-full border transition-all ${bookmarks.includes(selectedVideo.id) ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {bookmarks.includes(selectedVideo.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-brand-red text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm">{selectedVideo.belt}</span>
                <span className="px-2 py-1 bg-white/5 text-slate-300 rounded text-[10px] font-black uppercase tracking-widest border border-white/10">{selectedVideo.category}</span>
              </div>

              <h3 className="text-2xl lg:text-3xl font-black mb-2 leading-tight pr-12">{selectedVideo.title}</h3>
              {selectedVideo.subTitle && <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-8">{selectedVideo.subTitle}</p>}

              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedVideo.description || 'No detailed description provided for this technique.'}</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-center bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-brand-red flex items-center justify-center shrink-0 border border-red-500/20"><Crosshair size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Primary Focus</p>
                    <p className="text-sm font-bold text-slate-200">{selectedVideo.focus || 'General Technique Execution'}</p>
                  </div>
                </div>

                {selectedVideo.prerequisite && (
                  <div className="flex gap-4 items-center bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20"><Link size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Prerequisite Knowledge</p>
                      <p className="text-sm font-bold text-slate-200">{selectedVideo.prerequisite}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
