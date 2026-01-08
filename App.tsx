
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
  Flag,
  Shield,
  Sparkles,
  Zap,
  Target,
  Search,
  Info
} from 'lucide-react';
import { AppState, AnalysisResult, UserPersona } from './types';
import { analyzeMessage } from './services/gemini';
import DoriAssistant from './components/DoriAssistant';
import Sandbox from './components/Sandbox';
import Library from './components/Library';
import ReportScam from './components/ReportScam';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import AboutDori from './components/AboutDori';

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
  },
  {
    id: 's11',
    category: 'TRICK',
    group: 'דחוף',
    title: 'פייסבוק: "זה אתה בתמונה?"',
    content: 'מישהו תייג אותך בסרטון מביך! כולם כבר ראו... צפה בזה כאן לפני שזה נמחק: http://fb-login-view.com/v/9281',
    difficulty: 88,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's2',
    category: 'TRICK',
    group: 'רשמי',
    title: 'חבילה מהדואר מעוכבת',
    content: 'דואר ישראל: החבילה שלך מעוכבת עקב חוסר בכתובת מדויקת. שלם 1.99 ש"ח דמי אכסון בקישור: israel-post-portal.net',
    difficulty: 78,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's17',
    category: 'SAFE',
    group: 'פיננסי',
    title: 'קוד אימות מהבנק',
    content: '928172 הוא קוד האימות שלך לכניסה לחשבון. אל תשתף קוד זה עם איש. הבנק לעולם לא יתקשר לבקש אותו.',
    difficulty: 40,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's3',
    category: 'SAFE',
    group: 'משפחה',
    title: 'נכד אמיתי',
    content: 'היי סבתא! זאת מאיה. רציתי להגיד שאני אוהבת אותך ולשאול אם יש לך את המתכון למרק עוף? נשיקות!',
    difficulty: 5,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('LANDING');
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setState('IDLE');
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
      setState('IDLE');
    }
  };

  const reset = () => {
    setState('IDLE');
    setAnalysisResult(null);
    setInputText('');
  };

  const completeOnboarding = (p: UserPersona) => {
    setPersona(p);
    setState('IDLE');
  };

  if (state === 'LANDING') {
    return <LandingPage onStart={() => setState('ONBOARDING')} onEnterSandbox={() => { handleTextAnalyze(SAMPLES[0].content); }} />;
  }

  if (state === 'ONBOARDING') {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const renderContent = () => {
    switch (state) {
      case 'LIBRARY': return <Library />;
      case 'REPORT': return <ReportScam />;
      case 'ABOUT': return <AboutDori onBack={() => setState('IDLE')} />;
      case 'IDLE':
        return (
          <div className="space-y-12 animate-in fade-in duration-700 text-right" dir="rtl">
            <DoriAssistant message={persona?.familiarity === 'beginner' 
              ? `שלום! אני דורי, המנטור הדיגיטלי שלך. נתקדם צעד אחר צעד. אפשר לסרוק הודעה שאתם לא בטוחים לגביה, או לנסות דוגמה לתרגול. רוצים לדעת מי אני? לחצו על כפתור המידע למטה!` 
              : "מוכנים לשפר את המיומנות הדיגיטלית שלכם? סרקו הודעה חשודה או היכנסו למעבדת התרגול למטה! תמיד אפשר לקרוא עלי עוד בלשונית המידע."} />
            
            {/* Practice Laboverhaul */}
            <div className="space-y-10">
              <div className="flex flex-col gap-1 px-2">
                <h3 className="text-3xl font-brand font-black text-slate-800 flex items-center gap-3 flex-row-reverse">
                  <Target className="text-sky-500" size={32} />
                  מעבדת התרגול של דורי
                </h3>
                <p className="text-base font-medium text-slate-400">למדו לזהות מלכודות דיגיטליות בבטחה.</p>
              </div>

              {/* Categorized Lists */}
              {[
                { label: 'סימולציות הונאה (מלכודות)', items: SAMPLES.filter(s => s.category === 'TRICK'), icon: <AlertTriangle className="text-red-500" /> },
                { label: 'הודעות מאומתות (בטוח)', items: SAMPLES.filter(s => s.category === 'SAFE'), icon: <ShieldCheck className="text-emerald-500" /> }
              ].map((section, idx) => (
                <div key={idx} className="space-y-5">
                  <h4 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400 px-3 flex items-center gap-2 flex-row-reverse">
                    {section.icon} {section.label}
                  </h4>
                  <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x px-2 flex-row-reverse">
                    {section.items.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleTextAnalyze(sample.content)}
                        className={`flex flex-col p-8 rounded-[3rem] border-4 transition-all active:scale-95 text-right h-64 w-80 flex-shrink-0 snap-start shadow-xl relative overflow-hidden group ${sample.color} hover:border-sky-400/30`}
                      >
                        <div className="flex justify-between items-start mb-5 relative z-10 flex-row-reverse">
                          <div className="flex flex-col gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${sample.category === 'TRICK' ? 'bg-red-200/40 text-red-600' : 'bg-emerald-200/40 text-emerald-600'}`}>
                              {sample.group}
                            </span>
                            <div className="flex items-center gap-1.5 flex-row-reverse">
                              <Zap size={14} className={sample.category === 'TRICK' ? 'text-red-500' : 'text-emerald-500'} />
                              <span className="text-[11px] font-black tracking-tight">{sample.difficulty}% רמת תחכום</span>
                            </div>
                          </div>
                          <ChevronLeft size={24} className="opacity-20 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                        </div>
                        <span className="font-brand font-bold text-lg leading-tight mb-3 relative z-10 line-clamp-2">{sample.title}</span>
                        <p className="text-xs opacity-60 line-clamp-3 leading-relaxed font-bold relative z-10">{sample.content}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Scan Tools */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-brand font-black text-slate-800 flex items-center gap-3 px-3 flex-row-reverse">
                    <Camera className="text-sky-600" size={24} /> סריקת צילום מסך
                  </h3>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-4 border-dashed border-sky-100 bg-white rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all group shadow-xl shadow-sky-100/50"
                  >
                    <div className="bg-sky-50 p-8 rounded-full mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Upload className="w-12 h-12 text-sky-600" />
                    </div>
                    <p className="text-slate-800 font-black text-xl">העלאת תמונה</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 tracking-widest uppercase">ניתוח של כל הודעה</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-brand font-black text-slate-800 flex items-center gap-3 px-3 flex-row-reverse">
                    <FileSearch className="text-sky-600" size={24} /> בדיקת טקסט
                  </h3>
                  <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-sky-100/50 border-2 border-slate-50 flex flex-col h-full text-right">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="הדביקו הודעה חשודה כאן..."
                      dir="rtl"
                      className="w-full flex-1 p-6 outline-none resize-none text-slate-700 font-bold bg-slate-50 rounded-[2rem] focus:ring-4 focus:ring-sky-100 transition-all text-lg placeholder:opacity-30"
                    />
                    <button 
                      onClick={() => handleTextAnalyze()}
                      disabled={!inputText.trim()}
                      className="w-full bg-sky-600 text-white font-brand text-xl font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-30 mt-8 shadow-2xl active:scale-95 transition-all flex-row-reverse"
                    >
                      דורי, תבדוק את זה
                      <ArrowLeft size={24} />
                    </button>
                  </div>
               </div>
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
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-brand font-black text-slate-800">דורי בודק את הפרטים...</h2>
              <p className="text-slate-400 text-xl font-black uppercase tracking-[0.2em]">מפענח את המלכודת</p>
            </div>
          </div>
        );
      case 'RESULT':
        return analysisResult && (
          <div className="space-y-12 pb-20 animate-in slide-in-from-bottom-10 text-right" dir="rtl">
            {analysisResult.isScam ? (
              <div className="bg-red-50 border-4 border-red-100 p-12 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="flex items-center gap-8 relative z-10 text-red-600 flex-row-reverse">
                  <div className="bg-red-600 p-5 rounded-[2rem] shadow-xl shadow-red-200">
                    <AlertTriangle className="text-white w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-brand font-black uppercase tracking-tight leading-none">זוהתה הונאה!</h2>
                </div>
                <p className="text-slate-800 font-bold text-2xl leading-relaxed relative z-10">{analysisResult.summary}</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border-4 border-emerald-100 p-12 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="flex items-center gap-8 relative z-10 text-emerald-600 flex-row-reverse">
                  <div className="bg-emerald-600 p-5 rounded-[2rem] shadow-xl shadow-emerald-200">
                    <CheckCircle2 className="text-white w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-brand font-black uppercase tracking-tight leading-none">הודעה בטוחה</h2>
                </div>
                <p className="text-slate-800 font-bold text-2xl leading-relaxed relative z-10">דורי אימת את ההודעה. נראה שאפשר לסמוך עליה לפי מספר סימני בטיחות.</p>
              </div>
            )}

            <div className="space-y-6 px-4">
              <h3 className="text-2xl font-brand font-black text-slate-800 flex items-center gap-4 flex-row-reverse">
                <Sparkles className="text-sky-600" size={32} />
                הממצאים של דורי:
              </h3>
              <div className="grid gap-6">
                {analysisResult.traps.length > 0 ? analysisResult.traps.map(trap => (
                  <div key={trap.id} className="bg-white border-2 border-slate-50 p-8 rounded-[3rem] flex items-start gap-8 shadow-sm hover:border-sky-100 transition-all group flex-row-reverse">
                    <div className={`p-5 rounded-3xl shadow-sm transition-transform group-hover:rotate-12 ${trap.severity === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-slate-800 text-2xl mb-2">{trap.type}</h4>
                      <p className="text-slate-500 font-medium italic text-xl">{trap.reason}</p>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white border-2 border-emerald-50 p-10 rounded-[3rem] flex items-start gap-8 shadow-sm flex-row-reverse">
                    <div className="p-5 rounded-3xl bg-emerald-100 text-emerald-600">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-slate-800 text-2xl mb-2">אימות אמינות</h4>
                      <p className="text-slate-500 font-medium italic text-xl leading-relaxed">לא נמצאו דפוסי הונאה מוכרים. הודעה זו עומדת בתקני בטיחות רשמיים.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-12 border-t-4 border-dotted border-slate-200 space-y-10 px-4">
              <DoriAssistant message={analysisResult.isScam 
                ? "בואו נראה בדיוק איך הטריק הזה עובד. היכנסו למעבדה כדי לחקור אותו בבטחה."
                : "רוצים לראות את סימני הבטיחות שזיהיתי? בואו נחזור עליהם יחד במעבדה."
              } />
              <button 
                onClick={() => setState('SANDBOX')}
                className={`w-full text-white font-brand text-3xl font-black py-10 rounded-[3rem] flex items-center justify-center gap-6 shadow-2xl active:scale-95 transition-all flex-row-reverse ${analysisResult.isScam ? 'bg-slate-800 shadow-slate-200' : 'bg-emerald-600 shadow-emerald-100'}`}
              >
                {analysisResult.isScam ? "כניסה למעבדת התרגול" : "צפייה בסימני הבטיחות"}
                <ChevronLeft size={40} />
              </button>
            </div>
          </div>
        );
      case 'FINISHED':
        return (
          <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="bg-sky-50 p-16 rounded-full border-[20px] border-white shadow-inner">
                <Bird className="w-40 h-40 text-sky-600" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-sky-600 p-10 rounded-[3rem] shadow-2xl text-white">
                <Sparkles size={64} />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-6xl font-brand font-black text-slate-800">כל הכבוד!</h2>
              <p className="text-slate-500 text-3xl font-medium max-w-xl mx-auto">אתם הופכים למקצוענים דיגיטליים. ידע הוא ההגנה הטובה ביותר!</p>
            </div>
            <button onClick={reset} className="px-20 py-8 bg-sky-600 text-white font-brand text-3xl font-black rounded-[3rem] shadow-2xl shadow-sky-200 active:scale-95 transition-all">
              הודעה נוספת לבדיקה
            </button>
          </div>
        );
      default: return null;
    }
  };

  const isMentorActive = ['IDLE', 'ANALYZING', 'RESULT', 'FINISHED', 'SANDBOX'].includes(state);

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-slate-900 max-w-4xl mx-auto shadow-2xl relative pb-40 text-right" dir="rtl">
      <header className="bg-white/90 backdrop-blur-xl px-12 py-12 border-b-2 border-slate-50 sticky top-0 z-40">
        <div className="flex items-center justify-between flex-row-reverse">
          <div className="flex items-center gap-6 flex-row-reverse">
            <div className="bg-sky-600 p-5 rounded-[1.75rem] shadow-2xl shadow-sky-100 ring-8 ring-sky-50">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-brand font-black text-slate-800 leading-none tracking-tight">דורי המנטור</h1>
              <p className="text-sm font-black text-sky-600 uppercase tracking-[0.4em] mt-3">המדריך הדיגיטלי שלך</p>
            </div>
          </div>
          <button onClick={() => setState('LANDING')} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-sky-600 transition-all">
            <RefreshCcw size={32} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-12 overflow-x-hidden">
        {renderContent()}
      </main>

      {state === 'SANDBOX' && analysisResult && (
        <Sandbox result={analysisResult} onClose={() => setState('RESULT')} onFinish={() => setState('FINISHED')} />
      )}

      {/* Persistent Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 flex justify-center pointer-events-none">
        <nav className="bg-white/95 backdrop-blur-2xl border border-slate-100 p-3 flex gap-2 items-center rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] pointer-events-auto flex-row-reverse">
          <button 
            onClick={() => { reset(); setState('IDLE'); }}
            className={`flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${isMentorActive ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Shield size={24} strokeWidth={isMentorActive ? 2.5 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isMentorActive ? 'opacity-100' : 'opacity-60'}`}>שיעורים</span>
          </button>
          <button 
            onClick={() => setState('LIBRARY')}
            className={`flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${state === 'LIBRARY' ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen size={24} strokeWidth={state === 'LIBRARY' ? 2.5 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${state === 'LIBRARY' ? 'opacity-100' : 'opacity-60'}`}>ספריה</span>
          </button>
          <button 
            onClick={() => setState('ABOUT')}
            className={`flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${state === 'ABOUT' ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Info size={24} strokeWidth={state === 'ABOUT' ? 2.5 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${state === 'ABOUT' ? 'opacity-100' : 'opacity-60'}`}>מי זה דורי?</span>
          </button>
          <button 
            onClick={() => setState('REPORT')}
            className={`flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${state === 'REPORT' ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Flag size={24} strokeWidth={state === 'REPORT' ? 2.5 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${state === 'REPORT' ? 'opacity-100' : 'opacity-60'}`}>עזרה</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
