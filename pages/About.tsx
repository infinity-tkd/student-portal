import React, { useState, useEffect } from 'react';
import { Shield, Book, MapPin, Mail, ChevronRight, X, Heart, Download, Smartphone, Laptop, Share, PlusSquare, MoreVertical, Globe } from 'lucide-react';

const About: React.FC = () => {
  const [modalType, setModalType] = useState<'rules' | 'conduct' | 'download' | null>(null);
  const [device, setDevice] = useState<'ios' | 'android' | 'pc'>('pc');

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) {
      setDevice('ios');
    } else if (/Android/.test(ua)) {
      setDevice('android');
    } else {
      setDevice('pc');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setModalType('download'); // Fallback to instructions
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const ModalContent = () => {
    if (!modalType) return null;

    if (modalType === 'download') {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
          <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col border border-slate-100 animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-50 sticky top-0 bg-white z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <Download size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Install App</h3>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wide">Add to your Home Screen</p>
                </div>
              </div>
              <button onClick={() => setModalType(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex gap-2 mb-8 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                {(['ios', 'android', 'pc'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-wide transition-all flex items-center justify-center gap-2 ${device === d ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {d === 'ios' && <Smartphone size={14} />}
                    {d === 'android' && <Smartphone size={14} />}
                    {d === 'pc' && <Laptop size={14} />}
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="space-y-8 animate-fade-in" key={device}>
                {device === 'ios' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                      <p className="text-sm font-bold text-blue-800 leading-relaxed text-center">Open this site in Safari on your iPhone/iPad for the best experience.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><Share size={20} className="text-blue-500" /></div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">Step 1</p>
                          <p className="text-xs text-slate-500 mt-1">Tap the <span className="font-bold">Share</span> button in Safari's bottom toolbar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><PlusSquare size={20} className="text-blue-500" /></div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">Step 2</p>
                          <p className="text-xs text-slate-500 mt-1">Scroll down and tap <span className="font-bold">"Add to Home Screen"</span>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {device === 'android' && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
                      <p className="text-sm font-bold text-emerald-800 leading-relaxed">Chrome on Android makes installation easy.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><MoreVertical size={20} className="text-emerald-500" /></div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">Step 1</p>
                          <p className="text-xs text-slate-500 mt-1">Tap the <span className="font-bold">Menu</span> button (three dots) in Chrome.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><Download size={20} className="text-emerald-500" /></div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">Step 2</p>
                          <p className="text-xs text-slate-500 mt-1">Select <span className="font-bold">"Install app"</span> or <span className="font-bold">"Add to Home screen"</span>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {device === 'pc' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">Available for Desktop on Chrome, Edge, or Safari.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0"><Download size={20} className="text-slate-800" /></div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">Installation</p>
                          <p className="text-xs text-slate-500 mt-1">Look for the <span className="font-bold">Install</span> icon in your browser's address bar or menu.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const isRules = modalType === 'rules';

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
        <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col border border-slate-100 animate-slide-up">
          <div className="flex items-center justify-between p-6 border-b border-slate-50 sticky top-0 bg-white rounded-t-[2.5rem] z-20">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isRules ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {isRules ? <Shield size={24} /> : <Book size={24} />}
              </div>
              <h3 className="text-xl font-black text-slate-800">{isRules ? 'Dojang Rules' : 'Code of Conduct'}</h3>
            </div>
            <button onClick={() => setModalType(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 hover:rotate-90 transition-all"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {isRules ? (
              <div className="space-y-8 text-slate-600">
                <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center">
                  <p className="text-lg font-bold text-blue-800 italic leading-relaxed">"Precision in Poomsae. Power in Demonstration. Respect in Every Motion."</p>
                </div>
                <section>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm border-b pb-3 mb-4">1. Respect & Etiquette</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">Bow to the flags and instructor when entering and leaving the dojang.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">Address all instructors and black belts as "Sir" or "Ma'am".</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">Treat fellow students with courtesy. Senior students must help juniors.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm border-b pb-3 mb-4">2. Behavior & Attitude</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed font-bold text-slate-700">Zero tolerance for bad language, profanity, or disrespect.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">No bad behavior, bullying, or aggressive conduct inside or outside the dojang.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">Demonstrate self-control and patience. Control your temper at all times.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm border-b pb-3 mb-4">3. Training Standards</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">Arrive 10 minutes early to prepare mentally and physically.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">Keep your uniform (dobok) clean. No jewelry or watches during class.</span>
                    </li>
                  </ul>
                </section>
              </div>
            ) : (
              <div className="space-y-8 text-slate-600">
                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">Five Tenets of Taekwondo</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Courtesy', 'Integrity', 'Perseverance', 'Self-Control', 'Indomitable Spirit'].map(v => (
                      <span key={v} className="px-4 py-2 bg-white rounded-xl text-sm font-bold shadow-sm text-emerald-700 border border-emerald-100">{v}</span>
                    ))}
                  </div>
                </div>
                <section>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm border-b pb-3 mb-4">Integrity & Honor</h4>
                  <p className="mb-4 text-sm leading-relaxed">Students must be honest in sparring, testing, and interactions. Never cheat, lie, or disrespect officials, even in the heat of competition.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm border-b pb-3 mb-4">Community</h4>
                  <p className="mb-4 text-sm leading-relaxed">We are a family. Senior students must look after juniors, and juniors must respect the experience of seniors. Bullying is strictly prohibited.</p>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="animate-slide-up pb-20 md:p-4">
        <div className="text-center pt-8 pb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-6 bg-dark-blue/5 rounded-full blur-2xl"></div>
            <img src="https://drive.google.com/thumbnail?id=1YbDau7zKy6QQO0m9GVhYpNZuCVquTk9A&sz=s700" alt="Logo" className="relative w-36 mx-auto drop-shadow-xl" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Student Portal v2.4</p>
        </div>

        <div className="max-w-xl mx-auto px-6 mb-12 text-center">
          <p className="text-sm text-slate-500 leading-loose font-medium">
            "Empowering the next generation through the traditional martial art of Taekwondo, fostering discipline, strength, and unwavering respect."
          </p>
        </div>

        <div className="px-4 md:px-0 max-w-xl mx-auto mb-10 space-y-4">
          <button onClick={() => setModalType('rules')} className="group w-full bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-center gap-5 text-left relative overflow-hidden active:scale-[0.98]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Shield size={28} /></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-800">Dojang Rules</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Safety & Etiquette Protocols</p>
            </div>
            <div className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all relative z-10"><ChevronRight size={20} /></div>
          </button>

          <button onClick={() => setModalType('conduct')} className="group w-full bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all flex items-center gap-5 text-left relative overflow-hidden active:scale-[0.98]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm relative z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Book size={28} /></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-800">Code of Conduct</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Core Values & Behavior</p>
            </div>
            <div className="ml-auto text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all relative z-10"><ChevronRight size={20} /></div>
          </button>

          <a href="https://infinity-tkd-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="group w-full bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-violet-100 transition-all flex items-center gap-5 text-left relative overflow-hidden active:scale-[0.98]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-violet-50 rounded-bl-[100px] -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100 shadow-sm relative z-10 group-hover:bg-violet-600 group-hover:text-white transition-colors"><Globe size={28} /></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-800">Visit Website</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Official Infinity TKD Site</p>
            </div>
            <div className="ml-auto text-slate-300 group-hover:text-violet-500 group-hover:translate-x-2 transition-all relative z-10"><ChevronRight size={20} /></div>
          </a>

          <button onClick={handleInstallClick} className="group w-full bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-center gap-5 text-left relative overflow-hidden active:scale-[0.98]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Download size={28} /></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-800">Download App</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Install on Mobile or Desktop</p>
            </div>
            <div className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all relative z-10"><ChevronRight size={20} /></div>
          </button>
        </div>

        <div className="mx-4 md:mx-auto max-w-xl bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-dark-blue shadow-sm shrink-0 border border-slate-100"><MapPin size={20} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Ground</p>
              <p className="text-sm font-bold text-slate-800 mt-1">Olympic Stadium, Phnom Penh</p>
            </div>
          </div>
          <div className="w-full h-px bg-slate-200"></div>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-dark-blue shadow-sm shrink-0 border border-slate-100"><Mail size={20} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Team</p>
              <a href="mailto:infinity.tkd.kh@gmail.com" className="text-sm font-bold text-slate-800 mt-1 hover:text-blue-600 transition-colors">infinity.tkd.kh@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-red-500" /> by Gravzero Team
          </p>
        </div>
      </div>

      {modalType && <ModalContent />}
    </>
  );
};

export default About;