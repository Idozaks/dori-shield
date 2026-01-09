
import React, { useEffect, useState } from 'react';
import { ShieldCheck, ChevronLeft, Menu, X, CheckCircle, Volume2, Smartphone, Gamepad2, Users, ArrowLeft, Sparkles, Heart, ShieldAlert, PhoneCall, Landmark, Gift, Info, MessageCircle, Send, Handshake, Target } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onEnterSandbox: () => void;
}

const SCAM_PREVIEWS = [
  { title: "הנכד בצרות", icon: <Heart size={24} className="text-pink-500" /> },
  { title: "חבילה מהדואר", icon: <ShieldAlert size={24} className="text-orange-500" /> },
  { title: "תמיכה טכנית", icon: <PhoneCall size={24} className="text-blue-500" /> },
  { title: "הודעת בנק", icon: <Landmark size={24} className="text-sky-600" /> },
  { title: "זכייה בלוטו", icon: <Gift size={24} className="text-amber-500" /> },
  { title: "ביטוח לאומי", icon: <Info size={24} className="text-blue-400" /> },
  { title: "הונאת רומנטיקה", icon: <MessageCircle size={24} className="text-red-400" /> },
  { title: "תשלום ב-Bit", icon: <Send size={24} className="text-sky-500" /> },
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onEnterSandbox }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden text-right" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 py-6 px-10 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm translate-y-0' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-row-reverse">
          <div className="flex items-center gap-4 cursor-pointer group flex-row-reverse">
            <div className="bg-sky-600 p-3 rounded-2xl shadow-lg transition-transform group-hover:rotate-12">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-3xl font-black tracking-tight text-slate-800 font-brand leading-none">דורי המנטור</span>
                <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em] mt-2">אימון ואמון</span>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-row-reverse">
            <button className="text-slate-800 p-2 hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={36} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-[60] p-10 flex flex-col items-end space-y-10 animate-in slide-in-from-right duration-300">
             <button className="text-slate-800 self-start" onClick={() => setIsMenuOpen(false)}>
               <X size={40} />
             </button>
             <div className="space-y-8 text-right w-full pt-10">
               <a href="#features" className="block text-4xl font-brand font-black hover:text-sky-600" onClick={() => setIsMenuOpen(false)}>יכולות</a>
               <a href="#scams" className="block text-4xl font-brand font-black hover:text-sky-600" onClick={() => setIsMenuOpen(false)}>איומים נפוצים</a>
               <a href="#how-it-works" className="block text-4xl font-brand font-black hover:text-sky-600" onClick={() => setIsMenuOpen(false)}>איך זה עובד</a>
               <button onClick={() => { onStart(); setIsMenuOpen(false); }} className="w-full bg-sky-600 text-white px-6 py-8 rounded-3xl font-brand font-black text-2xl mt-10">מתחילים עכשיו</button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20 relative z-10">
          <div className="flex-1 space-y-10 text-center lg:text-right animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-sm">
              <Sparkles size={18} /> אימון ואמון דיגיטלי
            </div>
            <h1 className="text-6xl lg:text-9xl font-black leading-[1] text-slate-800 font-brand">
              בונים <span className="text-sky-600">אמון</span> <br />
              דרך <span className="text-emerald-500">אימון.</span>
            </h1>
            <p className="text-2xl lg:text-3xl text-slate-500 max-w-2xl mx-auto lg:mr-0 leading-relaxed font-medium">
              דורי המנטור מעניק לכם את הביטחון לגלוש ללא פחד. אנחנו מאמינים שאימון נכון בסביבה בטוחה בונה את האמון האישי שלכם ברשת.
            </p>
            <div className="flex justify-center lg:justify-start pt-6">
              <button onClick={onStart} className="bg-[#0083cc] text-white px-20 py-8 rounded-[2.5rem] text-3xl font-black shadow-2xl hover:bg-[#0072b0] transition-all flex items-center justify-center gap-4 active:scale-95 group">
                <ChevronLeft size={40} className="group-hover:-translate-x-2 transition-transform" />
                מתחילים אימון
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-xl animate-fade-in-up stagger-2">
            <div className="aspect-[4/5] bg-slate-50 rounded-[5rem] relative border-4 border-slate-100 p-10 shadow-inner overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center animate-bounce-slow">
                <div className="w-80 h-[600px] bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(30,41,59,0.2)] border-[12px] border-slate-900 overflow-hidden relative">
                  <div className="bg-[#0083cc] h-16 flex items-center justify-center border-b-4 border-black/10">
                    <ShieldCheck className="text-white w-8 h-8" />
                  </div>
                  <div className="p-8 space-y-8 text-right">
                    <div className="bg-sky-50 p-6 rounded-[2rem] border-2 border-sky-100 shadow-sm relative animate-float">
                      <p className="text-[12px] font-black text-sky-600 uppercase tracking-widest mb-2">אימון אישי</p>
                      <p className="text-sm text-sky-800 font-bold leading-relaxed">בואו נבדוק יחד למה הקישור הזה נראה חשוד. האימון הזה יעזור לכם מחר.</p>
                      <div className="absolute -bottom-2 right-10 w-4 h-4 bg-sky-50 border-r-2 border-b-2 border-sky-100 rotate-45" />
                    </div>
                    <div className="space-y-4 pt-4">
                      <div className="h-5 bg-slate-100 rounded-full w-full animate-pulse"></div>
                      <div className="h-5 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
                      <div className="h-5 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                    <div className="aspect-square bg-slate-50 rounded-[3rem] flex items-center justify-center flex-col gap-4 border-4 border-dashed border-slate-200 mt-10">
                      <div className="p-4 bg-white rounded-full shadow-md">
                        <Handshake className="text-sky-500 w-10 h-10" />
                      </div>
                      <span className="text-[12px] text-sky-500 font-black uppercase tracking-widest text-center leading-tight">אמון<br/>דיגיטלי</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of Landing Page Sections... */}
      <section id="scams" className="py-32 px-10 bg-sky-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-slate-800 font-brand">אתגרי אימון</h2>
            <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">כל אימון כאן בונה את חומת ההגנה האישית שלכם בעולם הדיגיטלי.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {SCAM_PREVIEWS.map((scam, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[3rem] border-4 border-transparent hover:border-sky-200 hover:shadow-2xl transition-all group flex flex-col items-center text-center gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] group-hover:bg-sky-50 transition-colors shadow-sm">
                  {scam.icon}
                </div>
                <span className="font-brand font-black text-xl text-slate-800">{scam.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 py-40 px-10 text-center border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="bg-sky-600 inline-flex p-8 rounded-[2.5rem] shadow-2xl ring-[12px] ring-sky-50 animate-bounce-slow">
            <ShieldCheck className="text-white w-16 h-16" />
          </div>
          <h2 className="text-6xl md:text-9xl font-black text-slate-800 tracking-tight font-brand leading-none">
            אימון ואמון <br /> לכל החיים.
          </h2>
          <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-relaxed">הצטרפו לאלפי משתמשים שכבר התאמנו ובנו לעצמם אמון דיגיטלי עם דורי.</p>
          <div className="pt-10">
            <button onClick={onStart} className="bg-[#0083cc] text-white px-24 py-10 rounded-[3rem] text-4xl font-black shadow-[0_30px_60px_rgba(2,132,199,0.3)] hover:bg-[#0072b0] transition-all hover:scale-105 active:scale-95 flex items-center gap-6 mx-auto group flex-row-reverse">
              מתחילים עכשיו <ArrowLeft size={48} className="group-hover:-translate-x-3 transition-transform" />
            </button>
          </div>
          <div className="pt-32 text-xs font-black uppercase tracking-[0.4em] opacity-30">
            <p>© 2026 דורי המנטור — אימון ואמון דיגיטלי.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
