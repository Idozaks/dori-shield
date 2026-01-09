
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowRight, User, Lock, CheckCircle2, Loader2, Image as ImageIcon, Search, AlertTriangle, Target, Handshake, Fingerprint } from 'lucide-react';
import DoriAssistant from './DoriAssistant';
import { AnalysisResult, SimulationField, SimulationStep } from '../types';
import { generateSandboxImage } from '../services/gemini';

interface SandboxProps {
  result: AnalysisResult;
  onClose: () => void;
  onFinish: () => void;
}

const Sandbox: React.FC<SandboxProps> = ({ result, onClose, onFinish }) => {
  const [isChangingStep, setIsChangingStep] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [touchedItems, setTouchedItems] = useState<Record<string, string[]>>({});
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentStep = result.simulation.steps[currentStepIdx] || result.simulation.steps[0];
  const itemsFoundInCurrentStep = touchedItems[currentStep.id] || [];
  
  const interactiveElements = result.isScam 
    ? [...currentStep.fields.filter(f => f.isTrap), ...(currentStep.urlIsTrap ? [{id: 'url-trap'}] : [])]
    : [...currentStep.fields, {id: 'url-trap'}];

  const totalRequired = interactiveElements.length;

  useEffect(() => {
    const fetchBg = async () => {
      setIsImgLoading(true);
      const img = await generateSandboxImage(result.simulation.visualVibePrompt);
      if (img) setBgImage(img);
      setIsImgLoading(false);
    };
    fetchBg();
  }, [result.simulation.visualVibePrompt]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const markItemChecked = (id: string) => {
    const currentList = touchedItems[currentStep.id] || [];
    if (!currentList.includes(id)) {
      setTouchedItems(prev => ({
        ...prev,
        [currentStep.id]: [...currentList, id]
      }));
    }
  };

  const handleFieldClick = (field: SimulationField) => {
    markItemChecked(field.id);
    if (field.isTrap) {
      if (navigator.vibrate) navigator.vibrate(200);
      setVibrate(true);
      setTimeout(() => setVibrate(false), 500);
    }
  };

  const handleUrlClick = () => {
    markItemChecked('url-trap');
    if (currentStep.urlIsTrap) {
      if (navigator.vibrate) navigator.vibrate(200);
      setVibrate(true);
      setTimeout(() => setVibrate(false), 500);
    }
  };

  const getHeaderBg = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-600', orange: 'bg-orange-500', red: 'bg-red-600',
      emerald: 'bg-emerald-600', slate: 'bg-slate-700', indigo: 'bg-indigo-600'
    };
    return colors[color.toLowerCase()] || 'bg-slate-800';
  };

  const isStepComplete = itemsFoundInCurrentStep.length >= totalRequired;
  const isFinalStep = currentStepIdx === result.simulation.steps.length - 1;

  const nextStep = () => {
    if (isFinalStep) onFinish();
    else {
      setIsChangingStep(true);
      setTimeout(() => {
        setCurrentStepIdx(prev => prev + 1);
        setIsChangingStep(false);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 800);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col bg-slate-50 overflow-hidden ${vibrate ? 'shake' : ''}`}>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 transition-opacity duration-1000 bg-slate-900"
          style={{ opacity: bgImage ? 1 : 0.8 }}
        >
          {bgImage && (
            <img 
              src={bgImage} 
              alt=""
              className="w-full h-[140%] object-cover object-center brightness-[0.4] blur-[1px]"
              style={{ transform: `translateY(${-scrollY * 0.1}px)` }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80" />
      </div>

      {isImgLoading && !bgImage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md text-white/70 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 animate-pulse">
          <ImageIcon size={12} />
          דורי מכין עבורכם את פינת התרגול...
        </div>
      )}

      {isChangingStep && (
        <div className="absolute inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-sky-400 animate-spin mb-4" />
          <p className="font-brand font-bold text-white text-lg tracking-wide">עוברים לשלב הבא של האימון...</p>
        </div>
      )}

      {/* Control Header */}
      <div className="relative z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-xl flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse text-right">
          <div className={`${result.isScam ? 'bg-sky-500' : 'bg-emerald-500'} p-2 rounded-xl shadow-lg`}>
            {result.isScam ? <Search className="w-4 h-4 text-white" /> : <ShieldCheck className="w-4 h-4 text-white" />}
          </div>
          <div className="flex flex-col">
            <h2 className="text-white font-brand text-xs font-bold uppercase tracking-widest leading-none">
              {result.isScam ? 'מוצאים רמזים' : 'בודקים אמינות'}
            </h2>
            <span className="text-slate-400 text-[9px] font-black uppercase mt-1">
              שלב {currentStepIdx + 1} מתוך {result.simulation.steps.length}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="bg-white/10 text-white text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">סגירה</button>
      </div>

      {/* URL Bar */}
      <div className="relative z-20 px-4 py-4 flex-shrink-0">
        <div 
          onClick={handleUrlClick}
          className={`rounded-[1.5rem] px-5 py-4 flex flex-col transition-all duration-300 border shadow-2xl relative cursor-pointer group text-right ${
            itemsFoundInCurrentStep.includes('url-trap') 
              ? (currentStep.urlIsTrap ? 'bg-amber-500/20 border-amber-400' : 'bg-green-500/20 border-green-400')
              : 'bg-white/10 border-white/20 ring-4 ring-sky-400/10 animate-pulse hover:border-sky-400/50'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden flex-row-reverse">
            <div className={`p-1.5 rounded-lg ${itemsFoundInCurrentStep.includes('url-trap') ? (currentStep.urlIsTrap ? 'bg-amber-500' : 'bg-green-500') : 'bg-white/10'}`}>
              <Lock size={12} className="text-white" />
            </div>
            <span className={`text-sm font-mono truncate tracking-tight ${itemsFoundInCurrentStep.includes('url-trap') ? (currentStep.urlIsTrap ? 'text-amber-200' : 'text-green-200') : 'text-white/80'}`}>
              {currentStep.siteUrl}
            </span>
          </div>
          {itemsFoundInCurrentStep.includes('url-trap') && (
            <div className="mt-3 bg-black/30 p-3 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${currentStep.urlIsTrap ? 'text-amber-400' : 'text-green-400'}`}>
                {currentStep.urlIsTrap ? 'זוהה סימן מחשיד' : 'כתובת מאומתת'}
              </p>
              <p className="text-xs text-white/90 font-medium leading-relaxed">
                {currentStep.urlIsTrap ? currentStep.urlDoriWarning : currentStep.urlSafetyReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col pt-4 no-scrollbar text-right"
        dir="rtl"
      >
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 mb-32">
          {/* Instruction Message */}
          {itemsFoundInCurrentStep.length === 0 && (
            <div className="bg-sky-600 text-white p-6 rounded-[2.5rem] shadow-2xl mb-8 flex items-center gap-5 animate-bounce stagger-1 border-4 border-white/20 relative z-50">
              <div className="bg-white/20 p-4 rounded-3xl">
                <Fingerprint className="w-10 h-10" />
              </div>
              <div className="flex-1 text-right">
                <p className="font-brand font-black text-2xl leading-tight mb-1">בואו נתחיל באימון!</p>
                <p className="text-sm font-bold opacity-95">לחצו על כל חלק בהודעה שלמטה. דורי יסביר לכם מה נראה מחשיד או מה נחשב לבטוח.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            <div className={`${getHeaderBg(currentStep.headerColor)} px-8 py-10 text-white flex justify-between items-center flex-shrink-0 relative overflow-hidden flex-row-reverse`}>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16" />
              <div className="relative z-10 flex flex-col">
                <span className="font-brand font-bold tracking-wider uppercase text-xl">{result.simulation.brandName}</span>
                <span className="text-[10px] opacity-80 font-black uppercase tracking-[0.2em] mt-1">{currentStep.subtitle}</span>
              </div>
              <User size={28} className="opacity-80 relative z-10" />
            </div>

            <div className="p-8 space-y-10">
              <div className="space-y-3 text-right">
                <h1 className="text-3xl font-black text-slate-800 leading-tight">{currentStep.title}</h1>
                <div className="h-1.5 w-16 bg-slate-100 rounded-full mr-0 ml-auto"></div>
              </div>

              <div className="space-y-6">
                {currentStep.fields.map((field) => (
                  <div 
                    key={field.id}
                    onClick={() => handleFieldClick(field)}
                    className={`group relative p-6 border-2 rounded-[2rem] transition-all transform active:scale-[0.98] cursor-pointer ${
                      itemsFoundInCurrentStep.includes(field.id)
                        ? (field.isTrap ? 'border-amber-400 bg-amber-50' : 'border-green-400 bg-green-50 shadow-inner')
                        : 'border-slate-100 bg-slate-50 hover:border-sky-300 ring-4 ring-transparent hover:ring-sky-50 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2 flex-row-reverse">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                      {itemsFoundInCurrentStep.includes(field.id) && (
                        field.isTrap ? <AlertTriangle size={18} className="text-amber-500" /> : <ShieldCheck size={18} className="text-green-500" />
                      )}
                    </div>
                    
                    <div className="text-lg font-bold text-slate-700 min-h-[1.5rem] flex items-center justify-end">
                      {field.type === 'button' ? (
                        <div className={`w-full py-5 rounded-2xl text-center uppercase font-black text-sm tracking-[0.2em] shadow-sm transition-all ${itemsFoundInCurrentStep.includes(field.id) ? (field.isTrap ? 'bg-amber-500 text-white shadow-lg' : 'bg-green-500 text-white shadow-lg') : 'bg-white border-2 border-slate-100 text-slate-600'}`}>
                          {field.label}
                        </div>
                      ) : (
                        <span className={field.placeholder ? 'text-slate-300 italic' : ''}>{field.placeholder || 'לחצו כאן לבדיקה...'}</span>
                      )}
                    </div>

                    {itemsFoundInCurrentStep.includes(field.id) && (field.doriWarning || field.safetyReason) && (
                      <div className={`mt-5 p-5 bg-white rounded-2xl border-2 shadow-xl animate-in slide-in-from-top-4 ${field.isTrap ? 'border-amber-100' : 'border-green-100'}`}>
                        <div className="flex items-center gap-2 mb-2 flex-row-reverse text-right">
                           {field.isTrap ? <AlertTriangle size={18} className="text-amber-500" /> : <ShieldCheck size={18} className="text-green-500" />}
                           <p className={`text-[10px] font-black uppercase tracking-widest ${field.isTrap ? 'text-amber-600' : 'text-green-600'}`}>
                             {field.isTrap ? "זוהה סימן מחשיד" : "סימן אמינות"}
                           </p>
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{field.isTrap ? field.doriWarning : field.safetyReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-50 text-right">
                <DoriAssistant 
                  message={itemsFoundInCurrentStep.length === 0 ? "הדרך הכי טובה ללמוד היא להתנסות. לחצו על כל חלק בהודעה שמעליי וגלו מה דורי מצא עבורכם." : 
                           isStepComplete ? `עבודה נהדרת! סיימתם לבדוק את הדף הזה. אפשר לעבור לשלב הבא כשנוח לכם.` :
                           `מצאתם ${itemsFoundInCurrentStep.length} רמזים מתוך ${totalRequired}. אתם הופכים למומחים דיגיטליים!`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="relative z-30 bg-slate-900 px-6 py-6 pb-12 border-t border-white/5 flex justify-between items-center flex-shrink-0 shadow-2xl flex-row-reverse">
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
            {result.isScam ? 'סימנים שזוהו' : 'סימני אמינות'}
          </span>
          <div className="flex gap-2 items-center flex-row-reverse">
            {Array.from({ length: totalRequired }).map((_, i) => (
              <div key={i} className={`h-2.5 w-6 rounded-full transition-all duration-500 ${itemsFoundInCurrentStep.length > i ? (result.isScam ? 'bg-sky-500' : 'bg-green-500') : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
        
        <button 
          onClick={nextStep}
          disabled={!isStepComplete}
          className={`px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all flex-row-reverse ${
            isStepComplete ? 'bg-sky-500 text-white shadow-2xl shadow-sky-500/30 active:scale-95' : 'bg-slate-800 text-slate-600 border border-slate-700 opacity-50'
          }`}
        >
          {isFinalStep ? 'סיום האימון' : 'לשלב הבא'}
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Sandbox;
