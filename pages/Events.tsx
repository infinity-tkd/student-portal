import React, { useEffect, useState } from 'react';
import { useData } from '../context/AuthContext';
import { EventItem } from '../types';
import { MapPin, Calendar, Clock, CalendarDays, X, ChevronRight, Info, AlertCircle, Search } from 'lucide-react';
import { formatDate } from '../utils/date';

const Events: React.FC = () => {
  const { data } = useData();
  const events = data?.events || [];
  const loading = false;

  const [filterType, setFilterType] = useState<'all' | 'open'>('open');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = events.filter(e => {
    const matchesFilter = filterType === 'all' || e.status === 'Open';
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="animate-fade-in space-y-8 md:p-4 pb-24 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#131950] tracking-tight mb-2">
              Events <span className="text-amber-500">.</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Competitions & Seminars</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative group w-full sm:w-64">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-xs font-black tracking-wide outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Filters */}
            <div className="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 shrink-0">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 px-6 py-2.5 rounded-lg text-[10px] font-black tracking-wide transition-all duration-300 ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('open')}
                className={`flex-1 px-6 py-2.5 rounded-lg text-[10px] font-black tracking-wide transition-all duration-300 ${filterType === 'open' ? 'bg-[#0f172a] text-amber-400 shadow-lg shadow-slate-900/20 transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 mx-4 md:mx-0">
            <CalendarDays size={48} className="mx-auto mb-4 text-slate-200" />
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No matching events</h3>
          </div>
        ) : (
          <div className="space-y-3 px-4 md:px-0 max-w-4xl">
            {filteredEvents.map((evt, idx) => {
              const dateStr = formatDate(evt.eventStart);
              const isOpen = evt.status === 'Open';

              // Safety check for date parts
              const parts = dateStr.includes('-') ? dateStr.split('-') : [dateStr, '', ''];
              const day = parts[0] || '01';
              const month = parts[1] || 'JAN';

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="group bg-white rounded-2xl p-4 flex items-center gap-5 cursor-pointer border border-slate-100 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-0.5 animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Compact Date Box */}
                  <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-none mb-0.5">{month}</span>
                    <span className="text-xl font-black leading-none">{day}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-black text-slate-800 leading-tight group-hover:text-blue-700 transition-colors truncate pr-4">{evt.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shrink-0 ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        {isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock size={12} className={isOpen ? "text-blue-500" : "text-slate-300"} />
                        <span>{evt.startTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={12} className={isOpen ? "text-blue-500" : "text-slate-300"} />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CLEAN WHITE AUTHENTIC MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}></div>

          <div className="bg-white w-full sm:max-w-xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl relative z-10 animate-slide-up flex flex-col max-h-[85vh]">

            {/* Header / Hero */}
            <div className="relative p-8 pb-4 shrink-0">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all z-20"><X size={18} strokeWidth={2.5} /></button>

              <div className="mb-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedEvent.status === 'Open' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {selectedEvent.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {selectedEvent.type}
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tight uppercase">{selectedEvent.title}</h2>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm tracking-wide">
                <Calendar size={16} />
                <span>{formatDate(selectedEvent.eventStart)}</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 pt-2 overflow-y-auto custom-scrollbar space-y-8">

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-blue-100 transition-colors">
                  <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-blue-500 transition-colors"><Clock size={12} /> Time</p>
                  <p className="text-slate-800 font-bold text-sm">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-blue-100 transition-colors">
                  <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-blue-500 transition-colors"><MapPin size={12} /> Location</p>
                  <p className="text-slate-800 font-bold text-sm line-clamp-1">{selectedEvent.location}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 pb-2 border-b border-slate-50">About Event</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Registration Box */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-5 rounded-2xl border border-blue-100 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-1">Registration</h4>
                  <p className="text-xs text-blue-700/80 font-medium leading-relaxed">
                    Opens: <span className="font-bold text-blue-900">{formatDate(selectedEvent.regStart)}</span><br />
                    Closes: <span className="font-bold text-blue-900">{formatDate(selectedEvent.regEnd)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 border-t border-slate-50 bg-white">
              <button
                disabled={selectedEvent.status !== 'Open'}
                onClick={() => setSelectedEvent(null)}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${selectedEvent.status === 'Open' ? 'bg-[#0f172a] text-white shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {selectedEvent.status === 'Open' ? (
                  <>Confirm Registration <ChevronRight size={14} /></>
                ) : 'Registration Closed'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Events;
