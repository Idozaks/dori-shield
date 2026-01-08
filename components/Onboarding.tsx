
import React, { useState } from 'react';
import { UserPersona } from '../types';
import { Shield, ChevronRight, CheckCircle2, Zap, Brain, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: (persona: UserPersona) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState('');
  const [familiarity, setFamiliarity] = useState<UserPersona['familiarity']>('intermediate');

  const ageGroups = ['50-60', '60-70', '70-80', '80+'];
  const levels: { id: UserPersona['familiarity'], label: string, desc: string, icon: React.ReactNode }[] = [
    { 
      id: 'beginner', 
      label: 'Not Familiar', 
      desc: 'I feel worried when I get unexpected messages.',
      icon: <Brain className="text-sky-500" />
    },
    { 
      id: 'intermediate', 
      label: 'Knows a bit', 
      desc: 'I know some tricks but want to be sure.',
      icon: <Target className="text-amber-500" />
    },
    { 
      id: 'expert', 
      label: 'Knows well', 
      desc: 'I stay updated but like a second opinion.',
      icon: <Zap className="text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Progress Bar */}
        <div className="flex justify-center gap-2 mb-10">
          <div className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-sky-500' : 'bg-slate-200'}`} />
          <div className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-sky-500' : 'bg-slate-200'}`} />
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-4">
              <div className="bg-white p-6 rounded-[2rem] shadow-xl inline-block mb-4 ring-8 ring-sky-50">
                <Shield className="w-12 h-12 text-sky-500" />
              </div>
              <h1 className="text-4xl font-brand font-black tracking-tight">Let's tailor your shield.</h1>
              <p className="text-slate-500 text-lg font-medium">What is your age group?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {ageGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => { setAgeGroup(group); setStep(2); }}
                  className="bg-white p-8 rounded-[2rem] border-4 border-white shadow-lg hover:border-sky-500 hover:shadow-sky-100 transition-all font-brand font-bold text-2xl group active:scale-95"
                >
                  <span className="group-hover:text-sky-600 transition-colors">{group}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-brand font-black tracking-tight">Digital Experience</h1>
              <p className="text-slate-500 text-lg font-medium">How familiar are you with online scams?</p>
            </div>

            <div className="space-y-4">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setFamiliarity(level.id)}
                  className={`w-full flex items-center gap-6 p-6 rounded-[2.5rem] border-4 transition-all text-left shadow-lg active:scale-[0.98] ${familiarity === level.id ? 'bg-white border-sky-500 ring-8 ring-sky-50' : 'bg-white border-transparent'}`}
                >
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    {level.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-brand font-black text-slate-800">{level.label}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-tight">{level.desc}</p>
                  </div>
                  {familiarity === level.id && <CheckCircle2 className="text-sky-500 w-8 h-8" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => onComplete({ ageGroup, familiarity })}
              className="w-full bg-slate-800 text-white font-brand text-2xl font-black py-8 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all hover:bg-slate-900"
            >
              Start My Journey
              <ChevronRight size={32} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
