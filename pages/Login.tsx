
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Shield, User, Lock, AlertCircle, Check } from 'lucide-react';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(true); // Default to true for better PWA UX
  const [error, setError] = useState('');
  const { login, isLoading, student } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (student) {
      navigate('/', { replace: true });
    }
  }, [student, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !pass) {
      setError('Please enter both ID and Password');
      return;
    }
    setError('');
    const result = await login(id, pass, remember);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid Student ID or Password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm text-center mb-8 z-10 animate-fade-in">
        <div className="relative inline-block mb-6 group">
          <div className="absolute -inset-6 bg-dark-blue/5 rounded-full blur-xl group-hover:bg-dark-blue/10 transition-colors duration-500"></div>
          <img src="https://drive.google.com/thumbnail?id=1YbDau7zKy6QQO0m9GVhYpNZuCVquTk9A&sz=s700"
            alt="Infinity TKD Logo"
            className="relative w-28 md:w-32 mx-auto drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500" />
        </div>
        <h1 className="text-2xl font-black text-dark-blue tracking-tight mb-1">Welcome Back</h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-wide">Student Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 z-10 animate-slide-up bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50">

        <div className="space-y-4">
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-dark-blue transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Student ID"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:border-dark-blue focus:ring-4 focus:ring-blue-50 text-sm font-semibold placeholder:text-slate-300 text-slate-700 shadow-sm"
            />
          </div>

          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-dark-blue transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:border-dark-blue focus:ring-4 focus:ring-blue-50 text-sm font-semibold placeholder:text-slate-300 text-slate-700 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${remember ? 'bg-dark-blue border-dark-blue' : 'bg-white border-slate-300'}`}>
              {remember && <Check size={10} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-slate-600 transition-colors">Keep me logged in</span>
          </label>
          <a href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide hover:text-dark-blue transition-colors">Help?</a>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl animate-shake">
            <AlertCircle size={16} />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full bg-dark-blue overflow-hidden text-white p-3.5 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 transition-all duration-300 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Sign In'}</span>
          {!isLoading && <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="flex items-center justify-center gap-2 pt-2 opacity-50">
          <Shield size={10} className="text-slate-500" />
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">
            Secure Encryption
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
