
import React, { useState } from 'react';
import { Bird, X, Volume2, Loader2, ShieldCheck } from 'lucide-react';
import { getDoriVoice, playAudioFromBase64 } from '../services/gemini';

interface DoriAssistantProps {
  message: string;
  isAnimated?: boolean;
  onDismiss?: () => void;
}

const DoriAssistant: React.FC<DoriAssistantProps> = ({ message, isAnimated = true, onDismiss }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying || isLoading) return;
    setIsLoading(true);
    try {
      const audioData = await getDoriVoice(message);
      if (audioData) {
        setIsPlaying(true);
        await playAudioFromBase64(audioData);
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Speech failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-start gap-6 bg-white p-10 rounded-[2.5rem] border-2 border-sky-50 shadow-2xl relative max-w-2xl mx-auto w-full text-right ${isAnimated ? 'animate-bounce-subtle' : ''}`} dir="rtl">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between mb-2 flex-row-reverse">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="bg-[#0083cc] p-3 rounded-2xl shadow-lg">
              <Bird className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-brand text-2xl text-[#0083cc] font-black">Dori says:</h4>
          </div>
          <button 
            onClick={handleSpeak} 
            disabled={isLoading || isPlaying}
            className={`p-2 rounded-xl transition-all ${isPlaying ? 'text-sky-500 bg-sky-50 animate-pulse' : 'text-slate-300 hover:text-sky-500 hover:bg-slate-50'}`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
        <p className="text-slate-600 leading-relaxed font-bold text-lg">
          {message}
        </p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="absolute -top-3 -left-3 bg-white border border-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 shadow-lg transition-all">
          <X size={20} />
        </button>
      )}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DoriAssistant;
