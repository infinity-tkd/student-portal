import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, X } from 'lucide-react';
import { secureStorage } from '../services/secureStorage';

const BirthdayModal: React.FC = () => {
  const { student } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!student?.dob) return;

    // Check if today is birthday
    const isBirthday = (dob: string) => {
      const today = new Date();
      let date = new Date(dob);
      
      // Handle DD/MM/YYYY if standard parse fails
      if (isNaN(date.getTime())) {
        const parts = dob.split(/[-/]/);
        if (parts.length === 3) {
          // Assume DD/MM/YYYY
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }

      if (isNaN(date.getTime())) return false;

      return date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
    };

    if (isBirthday(student.dob)) {
      // Check if we already showed it this year
      const year = new Date().getFullYear().toString();
      const lastShown = window.localStorage.getItem(`bday_shown_${student.id}`);
      
      if (lastShown !== year) {
        // Delay popup slightly for surprise effect
        const timer = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [student]);

  const handleClose = () => {
    setShow(false);
    const year = new Date().getFullYear().toString();
    window.localStorage.setItem(`bday_shown_${student?.id}`, year);
  };

  if (!show || !student) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in" 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white dark:bg-brand-black rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden animate-zoom-in border border-slate-200 dark:border-white/10 text-center transform hover:scale-[1.02] transition-transform duration-500">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-red/20 rounded-full blur-[60px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-brand-black dark:hover:text-white transition-colors z-10"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center relative animate-bounce-gentle border border-red-100 dark:border-red-500/20 shadow-xl shadow-red-500/10">
          <Gift size={36} className="text-brand-red" />
          <div className="absolute -top-2 -right-2 text-2xl animate-shake">🎉</div>
        </div>

        {/* Text */}
        <h2 className="text-2xl md:text-3xl font-black text-brand-black dark:text-white mb-2 leading-tight tracking-tight">
          Happy Birthday,<br />
          <span className="text-brand-red">{student.name.split(' ')[0]}!</span>
        </h2>
        
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Wishing you an amazing day and another fantastic year of growth, strength, and success on and off the mats!
        </p>

        {/* Button */}
        <button 
          onClick={handleClose}
          className="w-full py-4 bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red dark:hover:bg-brand-red dark:hover:text-white transition-colors duration-300 shadow-xl shadow-brand-black/20 dark:shadow-white/10 active:scale-95"
        >
          Thank You!
        </button>

      </div>
      
      {/* Simple Confetti using CSS standard layout tricks - optional, but let's keep it purely elegant with the bounce-gentle and pulse. */}
    </div>
  );
};

export default BirthdayModal;
