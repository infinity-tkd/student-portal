import React, { useState } from 'react';
import { useData, useAuth } from '../context/AuthContext';
import { Promotion } from '../types';
import { Star, CheckCircle, Award, Share2, Download, X, AlertCircle, Copy, Loader2, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/date';

const BeltHistory: React.FC = () => {
  const { data } = useData();
  const history = data?.history || [];
  const [selectedCert, setSelectedCert] = useState<Promotion | null>(null);
  const [imgError, setImgError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [shareModalCert, setShareModalCert] = useState<Promotion | null>(null);

  // --- ACTIONS ---
  const handleShare = (cert: Promotion) => {
    if (!cert.certificateFileId) return;
    setShareModalCert(cert);
  };

  const handleDownload = (fileId: string) => {
    // Open direct download link
    window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
  };

  // --- STYLING HELPERS ---
  const getBeltStyle = (beltName: string) => {
    // ... (rest of function unchanged, just need to ensure this logic is inside the component)
    const b = (beltName || "").toLowerCase();

    // Default Base (White)
    const base = {
      cardBg: "bg-white",
      cardBorder: "border-slate-100",
      shadow: "shadow-slate-200/50",
      theme: "white",
      text: "text-slate-800", subtext: "text-slate-400",
      accent: "bg-slate-200",
      gradient: "from-slate-100 to-slate-200", dot: "bg-slate-300",
      pill: "bg-slate-50 text-slate-500 border-slate-100"
    };

    if (b.includes("yellow")) return {
      ...base,
      theme: "yellow",
      cardBg: "bg-yellow-50",
      cardBorder: "border-yellow-200",
      text: "text-amber-900", subtext: "text-amber-600/70",
      accent: "bg-yellow-400",
      gradient: "from-yellow-400 to-amber-500", dot: "bg-amber-300",
      pill: "bg-white/60 text-amber-700 border-yellow-200"
    };
    if (b.includes("green")) return {
      ...base,
      theme: "green",
      cardBg: "bg-emerald-50",
      cardBorder: "border-emerald-200",
      text: "text-emerald-900", subtext: "text-emerald-600/70",
      accent: "bg-emerald-500",
      gradient: "from-emerald-400 to-green-600", dot: "bg-emerald-300",
      pill: "bg-white/60 text-emerald-700 border-emerald-200"
    };
    if (b.includes("blue")) return {
      ...base,
      theme: "blue",
      cardBg: "bg-blue-50",
      cardBorder: "border-blue-200",
      text: "text-blue-900", subtext: "text-blue-600/70",
      accent: "bg-blue-600",
      gradient: "from-blue-500 to-indigo-600", dot: "bg-blue-300",
      pill: "bg-white/60 text-blue-700 border-blue-200"
    };
    if (b.includes("red")) return {
      ...base,
      theme: "red",
      cardBg: "bg-rose-50",
      cardBorder: "border-rose-200",
      text: "text-rose-900", subtext: "text-rose-600/70",
      accent: "bg-rose-600",
      gradient: "from-red-500 to-rose-700", dot: "bg-rose-300",
      pill: "bg-white/60 text-rose-700 border-rose-200"
    };
    if (b.includes("brown")) return {
      ...base,
      theme: "brown",
      cardBg: "bg-[#fffaf5]",
      cardBorder: "border-orange-200",
      text: "text-orange-900", subtext: "text-orange-700/70",
      accent: "bg-orange-700",
      gradient: "from-orange-600 to-amber-800", dot: "bg-orange-600",
      pill: "bg-white/60 text-orange-800 border-orange-200"
    };
    if (b.includes("black")) return {
      ...base,
      theme: "black",
      cardBg: "bg-slate-900",
      cardBorder: "border-slate-800",
      text: "text-white", subtext: "text-slate-400",
      accent: "bg-slate-800",
      gradient: "from-slate-700 to-black", dot: "bg-slate-600",
      pill: "bg-slate-800 text-slate-300 border-slate-700"
    };

    return base;
  };
  // ... existing renderer
  return (
    <div className="animate-slide-up pb-24 md:p-4 min-h-screen">

      {/* HEADER */}
      <div className="px-4 md:px-0 mb-8 pt-4 md:pt-0">
        <h1 className="text-2xl font-black text-[#131950] tracking-tight">Belt Journey <span className="text-amber-500">.</span></h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mt-1">Path to Black Belt Mastery</p>
      </div>

      {/* EMPTY STATE ERROR HANDLING */}
      {history.length === 0 ? (
        <div className="px-4 md:px-0">
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Award className="text-slate-300" size={32} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">No History Found</h3>
            <p className="text-slate-400 text-xs mt-2">Your promotion history will appear here once you begin your testing journey.</p>
          </div>
        </div>
      ) : (
        <div className="relative mx-4 md:mx-0 md:px-4 max-w-3xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent"></div>

          <div className="space-y-6">
            {history.map((promo, idx) => {
              const s = getBeltStyle(promo.rank);
              const hasCert = !!promo.certificateFileId;

              return (
                <div
                  key={idx}
                  className="group relative flex items-stretch gap-4 animate-slide-in-right"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >

                  {/* Timeline Node */}
                  <div className="relative z-10 flex flex-col items-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-white border-[4px] border-white shadow-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ring-1 ring-slate-50`}>
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-inner`}>
                        <Star size={10} className="text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => hasCert && !promo.certificateId?.includes('PENDING') && setSelectedCert(promo)}
                    className={`flex-1 ${s.cardBg} border ${s.cardBorder} rounded-xl p-5 relative overflow-hidden transition-all duration-300 ${hasCert ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : 'opacity-90 grayscale-[0.1]'} ${s.shadow}`}
                  >

                    {/* Watermark */}
                    <Award className={`absolute -right-4 -bottom-4 w-24 h-24 ${s.theme === 'black' ? 'text-white/5' : 'text-slate-900/5'} -rotate-12 pointer-events-none`} />

                    <div className="flex justify-between items-start mb-1 relative z-10">
                      <div>
                        <h3 className={`text-lg font-black ${s.text} tracking-tight`}>{promo.rank}</h3>
                        <p className={`text-[10px] font-bold ${s.subtext} tracking-wide uppercase`}>Promoted: {formatDate(promo.date)}</p>
                      </div>

                      {/* Result Badge */}
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border shadow-sm backdrop-blur-sm ${s.pill}`}>
                        {promo.result === 'Pass' || promo.result === 'Double' ? <CheckCircle size={10} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>}
                        <span className="text-[9px] font-black tracking-wide uppercase">{promo.result}</span>
                      </div>
                    </div>

                    {/* Cert Status / Action */}
                    <div className="mt-auto pt-4 relative z-10">
                      {hasCert ? (
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${s.theme === 'black' ? 'text-blue-300' : 'text-blue-600'} group-hover:underline decoration-2 underline-offset-4`}>
                          <ExternalLink size={12} />
                          View Certificate
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${s.subtext} opacity-60`}>
                          <Loader2 size={12} className={promo.result === 'Pending' ? 'animate-spin' : ''} />
                          {promo.result === 'Pending' ? 'Processing...' : 'No Certificate'}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHARE MODAL OVERLAY */}
      {shareModalCert && (
        <ShareModal cert={shareModalCert} onClose={() => setShareModalCert(null)} />
      )}

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={() => setSelectedCert(null)}></div>

          <div className="bg-white w-full max-w-[95vw] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-slide-up flex flex-col h-[85vh] md:h-[90vh]">

            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{selectedCert.rank} Certificate</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {selectedCert.certificateId || '---'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate Preview area */}
            <div className="bg-slate-100 p-4 md:p-8 flex-1 flex items-center justify-center overflow-hidden relative">
              {!imgError ? (
                <img
                  src={`https://drive.google.com/thumbnail?id=${selectedCert.certificateFileId}&sz=w1600`}
                  alt="Certificate"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  onError={() => setImgError(true)}
                  onLoad={() => setImgError(false)}
                />
              ) : (
                <div className="text-center p-8">
                  <AlertCircle size={40} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Image Unavailable</p>
                  <p className="text-[10px] text-slate-400 mt-1">We couldn't load the preview. Try downloading it.</p>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t border-slate-50">
              <button
                onClick={() => selectedCert.certificateFileId && handleDownload(selectedCert.certificateFileId)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wide hover:bg-slate-200 transition-colors active:scale-95"
              >
                <Download size={16} />
                Download
              </button>

              <button
                onClick={() => handleShare(selectedCert)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#131950] text-white text-xs font-black uppercase tracking-wide hover:bg-blue-900 transition-colors active:scale-95 relative overflow-hidden"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default BeltHistory;

// --- SHARE MODAL COMPONENT (Internal) ---
const ShareModal: React.FC<{
  cert: Promotion;
  onClose: () => void;
}> = ({ cert, onClose }) => {
  const [copied, setCopied] = useState(false);
  const url = `https://drive.google.com/uc?export=view&id=${cert.certificateFileId}`;
  const text = `Check out my ${cert.rank} Belt promotion certificate from Infinity Taekwondo!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: 'facebook' | 'telegram' | 'whatsapp' | 'messenger' | 'instagram' | 'tiktok') => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'messenger':
        shareUrl = `fb-messenger://share/?link=${encodedUrl}&app_id=2914438852201018`; // App ID is generic
        // Fallback for desktop messenger
        if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
          shareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=2914438852201018&redirect_uri=${encodedUrl}`;
        }
        break;
      case 'instagram':
        // Instagram doesn't have a share URL. We copy to clipboard then open Instagram.
        handleCopy();
        window.open('https://www.instagram.com/', '_blank');
        return;
      case 'tiktok':
        // TikTok doesn't have a share URL. We copy to clipboard then open TikTok.
        handleCopy();
        window.open('https://www.tiktok.com/', '_blank');
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cert.rank} Belt Certificate`,
          text: text,
          url: url
        });
      } catch (err) {
        // Cancelled
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 relative z-10 animate-slide-up shadow-2xl">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Share Certificate</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Link Copy Section */}
        <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 mb-6 border border-slate-100">
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Certificate Link</p>
            <p className="text-xs text-slate-600 truncate font-mono select-all">{url}</p>
          </div>
          <button
            onClick={handleCopy}
            className={`p-2.5 rounded-lg transition-all active:scale-95 shrink-0 ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-4 mb-6">
          <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Facebook</span>
          </button>

          <button onClick={() => handleSocialShare('messenger')} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#00B2FF]/10 flex items-center justify-center text-[#00B2FF] group-hover:bg-[#00B2FF] group-hover:text-white transition-all shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.302 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.258 14.83l-3.078-3.28-6.007 3.28 6.607-7.016 3.078 3.28 6.007-3.28-6.607 7.016z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Messenger</span>
          </button>

          <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">WhatsApp</span>
          </button>

          <button onClick={() => handleSocialShare('telegram')} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9] group-hover:bg-[#229ED9] group-hover:text-white transition-all shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Telegram</span>
          </button>

          <button onClick={() => handleSocialShare('instagram')} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#E4405F]/10 flex items-center justify-center text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white transition-all shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Instagram</span>
          </button>

          <button onClick={() => handleSocialShare('tiktok')} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.62.77-5.3 2.79-7.05 1.35-1.15 3.13-1.82 4.92-1.83 0 1.41-.01 2.82-.01 4.22-.88-.01-1.77.21-2.5.73-.82.58-1.37 1.51-1.47 2.52-.14 1.06.23 2.14.99 2.9.72.71 1.73 1.11 2.74 1.01 1.17-.11 2.22-.84 2.68-1.92.29-.62.39-1.32.35-2.01V.02z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">TikTok</span>
          </button>

          <button onClick={handleNativeShare} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200 transition-all shadow-sm border border-slate-200">
              <Share2 size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-500">More</span>
          </button>
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full py-4 text-center text-slate-500 font-bold border-t border-slate-100 uppercase text-xs hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
