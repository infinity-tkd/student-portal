
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarRange, ClipboardList, Medal, GitMerge, Youtube, Info, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isLibrary = location.pathname === '/library';

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col lg:flex-row font-sans text-slate-800">

      {/* --- DESKTOP SIDEBAR (Slimmer & Modern) --- */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 z-50 bg-[#0f143c] text-white/80 overflow-hidden shadow-2xl transition-all duration-300 border-r border-white/5">

        {/* Glow Effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Brand */}
        <div className="relative p-6 pt-8 pb-8 z-10" onClick={() => navigate('/')}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-white text-lg">I</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg text-white leading-none tracking-tight group-hover:text-blue-200 transition-colors">Infinity<span className="text-blue-500">TKD</span></h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar relative z-10">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-2">Menu</p>
          <SidebarItem path="/" icon={LayoutDashboard} label="Dashboard" isActive={isActive('/')} onClick={() => navigate('/')} />
          <SidebarItem path="/events" icon={CalendarRange} label="Events" isActive={isActive('/events')} onClick={() => navigate('/events')} />
          <SidebarItem path="/attendance" icon={ClipboardList} label="Attendance" isActive={isActive('/attendance')} onClick={() => navigate('/attendance')} />
          <SidebarItem path="/achievements" icon={Medal} label="Awards" isActive={isActive('/achievements')} onClick={() => navigate('/achievements')} />
          <SidebarItem path="/belt" icon={GitMerge} label="Journey" isActive={isActive('/belt')} onClick={() => navigate('/belt')} />
          <SidebarItem path="/library" icon={Youtube} label="Library" isActive={isActive('/library')} onClick={() => navigate('/library')} />
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 relative z-10 mb-2">
          <div className="h-px w-full bg-white/5 mb-4"></div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 w-full text-left transition-all text-slate-400 hover:text-red-400 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold tracking-wide">Secure Logout</span>
          </button>
          <button onClick={() => navigate('/about')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 w-full text-left transition-all text-slate-500 hover:text-white mt-1">
            <Info size={18} />
            <span className="text-xs font-bold tracking-wide">About App</span>
          </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 min-h-screen relative flex flex-col w-full overflow-x-hidden">

        {/* Mobile Header (Clean) */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-3 pt-safe flex justify-between items-center transition-all">
          <div className="flex items-center gap-2" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-dark-blue flex items-center justify-center text-white font-black text-sm">I</div>
            <span className="font-black tracking-tight text-dark-blue text-lg">Infinity</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/about')} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 active:scale-95 transition-all">
              <Info size={18} strokeWidth={2.5} />
            </button>
            <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all">
              <LogOut size={18} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 mx-auto w-full transition-all duration-500 ease-out ${isLibrary ? 'max-w-[1920px] p-0 md:p-6' : 'max-w-4xl lg:max-w-7xl p-0 md:p-8'}`}>
          <div className="pb-28 md:pb-0 min-h-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation (Floating Island Style) */}
        <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <nav className="bg-[#131950]/90 backdrop-blur-xl rounded-[2rem] px-5 py-3 shadow-2xl shadow-blue-900/30 flex items-center gap-1 pointer-events-auto border border-white/10 max-w-sm w-full justify-between">
            <MobileNavItem path="/" icon={LayoutDashboard} isActive={isActive('/')} onClick={() => navigate('/')} />
            <MobileNavItem path="/events" icon={CalendarRange} isActive={isActive('/events')} onClick={() => navigate('/events')} />
            <MobileNavItem path="/attendance" icon={ClipboardList} isActive={isActive('/attendance')} onClick={() => navigate('/attendance')} />
            <MobileNavItem path="/achievements" icon={Medal} isActive={isActive('/achievements')} onClick={() => navigate('/achievements')} />
            <MobileNavItem path="/belt" icon={GitMerge} isActive={isActive('/belt')} onClick={() => navigate('/belt')} />
            <MobileNavItem path="/library" icon={Youtube} isActive={isActive('/library')} onClick={() => navigate('/library')} />
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowLogoutModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center relative z-10 animate-slide-up shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 shadow-sm">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Sign Out?</h3>
            <p className="text-sm text-slate-500 mt-2 mb-8 leading-relaxed font-medium">
              Are you sure you want to log out of your student portal?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Desktop Sidebar Item - Minimal & Clean
const SidebarItem = ({ path, icon: Icon, label, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-3.5 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 relative ${isActive
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
      : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform ${isActive ? 'scale-100' : 'group-hover:scale-110'}`} />
    <span className={`text-xs tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

// Mobile Bottom Nav Item - Icon Only, High Contrast
const MobileNavItem = ({ path, icon: Icon, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`relative p-2 rounded-full transition-all duration-300 ${isActive ? 'text-white bg-white/20 -translate-y-2 scale-110 shadow-lg' : 'text-slate-400 hover:text-white active:scale-90'}`}
  >
    <Icon size={20} strokeWidth={isActive ? 3 : 2} />
    {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>}
  </button>
);

export default Layout;
