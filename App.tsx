
import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Bird, 
  RefreshCcw, 
  Camera, 
  FileSearch,
  ChevronLeft,
  BookOpen,
  Shield,
  Sparkles,
  Zap,
  Target,
  Search,
  Handshake,
  Fingerprint,
  Lightbulb,
  ShieldAlert,
  Menu,
  Phone,
  Mic,
  MessageSquareText
} from 'lucide-react';
import { AppState, AnalysisResult, UserPersona } from './types';
import { analyzeMessage } from './services/gemini';
import DoriAssistant from './components/DoriAssistant';
import Sandbox from './components/Sandbox';
import Library from './components/Library';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import AboutDori from './components/AboutDori';
import DoriChatbot from './components/DoriChatbot';
import BodyguardMode from './components/BodyguardMode';

interface Sample {
  id: string;
  category: 'TRICK' | 'SAFE';
  group: 'פיננסי' | 'דחוף' | 'משפחה' | 'רשמי';
  title: string;
  content: string;
  difficulty: number;
  color: string;
}

const SAMPLES: Sample[] = [
  {
    id: 's16',
    category: 'TRICK',
    group: 'משפחה',
    title: 'הנכד בצרות (זיוף קולי)',
    content: '"סבתא? זה אני, אני במעצר אחרי תאונה. אני צריך 5,000 ש"ח לערבות. אל תספרי לאבא, פשוט תעבירי לזיהוי הזה בביט..."',
    difficulty: 98,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's13',
    category: 'TRICK',
    group: 'פיננסי',
    title: 'אזהרת הונאה מהבנק',
    content: 'בנק לאומי: חיוב על סך 899.00 ש"ח ב"Walmart.com" ממתין לאישור. אם לא ביצעת זאת, לחץ כאן לביטול מיידי.',
    difficulty: 92,
    color: 'bg-red-50 text-red-700 border-red-100'
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('LANDING');
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPracticeActive = state === 'IDLE';
  const isScannerActive = state === 'SCANNER' || state === 'ANALYZING' || state === 'RESULT';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setState('ANALYZING');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await analyzeMessage({ data: base64Data, mimeType: file.type }, persona || undefined);
        setAnalysisResult(result);
        setState('RESULT');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("דורי התקשה לסרוק את התמונה. נסו שוב?");
      setState('SCANNER');
    }
  };

  const handleTextAnalyze = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;
    setState('ANALYZING');
    try {
      const result = await analyzeMessage(text, persona || undefined);
      setAnalysisResult(result);
      setState('RESULT');
    } catch (err) {
      setError("דורי קצת מתבייש... נסו שוב?");
      setState('SCANNER');
    }
  };

  const reset = () => {
    setState('SCANNER');
    setAnalysisResult(null);
    setInputText('');
  };

  const completeOnboarding = (p: UserPersona) => {
    setPersona(p);
    setState('SCANNER');
  };

  if (state === 'LANDING') {
    return <LandingPage onStart={() => setState('ONBOARDING')} onEnterSandbox={() => { setState('IDLE'); }} />;
  }

  if (state === 'ONBOARDING') {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const renderContent = () => {
    switch (state) {
      case 'LIBRARY': return <Library />;
      case 'ABOUT': return <AboutDori onBack={() => setState('SCANNER')} />;
      case 'SCANNER':
        return (
          <div className="space-y-12 animate-in fade-in duration-700 text-right" dir="rtl">
            <DoriAssistant message="מוכנים לבדיקה? העלו צילום מסך של הודעה חשודה או הדביקו טקסט. אני אנתח את המבנה והתוכן כדי לתת לכם שקט נפשי." />
            
            <div className="flex flex-col gap-10">
               <div className="space-y-4">
                  <h3 className="text-2xl font-brand font-black text-slate-800 flex items-center gap-3 px-3 flex-row-reverse text-right">
                    <Camera className="text-red-500" size={28} /> סריקת צילום מסך
                  </h3>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video sm:aspect-square w-full max-w-xl mx-auto border-4 border-dashed border-red-200 bg-red-50/20 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all group shadow-sm"
                  >
                    <div className="bg-white p-8 rounded-full mb-5 shadow-xl transition-transform group-hover:scale-110">
                      <Upload className="w-16 h-16 text-red-500" />
                    </div>
                    <p className="text-slate-800 font-black text-2xl">העלאת תמונה</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-2xl font-brand font-black text-slate-800 flex items-center gap-3 px-3 flex-row-reverse text-right">
                    <FileSearch className="text-red-500" size={28} /> בדיקת טקסט חופשי
                  </h3>
                  <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-red-100/50 border-2 border-slate-50 flex flex-col text-right max-w-xl mx-auto w-full">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="הדביקו את תוכן ההודעה כאן..."
                      dir="rtl"
                      className="w-full p-6 outline-none resize-none text-slate-700 font-bold bg-slate-50 rounded-[2rem] focus:ring-4 focus:ring-red-100 transition-all text-xl placeholder:opacity-30 min-h-[150px]"
                    />
                    <button 
                      onClick={() => handleTextAnalyze()}
                      disabled={!inputText.trim()}
                      className="w-full bg-red-600 text-white font-brand text-2xl font-black py-7 rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-30 mt-8 shadow-2xl active:scale-95 transition-all flex-row-reverse"
                    >
                      דורי, בוא נבדוק את זה
                      <ArrowLeft size={28} />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'IDLE':
        return (
          <div className="space-y-12 animate-in fade-in duration-700 text-right" dir="rtl">
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4 flex-row-reverse">
                   <div className="bg-white/20 p-4 rounded-3xl">
                     <Lightbulb className="w-10 h-10" />
                   </div>
                   <h2 className="text-4xl font-brand font-black">פינת התרגול של דורי</h2>
                 </div>
                 <p className="text-xl font-medium leading-relaxed opacity-90 max-w-2xl">
                   כאן אנחנו בונים את ה"שריר הדיגיטלי" שלכם בסביבה בטוחה לגמרי. 
                 </p>
               </div>
            </div>

            <div className="space-y-10">
              {[
                { label: 'הודעות חשודות לתרגול', items: SAMPLES.filter(s => s.category === 'TRICK'), icon: <AlertTriangle className="text-amber-500" /> },
                { label: 'הודעות בטוחות לאימות', items: SAMPLES.filter(s => s.category === 'SAFE'), icon: <ShieldCheck className="text-emerald-500" /> }
              ].map((section, idx) => (
                <div key={idx} className="space-y-5">
                  <h4 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400 px-3 flex items-center gap-2 flex-row-reverse text-right">
                    {section.icon} {section.label}
                  </h4>
                  <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x px-2 flex-row-reverse">
                    {section.items.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleTextAnalyze(sample.content)}
                        className={`flex flex-col p-8 rounded-[3rem] border-4 transition-all active:scale-95 text-right h-72 w-80 flex-shrink-0 snap-start shadow-xl relative overflow-hidden group ${sample.color} hover:border-sky-400/30`}
                      >
                        <span className="font-brand font-bold text-xl leading-tight mb-3 relative z-10 line-clamp-2">{sample.title}</span>
                        <p className="text-sm opacity-70 line-clamp-3 leading-relaxed font-bold relative z-10">{sample.content}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ANALYZING':
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000">
            <div className="relative">
              <div className="w-48 h-48 border-[12px] border-sky-50 border-t-sky-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Bird className="w-20 h-20 text-sky-600 animate-bounce" />
              </div>
            </div>
            <h2 className="text-4xl font-brand font-black text-slate-800">דורי מנתח עבורכם...</h2>
          </div>
        );
      case 'RESULT':
        return analysisResult && (
          <div className="space-y-12 pb-20 animate-in slide-in-from-bottom-10 text-right" dir="rtl">
            <div className={`p-12 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden border-4 ${analysisResult.isScam ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-8 relative z-10 flex-row-reverse">
                  <div className={`${analysisResult.isScam ? 'bg-amber-600' : 'bg-emerald-600'} p-5 rounded-[2rem] shadow-xl`}>
                    {analysisResult.isScam ? <AlertTriangle className="text-white w-12 h-12" /> : <CheckCircle2 className="text-white w-12 h-12" />}
                  </div>
                  <h2 className={`text-4xl font-brand font-black uppercase tracking-tight leading-none ${analysisResult.isScam ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {analysisResult.isScam ? 'זוהו סימנים חשודים!' : 'הודעה בטוחה'}
                  </h2>
                </div>
                <p className="text-slate-800 font-bold text-2xl leading-relaxed relative z-10 text-right">{analysisResult.summary}</p>
            </div>
            <div className="pt-12 border-t-4 border-dotted border-slate-200 space-y-10 px-4 text-center">
              <button onClick={() => setState('SANDBOX')} className="w-full bg-slate-800 text-white font-brand text-3xl font-black py-10 rounded-[3rem] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all flex-row-reverse">
                התחלת הדמיה לימודית
                <ChevronLeft size={40} />
              </button>
            </div>
          </div>
        );
      case 'FINISHED':
        return (
          <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in duration-500">
            <h2 className="text-6xl font-brand font-black text-slate-800">כל הכבוד!</h2>
            <p className="text-slate-500 text-3xl font-medium max-w-xl mx-auto">סיימתם תרגול חשוב.</p>
            <button onClick={() => setState('SCANNER')} className="px-20 py-8 bg-red-600 text-white font-brand text-3xl font-black rounded-[3rem] shadow-2xl active:scale-95 transition-all">
              בדיקת הודעה חדשה
            </button>
          </div>
        );
      case 'LIVE_CONSULTATION':
        return <BodyguardMode onClose={() => setState('SCANNER')} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-slate-900 max-w-4xl mx-auto shadow-2xl relative pb-40 text-right" dir="rtl">
      <header className="bg-white/90 backdrop-blur-xl px-12 py-10 border-b-2 border-slate-50 sticky top-0 z-40">
        <div className="flex items-center justify-between flex-row-reverse">
          <div className="flex items-center gap-6 flex-row-reverse text-right">
            <div className="bg-sky-600 p-3 rounded-[1.25rem] shadow-2xl shadow-sky-100 ring-4 ring-sky-50">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-brand font-black text-slate-800 leading-none tracking-tight">דורי המנטור</h1>
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.4em] mt-2">אימון ואמון</p>
            </div>
          </div>
          <button 
            onClick={() => setState('LIVE_CONSULTATION')} 
            className="bg-red-600 text-white p-3.5 rounded-2xl flex items-center gap-2 font-brand font-black hover:bg-red-700 transition-all shadow-lg active:scale-95 flex-row-reverse"
            title="שיחה קולית עם דורי"
          >
            <Mic size={22} />
            <span className="text-sm">עזרה קולית</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-x-hidden">
        {renderContent()}
      </main>

      {/* Subtle Floating Mic Button - The "Bodyguard" activation point */}
      <div className="fixed bottom-32 right-10 z-[100]">
        <button 
          onClick={() => setState('LIVE_CONSULTATION')}
          className="bg-red-600 text-white p-4 rounded-full shadow-[0_15px_35px_rgba(220,38,38,0.3)] hover:scale-110 active:scale-90 transition-all group relative border-4 border-white"
        >
          <Mic size={28} />
          <div className="absolute -top-10 right-0 bg-slate-800 text-white text-[9px] px-3 py-1.5 rounded-xl font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            דורי, אפשר עזרה רגע?
          </div>
        </button>
      </div>

      <DoriChatbot currentAppState={state} persona={persona} />

      {state === 'SANDBOX' && analysisResult && (
        <Sandbox result={analysisResult} onClose={() => setState('RESULT')} onFinish={() => setState('FINISHED')} />
      )}

      {/* Fixed Footer Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-10 py-4 z-50 flex items-center justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex-row-reverse">
        <button onClick={() => { reset(); setState('SCANNER'); }} className={`flex flex-col items-center gap-1 transition-all ${isScannerActive ? 'text-red-600' : 'text-slate-300'}`}>
          <ShieldAlert size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">בדיקה</span>
        </button>
        <button onClick={() => setState('LIBRARY')} className={`flex flex-col items-center gap-1 transition-all ${state === 'LIBRARY' ? 'text-slate-800' : 'text-slate-300'}`}>
          <BookOpen size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">ספריה</span>
        </button>
        <button onClick={() => setState('IDLE')} className={`flex flex-col items-center gap-1 transition-all ${isPracticeActive ? 'text-slate-800' : 'text-slate-300'}`}>
          <Target size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">תרגול</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
