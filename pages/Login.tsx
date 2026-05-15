import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Shield, User, Lock, AlertCircle, Check, Fingerprint } from 'lucide-react';

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
 <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black p-4 transition-colors duration-300">
 <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-transparent ">
 
 {/* Header Area */}
 <div className="p-8 pb-6 text-center relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 dark:bg-brand-red/20 rounded-bl-[100%]"></div>
 
 <div className="relative z-10 flex justify-center mb-6">
 <img src="/logo/Red.svg" alt="Infinity TKD" className="w-40 md:w-48 h-auto object-contain hover:scale-105 transition-transform duration-500" />
 </div>
 <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Student Portal</h1>
 <p className="text-sm font-medium text-slate-700 dark:text-slate-400 mt-1 uppercase tracking-widest">Login Access</p>
 </div>

 {/* Form Area */}
 <div className="px-8 pb-8">
 <form onSubmit={handleSubmit} className="space-y-5">
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Identity ID</label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Fingerprint className="h-5 w-5 text-slate-600 dark:text-slate-400" />
 </div>
 <input
 type="text"
 value={id}
 onChange={(e) => setId(e.target.value)}
 placeholder="e.g. INF-2023-123"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-brand-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
 </div>
 <input
 type="password"
 value={pass}
 onChange={(e) => setPass(e.target.value)}
 placeholder="••••••••"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-brand-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
 />
 </div>
 </div>

 <div className="flex items-center justify-between pt-1">
 <label className="flex items-center gap-2 cursor-pointer group">
 <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${remember ? 'bg-brand-red border-brand-red' : 'bg-slate-200 dark:bg-slate-700 border-transparent'}`}>
 {remember && <Check size={10} className="text-white" />}
 </div>
 <input type="checkbox" className="hidden" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide group-hover:text-slate-600 dark:group-hover:text-slate-500 dark:text-slate-300 transition-colors">Keep me logged in</span>
 </label>
 </div>

 {error && (
 <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl animate-shake">
 <AlertCircle size={16} />
 <p className="text-xs font-bold">{error}</p>
 </div>
 )}

 <button
 type="submit"
 disabled={isLoading}
 className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-red/20 transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
 >
 <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
 {!isLoading && <ChevronRight size={16} />}
 </button>
 </form>

 <p className="mt-8 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
 Need access? <button className="text-brand-red hover:underline decoration-2 underline-offset-4">Contact your instructor</button>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Login;
