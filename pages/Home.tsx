
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, useAuth } from '../context/AuthContext';
import { MembershipStatus, BeltPhilosophy } from '../types';
import { formatDate } from '../utils/date';
import { Crown, Activity, BookOpen, Star, User, Percent, CheckCircle2, Award, Hand, GraduationCap, CalendarCheck, Phone, Mail, Fingerprint, X, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useAuth(); // or useData().data.student
  const { data } = useData();
  const membership = data?.dashboard || null;
  const philosophy = data?.beltPhilosophy || null;
  const [showRankModal, setShowRankModal] = useState(false);
  const [showGradModal, setShowGradModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const payments = data?.payments || [];

  const getPaymentStatus = (monthName: string) => {
    const record = payments.find(p => {
      // Robust Normalization
      const dataYear = String(p.year || '').trim();
      const dataMonth = String(p.month || '').trim().toLowerCase();
      const dataStatus = String(p.status || '').trim().toLowerCase();

      // 1. Check Year
      if (dataYear !== selectedYear) return false;

      // 2. Check Month (Handle "Jan" vs "January" vs "01")
      // We check if the sheet value starts with the first 3 letters of our UI month ("jan")
      // OR if our UI month starts with the sheet value (rare, but covers "J" or abbreviation)
      const targetPrefix = monthName.toLowerCase().slice(0, 3);
      const isMonthMatch = dataMonth.startsWith(targetPrefix) || targetPrefix.startsWith(dataMonth);

      // 3. Check Status (Accepted: "paid", "received", "completed", "ok")
      if (!isMonthMatch) return false;

      return dataStatus.includes('paid') || dataStatus === 'ok' || dataStatus.includes('complete');
    });

    return record ? { paid: true, date: record.date, amount: record.amount } : { paid: false };
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const availableYears = Array.from(new Set(payments.map(p => p.year))).sort().reverse();
  if (availableYears.length === 0) availableYears.push(new Date().getFullYear().toString());

  // --- 1. THEME CONFIGURATION (Ported from Snippet) ---
  const sType = (student.scholarshipType || "").toString().toLowerCase().trim();

  const themes: Record<string, any> = {
    'full': {
      // GOLDEN STYLE 
      color: 'text-amber-900', bg: 'bg-amber-400', light: 'bg-amber-50', border: 'border-amber-200',
      gradient: 'from-amber-300 via-yellow-400 to-amber-500', ring: 'ring-amber-300',
      icon: Crown, label: 'Full Scholarship', isPremium: true
    },
    'athlete': {
      // RED/ORANGE - ATHLETE PROGRAM
      color: 'text-orange-700', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200',
      gradient: 'from-orange-400 via-red-500 to-red-600', ring: 'ring-orange-300',
      icon: Activity, label: 'Athlete Program', isPremium: true
    },
    'women in sport': {
      // ROSE/PINK - WOMEN IN SPORT
      color: 'text-rose-700', bg: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-200',
      gradient: 'from-rose-400 via-pink-500 to-purple-500', ring: 'ring-rose-300',
      icon: User, label: 'Women in Sport', isPremium: true
    },
    'talent': {
      // PURPLE/FUSCHIA - TALENT SCOUT
      color: 'text-fuchsia-700', bg: 'bg-fuchsia-500', light: 'bg-fuchsia-50', border: 'border-fuchsia-200',
      gradient: 'from-pink-400 via-fuchsia-500 to-purple-600', ring: 'ring-fuchsia-300',
      icon: Star, label: 'Talent Scout', isPremium: true
    },
    'academic': {
      // BLUE/INDIGO - ACADEMIC EXCELLENCE
      color: 'text-indigo-700', bg: 'bg-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-200',
      gradient: 'from-blue-400 via-indigo-600 to-violet-600', ring: 'ring-indigo-300',
      icon: BookOpen, label: 'Academic Excellence', isPremium: true
    },
    'standard': {
      color: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100',
      gradient: 'from-emerald-400 to-teal-500', ring: 'ring-emerald-200',
      icon: CheckCircle2, label: 'Standard Member'
    }
  };

  let activeTheme = themes['standard'];

  if (student.isScholarship) {
    if (sType === 'full' || sType === 'full scholarship' || sType === '') {
      // Default Yes -> Full
      activeTheme = themes['full'];
    } else if (themes[sType]) {
      // Direct match (athlete, academic)
      activeTheme = themes[sType];
    } else {
      // Partial / Other -> Show Normal with Note
      // "20% Scholarship" -> "Standard Member (20%)"
      activeTheme = {
        ...themes['standard'],
        label: `Standard Member`,
        subLabel: `${student.scholarshipType} Scholarship`,
        icon: Percent
      };
    }
  }

  const ThemeIcon = activeTheme.icon;

  // --- 2. LEDGER CONFIGURATION (Dynamic Check) ---
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYearStr = new Date().getFullYear().toString();

  // Check if current month is paid based on actual records (Client-side override)
  const isCurrentMonthPaid = payments.some(p => {
    const dataYear = String(p.year || '').trim();
    const dataMonth = String(p.month || '').trim().toLowerCase();
    const dataStatus = String(p.status || '').trim().toLowerCase();

    if (dataYear !== currentYearStr) return false;

    const targetPrefix = currentMonthName.toLowerCase().slice(0, 3);
    const isMonthMatch = dataMonth.startsWith(targetPrefix) || targetPrefix.startsWith(dataMonth);

    if (!isMonthMatch) return false;

    return dataStatus.includes('paid') || dataStatus === 'ok' || dataStatus.includes('complete');
  });

  let ledgerState = 'pending';
  if (student.isScholarship) ledgerState = 'scholar';
  else if (isCurrentMonthPaid || membership?.isPaid) ledgerState = 'paid'; // Trust either Client or Server

  const ledgerConfig = {
    scholar: {
      title: 'Membership Covered',
      sub: `Authorized by ${activeTheme.label}`,
      bg: `bg-gradient-to-br ${activeTheme.gradient}`,
      icon: ThemeIcon,
      text: 'text-white'
    },
    paid: {
      title: 'Monthly Active',
      sub: `Processed for ${currentMonthName}`,
      bg: 'bg-emerald-500',
      icon: CheckCircle2,
      text: 'text-white'
    },
    pending: {
      title: 'Renewal Due',
      sub: `Pending for ${currentMonthName}`,
      bg: 'bg-rose-500',
      icon: Loader2,
      text: 'text-white'
    }
  };
  const uiLedger = ledgerConfig[ledgerState as keyof typeof ledgerConfig];
  const LedgerIcon = uiLedger.icon;

  // --- 3. BELT COLOR LOGIC ---
  const getBeltColorClass = (beltName: string) => {
    const b = (beltName || "").toLowerCase();
    if (b.includes('yellow')) return 'bg-yellow-500';
    if (b.includes('green')) return 'bg-emerald-600';
    if (b.includes('blue')) return 'bg-blue-600';
    if (b.includes('red')) return 'bg-rose-600';
    if (b.includes('black')) return 'bg-slate-900';
    return 'bg-dark-blue';
  };

  const isReady = student.eligible === 'YES';

  return (
    <>
      <div className="animate-slide-up pb-10 space-y-8 md:p-4">

        {/* 1. PROFILE HEADER SECTION */}
        <div className="px-6 pt-8 pb-8 text-center bg-gradient-to-b from-slate-50 via-white to-white rounded-b-[3.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] mx-auto max-w-2xl">
          <div className="relative inline-block group cursor-pointer">
            <div className="absolute -inset-4 bg-dark-blue/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700"></div>
            {student.isScholarship && (
              <div className={`absolute -inset-2 bg-gradient-to-tr ${activeTheme.gradient} rounded-full opacity-60 animate-spin-slow blur-md`}></div>
            )}

            <img
              src={student.pic}
              className="relative w-32 h-32 rounded-[3rem] mx-auto object-cover border-[5px] border-white shadow-2xl ring-1 ring-slate-100 group-hover:scale-105 transition-all duration-500"
              alt={student.nameEN}
            />

            <div className={`absolute -bottom-3 -right-3 ${activeTheme.isPremium ? 'bg-amber-500 text-slate-900 border-amber-300' : `${activeTheme.bg} text-white border-white`} w-10 h-10 rounded-2xl flex items-center justify-center border-[4px] shadow-lg animate-bounce-gentle z-10`}>
              <ThemeIcon size={16} />
            </div>
          </div>

          <div className="mt-6">
            <h2 className={`text-2xl font-black tracking-tighter ${activeTheme.isPremium ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300 drop-shadow-sm' : 'text-slate-800'}`}>
              {student.nameEN}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1 opacity-70">
              <p className="text-slate-500 text-xs font-bold tracking-wide font-khmer">{student.nameKH}</p>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.id.split('-').pop()}</p>
            </div>
          </div>

          {/* Scholarship Badge */}
          {student.isScholarship && (
            <div className={`mt-5 inline-flex flex-col items-center animate-zoom-in`}>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${activeTheme.light} ${activeTheme.isPremium ? 'text-amber-600 border-amber-200 bg-amber-50' : `${activeTheme.color} ${activeTheme.border}`} border shadow-sm rounded-xl`}>
                <Award size={10} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em]">{activeTheme.label}</span>
              </div>
              {activeTheme.subLabel && (
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 bg-slate-100 px-2 py-0.5 rounded-full">{activeTheme.subLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* 2. DYNAMIC LEDGER CARD */}
        <div className="px-4 md:px-0">
          <div onClick={() => setShowPaymentModal(true)} className={`${uiLedger.bg} rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl shadow-current/20 relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform duration-300`}>

            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>

            <LedgerIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-10 rotate-12" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                </div>
                <p className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em]">{membership?.month || 'Loading...'}</p>
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">{uiLedger.title}</h4>
              <p className="text-[11px] text-white/90 font-medium mt-1 opacity-90">{uiLedger.sub}</p>
            </div>

            <div className="relative z-10 w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LedgerIcon size={28} className="drop-shadow-md" />
            </div>
          </div>
        </div>

        {/* 3. RANK & GRADUATION GRID */}
        <div className="px-4 md:px-0 grid grid-cols-2 gap-4">

          <div onClick={() => setShowRankModal(true)} className="col-span-1 bg-[#131950] rounded-[2.5rem] p-6 shadow-xl shadow-[#131950]/20 text-white relative overflow-hidden group cursor-pointer active:scale-95 transition-transform duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[4rem] transition-all duration-500 group-hover:scale-110"></div>
            <Award className="absolute -right-2 -bottom-2 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform duration-700" />

            <div className="absolute top-4 right-4">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white/50"></span>
              </span>
            </div>

            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mb-3 bg-white/10 px-2 py-0.5 rounded w-fit backdrop-blur-sm">Current Rank</p>
            <h4 className="text-xl font-black relative z-10 leading-tight">{student.belt}</h4>
            <div className="inline-flex mt-3 items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/5 hover:bg-white/20 transition-colors">
              <Hand size={10} className="text-blue-200" />
              <p className="text-[8px] text-blue-50 font-bold uppercase tracking-wide">Syllabus</p>
            </div>
          </div>

          <div onClick={() => setShowGradModal(true)} className="col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-colors cursor-pointer active:scale-95 group">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Graduation</p>
              <GraduationCap className="text-slate-200 w-6 h-6 group-hover:text-emerald-400 transition-colors duration-300" />
            </div>
            <div>
              <p className={`text-lg font-black ${isReady ? 'text-emerald-500' : 'text-slate-700'}`}>
                {isReady ? 'ELIGIBLE' : 'SYLLABUS'}
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${isReady ? 'bg-emerald-400' : 'bg-dark-blue'} rounded-full transition-all duration-1000 ease-out`} style={{ width: isReady ? '100%' : '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. DETAILS SECTION */}
        <div className="px-4 md:px-0 space-y-4">
          <div className="flex items-center justify-between ml-2 mb-2 opacity-60">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Student Profile</p>
            <div className="h-px flex-1 bg-slate-200 ml-4"></div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <InfoRow label="Identity ID" value={student.id} icon={Fingerprint} />
            <InfoRow label="Gender" value={student.gender} icon={User} />
            <InfoRow label="Date of Birth" value={student.dob} icon={CalendarCheck} />
            <InfoRow label="Mobile" value={student.phone} icon={Phone} />
            <InfoRow label="Email" value={student.email} icon={Mail} />
            <InfoRow label="Member Since" value={formatDate(student.joinDate)} icon={CalendarCheck} />
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Payment History Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPaymentModal(false)}></div>
          <div className="bg-white w-full md:max-w-2xl md:rounded-[3rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-slide-up-modal flex flex-col max-h-[90vh]">

            <div className="p-8 pb-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Payment History</h2>
                <p className="text-sm text-slate-400 font-bold">Membership Dues Ledger</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Year Selector */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                {availableYears.map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${selectedYear === yr ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {months.map(m => {
                  const status = getPaymentStatus(m);
                  return (
                    <div key={m} className={`relative p-4 rounded-3xl border transition-all duration-300 ${status.paid ? 'bg-emerald-50 border-emerald-100/50' : 'bg-white border-slate-100 grayscale opacity-60'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider mix-blend-multiply">{m.substring(0, 3)}</span>
                        {status.paid ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-400 text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={12} strokeWidth={4} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200"></div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className={`text-lg font-black ${status.paid ? 'text-emerald-900' : 'text-slate-200'}`}>
                          {status.paid ? `$${status.amount}` : '-'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {status.paid ? status.date : 'Unpaid'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 pt-2 bg-gradient-to-t from-white to-transparent text-center">
              <p className="text-[10px] text-slate-400 font-medium">Records are updated manually. Please allow 24-48h for recent payments to appear.</p>
            </div>

          </div>
        </div>
      )}

      {/* Rank Philosophy Modal (Course Syllabus) */}
      {showRankModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowRankModal(false)}></div>

          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-slide-up">
            <div className={`p-8 text-center relative overflow-hidden transition-colors duration-500 ${getBeltColorClass(student.belt)}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100%]"></div>
              <Award className="absolute -left-4 top-4 w-24 h-24 text-white/5 -rotate-12" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                  <Award className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{student.belt}</h3>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.3em] mt-1">Syllabus & Philosophy</p>
              </div>
            </div>

            <div className="p-8 space-y-6 bg-white">
              {!philosophy ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#131950]" /></div>
              ) : (
                <>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <BookOpen size={12} /> Origin Meaning
                    </p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{philosophy.meaning}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#131950] shrink-0">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Spirit Focus</p>
                      <p className="text-sm font-bold text-slate-800">{philosophy.spirit}</p>
                    </div>
                  </div>

                  <div className="relative pl-6 border-l-4 border-[#131950]/20 py-1">
                    <p className="text-sm italic font-serif text-slate-500">{philosophy.quote}</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => navigate('/library')} className="flex-1 py-4 bg-[#131950] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#131950]/20">
                  <BookOpen size={14} /> View Belt Curriculum
                </button>
                <button onClick={() => setShowRankModal(false)} className="w-14 py-4 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95">
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graduation Modal (Simplified Status) */}
      {showGradModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowGradModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center relative z-10 animate-slide-up shadow-2xl">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${student.eligible === 'YES' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
              <GraduationCap size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#131950]">Testing Status</h3>
            <p className="text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
              {student.eligible === 'YES'
                ? "Congratulations! You have met all requirements for the next grading test."
                : "You are currently in training. Focus on your attendance and curriculum mastery."}
            </p>
            <button onClick={() => setShowGradModal(false)} className="w-full py-4 bg-[#131950] text-white rounded-2xl text-xs font-bold active:scale-[0.98] transition-all">Okay, Got it</button>
          </div>
        </div>
      )}

      {/* PAYMENT HISTORY MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPaymentModal(false)}></div>
          <div className="bg-white w-full md:max-w-2xl md:rounded-[3rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-slide-up-modal flex flex-col max-h-[90vh]">

            <div className={`p-8 pb-4 border-b flex justify-between items-center ${activeTheme.isPremium ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <div>
                <h2 className={`text-2xl font-black ${activeTheme.isPremium ? 'text-amber-400' : 'text-slate-800'}`}>Payment History</h2>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${activeTheme.isPremium ? 'text-slate-400' : 'text-slate-400'}`}>Membership Dues Ledger</p>
                  {activeTheme.subLabel && (
                    <span className="text-[10px] font-black uppercase tracking-wide bg-blue-100/50 text-blue-600 px-2 py-0.5 rounded-md">{activeTheme.subLabel}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activeTheme.isPremium ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                {availableYears.map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${selectedYear === yr ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {months.map(m => {
                  const isPrem = activeTheme.isPremium || false;
                  let status = getPaymentStatus(m);

                  // PREMIUM OVERRIDE: Always show as Paid/Free for Premium Themes
                  if (isPrem) {
                    status = { paid: true, amount: 'Free', date: 'Scholarship' };
                  }

                  const isPaid = status.paid;

                  // Dynamic Container Class
                  let containerClass = "bg-white border-slate-100 grayscale opacity-60";
                  if (isPaid) {
                    if (isPrem) {
                      // Use Theme Colors for Premium
                      containerClass = `${activeTheme.light} ${activeTheme.border} shadow-sm`;
                    } else {
                      // Standard Emerald
                      containerClass = "bg-emerald-50 border-emerald-100/50";
                    }
                  }

                  return (
                    <div key={m} className={`relative p-4 rounded-3xl border transition-all duration-300 ${containerClass}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-black uppercase tracking-wider mix-blend-multiply ${isPrem ? 'text-slate-500 mix-blend-normal' : 'text-slate-400'}`}>{m.substring(0, 3)}</span>
                        {isPaid ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${isPrem ? `${activeTheme.bg} text-white` : 'bg-emerald-400 text-white'}`}>
                            {isPrem ? <activeTheme.icon size={10} strokeWidth={2.5} /> : <CheckCircle2 size={12} strokeWidth={4} />}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200"></div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className={`text-lg font-black ${isPaid ? (isPrem ? activeTheme.color : 'text-emerald-900') : 'text-slate-200'}`}>
                          {isPaid && isPrem ? 'COVERED' : (isPaid ? `$${status.amount}` : '-')}
                        </p>
                        <p className={`text-[10px] font-bold ${isPrem ? 'text-slate-500' : 'text-slate-400'}`}>
                          {isPaid ? formatDate(status.date) : 'Unpaid'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 pt-2 bg-gradient-to-t from-white to-transparent text-center">
              <p className="text-[10px] text-slate-400 font-medium">Records are updated manually. Please allow 24-48h for recent payments to appear.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const InfoRow = ({ label, value, icon: Icon }: any) => (
  <div className="group flex items-center gap-5 p-4 bg-white border border-slate-50 rounded-[2rem] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300">
    <div className="w-12 h-12 bg-slate-50 group-hover:bg-white group-hover:text-dark-blue flex items-center justify-center rounded-2xl text-slate-400 transition-colors duration-300">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[9px] uppercase text-slate-400 font-black tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700 mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

export default Home;
