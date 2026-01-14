import React, { useState, useMemo } from 'react';
import { useData, useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Check, X, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

const Attendance: React.FC = () => {
  const { student } = useAuth();
  const { data } = useData();
  const records = data?.attendance || [];
  const [currentDate, setCurrentDate] = useState(new Date());

  const stats = useMemo(() => {
    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const total = records.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, late, absent, rate };
  }, [records]);

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Helper for robust date comparison (ignoring time)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const renderDays = () => {
    const days = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} />);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDayDate = new Date(year, month, d);

      const rec = records.find(r => {
        const rDate = new Date(r.date);
        return !isNaN(rDate.getTime()) && isSameDay(rDate, currentDayDate);
      });

      let statusStyles = "text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:scale-110";
      let statusIndicator = null;

      if (rec) {
        if (rec.status === 'Present') {
          statusStyles = "bg-emerald-50 text-emerald-600 font-bold shadow-sm ring-1 ring-emerald-100 hover:scale-105 hover:shadow-emerald-200";
          statusIndicator = <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>;
        }
        else if (rec.status === 'Late') {
          statusStyles = "bg-amber-50 text-amber-600 font-bold shadow-sm ring-1 ring-amber-100 hover:scale-105 hover:shadow-amber-200";
          statusIndicator = <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500"></div>;
        }
        else if (rec.status === 'Absent') {
          statusStyles = "bg-red-50 text-red-600 font-bold shadow-sm ring-1 ring-red-100 hover:scale-105 hover:shadow-red-200";
          statusIndicator = <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400"></div>;
        }
      }

      const today = new Date();
      const isToday = isSameDay(today, currentDayDate);
      const todayRing = isToday ? "ring-2 ring-blue-600 ring-offset-2 z-10" : "";

      days.push(
        <div key={d} className="flex justify-center items-center py-1 relative group animate-slide-up" style={{ animationDelay: `${d * 15}ms` }}>
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-2xl text-[11px] transition-all duration-300 relative ${statusStyles} ${todayRing}`}
          >
            {d}
            {statusIndicator}
          </button>

          {/* Authentic Tooltip */}
          {rec && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              {rec.status === 'Present' && <Check size={10} className="text-emerald-400" />}
              {rec.status === 'Late' && <Clock size={10} className="text-amber-400" />}
              {rec.status === 'Absent' && <X size={10} className="text-red-400" />}
              {rec.status}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };

  return (
    <div className="animate-fade-in pb-12 md:p-6 min-h-screen flex flex-col items-center">

      {/* Title Section */}
      <div className="w-full max-w-3xl px-4 md:px-0 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#131950] tracking-tight mb-2">
            Attendance <span className="text-blue-500">.</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Track your training journey</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm text-[10px] font-bold text-slate-400">
          <Sparkles size={12} className="text-amber-400" /> Live Updates
        </div>
      </div>

      {/* Main Premium Card */}
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative border border-slate-100 flex flex-col md:flex-row">

        {/* Left: Stats Hero (Dark Blue) */}
        <div className="relative bg-[#020617] md:w-2/5 p-6 flex flex-col justify-between overflow-hidden shrink-0">
          {/* Authentic Animated Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] -ml-12 -mb-12"></div>

          {/* Header Info - Horizontal Compact */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-md shrink-0">
              <CalendarIcon size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white text-sm font-black tracking-wide leading-none">Your Performance</h2>
              <p className="text-blue-200/60 text-[10px] font-bold mt-0.5">Keep your streak alive!</p>
            </div>
          </div>

          {/* Central Ring Stats */}
          <div className="relative z-10 py-4 flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Glowing Rings */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
              <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={314} strokeDashoffset={314 - (314 * stats.rate) / 100} className="text-blue-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
              </svg>
              <div className="text-center">
                <span className="block text-2xl font-black text-white tracking-tight">{stats.rate}%</span>
                <span className="block text-[8px] font-bold text-blue-400 tracking-wider">Rate</span>
              </div>
            </div>
          </div>

          {/* Bottom Mini Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-emerald-400 font-bold text-lg">{stats.present}</p>
              <p className="text-[8px] text-slate-500 font-black tracking-wide">Present</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-amber-400 font-bold text-lg">{stats.late}</p>
              <p className="text-[8px] text-slate-500 font-black tracking-wide">Late</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-red-400 font-bold text-lg">{stats.absent}</p>
              <p className="text-[8px] text-slate-500 font-black tracking-wide">Absent</p>
            </div>
          </div>
        </div>

        {/* Right: Calendar (Clean White) */}
        <div className="flex-1 bg-white p-8 relative flex flex-col">

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {currentDate.toLocaleString('default', { month: 'long' })}
              </h3>
              <span className="text-xs font-bold text-slate-300 tracking-wide">{year}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><ChevronLeft size={18} /></button>
              <button onClick={() => changeMonth(1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-7 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-300 tracking-wide">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
              {renderDays()}
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-6">
            <LegendItem color="bg-emerald-500" label="Present" />
            <LegendItem color="bg-amber-400" label="Late" />
            <LegendItem color="bg-red-400" label="Absent" />
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components
const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2 group cursor-default">
    <div className={`w-2 h-2 rounded-full ${color} ring-2 ring-offset-2 ring-transparent group-hover:ring-${color.split('-')[1]}-100 transition-all`}></div>
    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors tracking-wide">{label}</span>
  </div>
);

export default Attendance;
