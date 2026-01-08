
import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Bird, 
  RefreshCcw, 
  Camera, 
  FileSearch,
  ChevronRight,
  BookOpen,
  Flag,
  Shield,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { AppState, AnalysisResult } from './types';
import { analyzeMessage } from './services/gemini';
import DoriAssistant from './components/DoriAssistant';
import Sandbox from './components/Sandbox';
import Library from './components/Library';
import ReportScam from './components/ReportScam';

interface Sample {
  id: string;
  category: 'TRICK' | 'SAFE';
  title: string;
  content: string;
  difficulty: number;
  color: string;
}

const SAMPLES: Sample[] = [
  // --- SCAMS (TRICKS) ---
  {
    id: 's1',
    category: 'TRICK',
    title: 'Tax Refund Alert',
    content: 'TAX_AUTH: Your 2024 refund of 2,450 ILS is ready. Claim now at: https://tax-refund-gov.net/claim before it expires.',
    difficulty: 65,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's2',
    category: 'TRICK',
    title: 'Late Package',
    content: 'UPS: Your parcel is on hold due to a missing house number. Pay 1.99 ILS redelivery fee at ups-re-route.me/info',
    difficulty: 82,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's5',
    category: 'TRICK',
    title: 'Amazon Security',
    content: 'Alert: Your Amazon account has been locked. To unlock, verify your identity: http://amazon-security-check.co/login',
    difficulty: 45,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's6',
    category: 'TRICK',
    title: 'Social Security Threat',
    content: 'SSA: Your SSN has been suspended for fraud. Call 1-800-FAKE-HELP immediately or an arrest warrant will be issued.',
    difficulty: 95,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's7',
    category: 'TRICK',
    title: 'Lottery Prize',
    content: 'CONGRATS! You won the $1,000,000 Mega Prize! Send $50 for processing to claim your check today!',
    difficulty: 30,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's11',
    category: 'TRICK',
    title: 'Facebook "Is this you?"',
    content: 'Someone just tagged you in a video. OMG! Is this you?? Check it out before it gets deleted: http://fb-login-view.com/v/9281',
    difficulty: 88,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's12',
    category: 'TRICK',
    title: 'Crypto Investment',
    content: 'Elon Musk is giving away 5,000 Bitcoin! Send 0.1 BTC to this wallet to verify and receive 1.0 BTC back instantly!',
    difficulty: 55,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's13',
    category: 'TRICK',
    title: 'Bank Fraud Call',
    content: 'CHASE BANK: A charge of $899 from "Walmart" is pending. If you did NOT make this, call +1 888 555 0199 NOW.',
    difficulty: 92,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's14',
    category: 'TRICK',
    title: 'Utility Disconnect',
    content: 'FINAL NOTICE: Your electricity will be shut off in 2 hours due to non-payment. Pay now via Bitcoin to avoid disruption.',
    difficulty: 78,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's15',
    category: 'TRICK',
    title: 'Romance Emergency',
    content: '(On WhatsApp) "Hey, it is Mark from the dating site. My wallet was stolen at the airport and I need $200 for a ticket home. Please help!"',
    difficulty: 85,
    color: 'bg-red-50 text-red-700 border-red-100'
  },
  {
    id: 's16',
    category: 'TRICK',
    title: 'Voice Deepfake',
    content: '"Mom? It is me, I am in jail after a car accident. I need $5,000 for bail. Do not tell Dad, just send it to this lawyer..."',
    difficulty: 98,
    color: 'bg-red-50 text-red-700 border-red-100'
  },

  // --- SAFE MESSAGES ---
  {
    id: 's3',
    category: 'SAFE',
    title: 'Grandchild Message',
    content: 'Hi Grandma! It is Maya. Just wanted to say I love you and ask if you have that chicken soup recipe? Talk soon!',
    difficulty: 10,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's4',
    category: 'SAFE',
    title: 'Doctor Reminder',
    content: 'Reminder: You have a dentist appointment tomorrow at 10:00 AM. Please arrive 10 mins early. Reply STOP to opt out.',
    difficulty: 15,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's8',
    category: 'SAFE',
    title: 'Electric Bill',
    content: 'Your Electric Co. bill for March is now available. Log in to your portal at official-utility.com to view. Total: $84.20.',
    difficulty: 25,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's9',
    category: 'SAFE',
    title: 'Coffee Reward',
    content: 'Happy Birthday from Star-Coffee! Enjoy a free drink on us today. Use your app at any location!',
    difficulty: 20,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's10',
    category: 'SAFE',
    title: 'Library Notice',
    content: 'City Library: "The Great Gatsby" is overdue. Please return it by Friday to avoid a $0.50 fine. Thank you!',
    difficulty: 12,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's17',
    category: 'SAFE',
    title: 'Bank Login Code',
    content: '123456 is your one-time verification code for your Bank Login. Do not share this code with anyone. We will never call to ask for it.',
    difficulty: 40,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's18',
    category: 'SAFE',
    title: 'Pharmacy Ready',
    content: 'CVS: Your prescription for LISINOPRIL is ready for pickup at Main St location. Questions? Call 555-0100.',
    difficulty: 18,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's19',
    category: 'SAFE',
    title: 'Zelle Confirmation',
    content: 'You sent $20.00 to Maya Smith. Confirmation: #8271A. View your transaction history in the Bank App.',
    difficulty: 35,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's20',
    category: 'SAFE',
    title: 'Amazon Delivery',
    content: 'Amazon: Your order #114-92 has been delivered to your front door. See a photo of the delivery in the app.',
    difficulty: 22,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's21',
    category: 'SAFE',
    title: 'Church Event',
    content: 'Hi Mary, it is Pastor Dave. Just a reminder about the potluck this Sunday at 12pm. See you there!',
    difficulty: 10,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: 's22',
    category: 'SAFE',
    title: 'Gov Info Alert',
    content: 'FEMA: Severe Thunderstorm Warning in your area until 8:00 PM. Seek shelter and stay tuned to local radio for updates.',
    difficulty: 15,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tricks = SAMPLES.filter(s => s.category === 'TRICK');
  const safe = SAMPLES.filter(s => s.category === 'SAFE');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setState('ANALYZING');
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await analyzeMessage({ data: base64Data, mimeType: file.type });
        setAnalysisResult(result);
        setState('RESULT');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Dori had a little trouble looking at that image. Can you try again?");
      setState('IDLE');
    }
  };

  const handleTextAnalyze = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;
    setState('ANALYZING');
    setError(null);
    try {
      const result = await analyzeMessage(text);
      setAnalysisResult(result);
      setState('RESULT');
    } catch (err) {
      setError("Dori is feeling a bit shy. Could you try sending that message again?");
      setState('IDLE');
    }
  };

  const reset = () => {
    setState('IDLE');
    setInputText('');
    setAnalysisResult(null);
    setError(null);
  };

  const renderContent = () => {
    switch (state) {
      case 'LIBRARY': return <Library />;
      case 'REPORT': return <ReportScam />;
      case 'IDLE':
        return (
          <div className="space-y-12 animate-in fade-in duration-700">
            <DoriAssistant message="Hi there! I'm Dori. I can help you see if a message is a sneaky trap. Just share a screenshot or paste the text below!" />
            
            <div className="space-y-8">
              <div className="flex flex-col gap-1 px-2">
                <h3 className="text-2xl font-brand font-black text-slate-800 flex items-center gap-3">
                  <Target className="text-amber-500" size={24} />
                  Practice Training Lab
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Choose a category to sharpen your safety instincts.</p>
              </div>

              {/* Scams Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Trap Training (Spot the Trick)
                </h4>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x px-2">
                  {tricks.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleTextAnalyze(sample.content)}
                      className={`flex flex-col p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 text-left h-56 w-72 flex-shrink-0 snap-start shadow-sm ${sample.color} hover:shadow-xl hover:border-red-300 relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black uppercase tracking-tighter bg-red-200/50 px-2 py-0.5 rounded-full inline-block w-fit">TRICK</span>
                           <div className="flex items-center gap-1 mt-1">
                              <Zap size={10} className="text-red-600" />
                              <span className="text-[10px] font-black">{sample.difficulty}% Difficulty</span>
                           </div>
                        </div>
                        <ChevronRight size={18} className="opacity-40" />
                      </div>
                      <span className="font-brand font-bold text-base leading-tight mb-2 relative z-10 line-clamp-2">{sample.title}</span>
                      <p className="text-[11px] opacity-70 line-clamp-3 leading-relaxed font-medium relative z-10">{sample.content}</p>
                      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-100/30 rounded-full" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-emerald-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Safety Drills (Verify Real)
                </h4>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x px-2">
                  {safe.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleTextAnalyze(sample.content)}
                      className={`flex flex-col p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 text-left h-56 w-72 flex-shrink-0 snap-start shadow-sm ${sample.color} hover:shadow-xl hover:border-emerald-300 relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black uppercase tracking-tighter bg-emerald-200/50 px-2 py-0.5 rounded-full inline-block w-fit">SAFE</span>
                           <div className="flex items-center gap-1 mt-1">
                              <Shield size={10} className="text-emerald-600" />
                              <span className="text-[10px] font-black">{sample.difficulty}% Trickiness</span>
                           </div>
                        </div>
                        <ChevronRight size={18} className="opacity-40" />
                      </div>
                      <span className="font-brand font-bold text-base leading-tight mb-2 relative z-10 line-clamp-2">{sample.title}</span>
                      <p className="text-[11px] opacity-70 line-clamp-3 leading-relaxed font-medium relative z-10">{sample.content}</p>
                      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-100/30 rounded-full" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-brand font-black text-slate-800 flex items-center gap-3 px-2">
                <Camera className="text-sky-500" size={24} />
                Scan Your Message
              </h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-sky-100 bg-white p-14 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 transition-all hover:bg-sky-50/30 shadow-sm group"
              >
                <div className="bg-sky-50 p-7 rounded-full mb-5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Upload className="w-12 h-12 text-sky-500" />
                </div>
                <p className="text-slate-800 font-black text-center text-xl tracking-tight">Tap to Analyze Screenshot</p>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">(SMS, WhatsApp, Email)</p>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="space-y-4 pb-16">
              <h3 className="text-xl font-brand font-black text-slate-800 flex items-center gap-3 px-2">
                <FileSearch className="text-sky-500" size={24} />
                Paste Raw Text
              </h3>
              <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste message text here..."
                  className="w-full h-28 p-5 outline-none resize-none text-slate-700 font-medium bg-slate-50 rounded-3xl focus:ring-4 focus:ring-sky-100 transition-all text-lg"
                />
                <button 
                  onClick={() => handleTextAnalyze()}
                  disabled={!inputText.trim()}
                  className="w-full bg-sky-500 text-white font-brand text-xl font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-50 transition-all active:scale-[0.98] mt-8 shadow-2xl shadow-sky-100"
                >
                  Analyze for Traps
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'ANALYZING':
        return (
          <div className="h-full flex flex-col items-center justify-center space-y-10 pt-32 animate-in fade-in duration-1000">
            <div className="relative">
              <div className="w-40 h-40 border-[12px] border-sky-50 border-t-sky-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Bird className="w-16 h-16 text-sky-500 animate-bounce" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-brand font-black text-slate-800 tracking-tight">Dori is Investigating...</h2>
              <p className="text-slate-400 text-xl font-bold uppercase tracking-widest">Cross-referencing global trap patterns</p>
            </div>
          </div>
        );
      case 'RESULT':
        return analysisResult && (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500 pb-20">
            {analysisResult.isScam ? (
              <div className="bg-red-50 border-4 border-red-100 p-10 rounded-[3rem] space-y-6 shadow-2xl shadow-red-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full -mr-16 -mt-16" />
                <div className="flex items-center gap-6 text-red-600 relative z-10">
                  <div className="bg-red-600 p-4 rounded-[1.5rem] shadow-xl shadow-red-200">
                    <AlertTriangle className="text-white w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-brand font-black leading-tight uppercase tracking-tight">Watch out!<br/>This is a Scam.</h2>
                </div>
                <p className="text-slate-800 font-bold text-xl leading-relaxed relative z-10">{analysisResult.summary}</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border-4 border-emerald-100 p-10 rounded-[3rem] space-y-6 shadow-2xl shadow-emerald-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full -mr-16 -mt-16" />
                <div className="flex items-center gap-6 text-emerald-600 relative z-10">
                  <div className="bg-emerald-600 p-4 rounded-[1.5rem] shadow-xl shadow-emerald-200">
                    <CheckCircle2 className="text-white w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-brand font-black leading-tight uppercase tracking-tight">Verified Safe!</h2>
                </div>
                <p className="text-slate-800 font-bold text-xl leading-relaxed relative z-10">Dori found multiple safety seals. This message appears legitimate and safe to follow.</p>
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-2xl font-brand font-black text-slate-800 ml-2 flex items-center gap-3">
                <Sparkles className="text-sky-500" size={24} />
                What Dori Spotted:
              </h3>
              <div className="grid gap-5">
                {analysisResult.traps.length > 0 ? analysisResult.traps.map((trap) => (
                  <div key={trap.id} className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-sm hover:border-sky-200 transition-all">
                    <div className={`p-4 rounded-2xl mt-0.5 shadow-sm ${trap.severity === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
                      <AlertTriangle size={28} />
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-slate-800 text-xl mb-1">{trap.type}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed italic text-lg">{trap.reason}</p>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white border-2 border-emerald-50 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-sm">
                    <div className="p-4 rounded-2xl mt-0.5 bg-emerald-100 text-emerald-600 shadow-sm">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-slate-800 text-xl mb-1">Clear Path</h4>
                      <p className="text-slate-500 font-medium leading-relaxed italic text-lg">Checked for known deceptive patterns and phishing domains. Zero risks detected.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-12 border-t-4 border-dotted border-slate-200 space-y-10">
              <DoriAssistant message={analysisResult.isScam 
                ? "Experience the trap without the risk! Step into the Safe Sandbox to see exactly how they would try to trick you."
                : "Curious why I trust this? Enter the Sandbox to learn about the specific 'Green Flags' and safety features I identified!"
              } />
              <button 
                onClick={() => setState('SANDBOX')}
                className={`w-full text-white font-brand text-2xl font-black py-8 rounded-[2.5rem] flex items-center justify-center gap-5 shadow-2xl active:scale-[0.97] transition-all ${analysisResult.isScam ? 'bg-slate-800 shadow-slate-200' : 'bg-emerald-600 shadow-emerald-100'}`}
              >
                {analysisResult.isScam ? "Enter Scam Simulator" : "Explore Safety Features"}
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        );
      case 'FINISHED':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-16 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="bg-green-100 p-12 rounded-full border-[15px] border-green-50 shadow-inner">
                <Bird className="w-32 h-32 text-green-600" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-sky-500 p-6 rounded-[2rem] shadow-2xl text-white">
                <Shield size={40} />
              </div>
            </div>
            <div className="space-y-4 px-6">
              <h2 className="text-5xl font-brand font-black text-slate-800 tracking-tight">Mission Success!</h2>
              <p className="text-slate-500 text-2xl font-medium leading-relaxed max-w-lg mx-auto">
                You've completed this safety lesson. Every simulation makes your real-world instincts sharper!
              </p>
            </div>
            <button 
              onClick={reset}
              className="px-16 py-6 bg-sky-500 text-white font-brand text-2xl font-black rounded-[2rem] shadow-2xl shadow-sky-200 active:scale-95 transition-all"
            >
              Protect Another One
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfe] text-slate-900 max-w-2xl mx-auto shadow-[0_0_100px_rgba(0,0,0,0.08)] relative pb-32">
      <header className="bg-white/90 backdrop-blur-xl px-10 py-10 border-b border-slate-50 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-sky-500 p-4 rounded-[1.5rem] shadow-2xl shadow-sky-100 ring-4 ring-sky-50">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-brand font-black text-slate-800 leading-none tracking-tight">Dori Shield</h1>
              <p className="text-xs font-black text-sky-500 uppercase tracking-[0.3em] mt-2">Personal Bodyguard</p>
            </div>
          </div>
          {(state === 'RESULT' || state === 'FINISHED' || state === 'LIBRARY' || state === 'REPORT' || state === 'SANDBOX') && (
            <button onClick={reset} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-sky-500 transition-all active:rotate-180 duration-500">
              <RefreshCcw size={26} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-10 overflow-x-hidden">
        {renderContent()}
      </main>

      {state === 'SANDBOX' && analysisResult && (
        <Sandbox result={analysisResult} onClose={() => setState('RESULT')} onFinish={() => setState('FINISHED')} />
      )}

      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <nav className="max-w-xl mx-auto bg-white/95 backdrop-blur-2xl border-2 border-slate-100 p-4 flex justify-around items-center rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] pointer-events-auto">
          <button 
            onClick={() => { reset(); setState('IDLE'); }}
            className={`flex flex-col items-center gap-2 px-8 py-4 rounded-[2rem] transition-all duration-300 ${['IDLE', 'ANALYZING', 'RESULT', 'FINISHED', 'SANDBOX'].includes(state) ? 'bg-sky-50 text-sky-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Shield size={26} />
            <span className="text-[11px] font-black uppercase tracking-widest">Shield</span>
          </button>
          <button 
            onClick={() => setState('LIBRARY')}
            className={`flex flex-col items-center gap-2 px-8 py-4 rounded-[2rem] transition-all duration-300 ${state === 'LIBRARY' ? 'bg-sky-50 text-sky-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen size={26} />
            <span className="text-[11px] font-black uppercase tracking-widest">Library</span>
          </button>
          <button 
            onClick={() => setState('REPORT')}
            className={`flex flex-col items-center gap-2 px-8 py-4 rounded-[2rem] transition-all duration-300 ${state === 'REPORT' ? 'bg-sky-50 text-sky-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Flag size={26} />
            <span className="text-[11px] font-black uppercase tracking-widest">Report</span>
          </button>
        </nav>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
