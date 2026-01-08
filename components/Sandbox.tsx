
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, User, Lock, ChevronDown, CheckCircle2, Loader2, Info, Image as ImageIcon, Shield } from 'lucide-react';
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
  
  // Interactive elements are either just the traps (Scam Mode) or everything (Safe Mode)
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
      {/* 1. Parallax Background Layer */}
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
          Dori is painting the scene...
        </div>
      )}

      {isChangingStep && (
        <div className="absolute inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-sky-400 animate-spin mb-4" />
          <p className="font-brand font-bold text-white text-lg tracking-wide">Next Lesson Loading...</p>
        </div>
      )}

      {/* Dori Control Header */}
      <div className="relative z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-xl">
        <div className="flex items-center gap-3">
          <div className={`${result.isScam ? 'bg-amber-500' : 'bg-green-500'} p-2 rounded-xl shadow-lg`}>
            {result.isScam ? <AlertCircle className="w-4 h-4 text-white" /> : <ShieldCheck className="w-4 h-4 text-white" />}
          </div>
          <div className="flex flex-col">
            <h2 className="text-white font-brand text-xs font-bold uppercase tracking-widest leading-none">
              {result.isScam ? 'Trap Finder' : 'Safety Check'}
            </h2>
            <span className="text-slate-400 text-[9px] font-black uppercase mt-1">
              Step {currentStepIdx + 1} of {result.simulation.steps.length}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="bg-white/10 text-white text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Exit</button>
      </div>

      {/* Browser URL Bar */}
      <div className="relative z-20 px-4 py-4 flex-shrink-0">
        <div 
          onClick={handleUrlClick}
          className={`rounded-[1.5rem] px-5 py-4 flex flex-col transition-all duration-300 border shadow-2xl relative cursor-pointer group ${
            itemsFoundInCurrentStep.includes('url-trap') 
              ? (currentStep.urlIsTrap ? 'bg-red-500/20 border-red-400' : 'bg-green-500/20 border-green-400')
              : 'bg-white/10 border-white/20 ring-4 ring-sky-400/10 animate-pulse hover:border-sky-400/50'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-1.5 rounded-lg ${itemsFoundInCurrentStep.includes('url-trap') ? (currentStep.urlIsTrap ? 'bg-red-500' : 'bg-green-500') : 'bg-white/10'}`}>
              <Lock size={12} className="text-white" />
            </div>
            <span className={`text-sm font-mono truncate tracking-tight ${itemsFoundInCurrentStep.includes('url-trap') ? (currentStep.urlIsTrap ? 'text-red-200' : 'text-green-200') : 'text-white/80'}`}>
              {currentStep.siteUrl}
            </span>
          </div>
          {itemsFoundInCurrentStep.includes('url-trap') && (
            <div className="mt-3 bg-black/30 p-3 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${currentStep.urlIsTrap ? 'text-red-400' : 'text-green-400'}`}>
                {currentStep.urlIsTrap ? 'Trap Detected' : 'Safety Seal Verified'}
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
        className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col pt-4 no-scrollbar"
      >
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 mb-32">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            <div className={`${getHeaderBg(currentStep.headerColor)} px-8 py-10 text-white flex justify-between items-center flex-shrink-0 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex flex-col">
                <span className="font-brand font-bold tracking-wider uppercase text-xl">{result.simulation.brandName}</span>
                <span className="text-[10px] opacity-80 font-black uppercase tracking-[0.2em] mt-1">{currentStep.subtitle}</span>
              </div>
              <User size={28} className="opacity-80 relative z-10" />
            </div>

            <div className="p-8 space-y-10">
              <div className="space-y-3">
                <h1 className="text-3xl font-black text-slate-800 leading-tight">{currentStep.title}</h1>
                <div className="h-1.5 w-16 bg-slate-100 rounded-full"></div>
              </div>

              <div className="space-y-6">
                {currentStep.fields.map((field) => (
                  <div 
                    key={field.id}
                    onClick={() => handleFieldClick(field)}
                    className={`group relative p-6 border-2 rounded-[2rem] transition-all transform active:scale-[0.98] cursor-pointer ${
                      itemsFoundInCurrentStep.includes(field.id)
                        ? (field.isTrap ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50 shadow-inner')
                        : 'border-slate-100 bg-slate-50 hover:border-sky-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                      {itemsFoundInCurrentStep.includes(field.id) && (
                        field.isTrap ? <AlertCircle size={18} className="text-red-500" /> : <ShieldCheck size={18} className="text-green-500" />
                      )}
                    </div>
                    
                    <div className="text-lg font-bold text-slate-700 min-h-[1.5rem] flex items-center">
                      {field.type === 'button' ? (
                        <div className={`w-full py-5 rounded-2xl text-center uppercase font-black text-sm tracking-[0.2em] shadow-sm transition-all ${itemsFoundInCurrentStep.includes(field.id) ? (field.isTrap ? 'bg-red-500 text-white shadow-lg' : 'bg-green-500 text-white shadow-lg') : 'bg-white border-2 border-slate-100 text-slate-600'}`}>
                          {field.label}
                        </div>
                      ) : (
                        <span className={field.placeholder ? 'text-slate-300 italic' : ''}>{field.placeholder || 'Inspect...'}</span>
                      )}
                    </div>

                    {itemsFoundInCurrentStep.includes(field.id) && (field.doriWarning || field.safetyReason) && (
                      <div className={`mt-5 p-5 bg-white rounded-2xl border-2 shadow-xl animate-in slide-in-from-top-4 ${field.isTrap ? 'border-red-100' : 'border-green-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                           {field.isTrap ? <AlertCircle size={18} className="text-red-500" /> : <ShieldCheck size={18} className="text-green-500" />}
                           <p className={`text-[10px] font-black uppercase tracking-widest ${field.isTrap ? 'text-red-600' : 'text-green-600'}`}>
                             {field.isTrap ? "Danger Warning" : "Safety Verification"}
                           </p>
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{field.isTrap ? field.doriWarning : field.safetyReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-50">
                <DoriAssistant 
                  message={itemsFoundInCurrentStep.length === 0 ? currentStep.doriIntro : 
                           isStepComplete ? `Incredible! You've verified every detail on this page. Move to the next step when you're ready.` :
                           `Great progress! You've inspected ${itemsFoundInCurrentStep.length} out of ${totalRequired} details. Can you find the rest?`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Footer */}
      <div className="relative z-30 bg-slate-900 px-6 py-6 pb-12 border-t border-white/5 flex justify-between items-center flex-shrink-0 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
            {result.isScam ? 'Scams Spotted' : 'Safety Verified'}
          </span>
          <div className="flex gap-2 items-center">
            {Array.from({ length: totalRequired }).map((_, i) => (
              <div key={i} className={`h-2.5 w-6 rounded-full transition-all duration-500 ${itemsFoundInCurrentStep.length > i ? (result.isScam ? 'bg-amber-500' : 'bg-green-500') : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
        
        <button 
          onClick={nextStep}
          disabled={!isStepComplete}
          className={`px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all ${
            isStepComplete ? 'bg-sky-500 text-white shadow-2xl shadow-sky-500/30 active:scale-95' : 'bg-slate-800 text-slate-600 border border-slate-700 opacity-50'
          }`}
        >
          {isFinalStep ? 'Finish Journey' : 'Next Step'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sandbox;
