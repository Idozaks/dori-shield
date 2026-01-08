
import React, { useState } from 'react';
import { Bird, X, Volume2, Loader2 } from 'lucide-react';
import { getDoriVoice } from '../services/gemini';

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
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlaying(false);
        setIsPlaying(true);
        source.start();
      }
    } catch (err) {
      console.error("Speech failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-start gap-4 bg-white p-5 rounded-2xl border-2 border-sky-100 shadow-lg relative ${isAnimated ? 'animate-bounce-subtle' : ''}`}>
      <div className="bg-sky-500 p-3 rounded-full flex-shrink-0 cursor-pointer hover:bg-sky-600 transition-colors" onClick={handleSpeak}>
        {isLoading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Bird className="w-8 h-8 text-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-brand text-lg text-sky-700 font-bold">Dori says:</h4>
          <button 
            onClick={handleSpeak} 
            disabled={isLoading || isPlaying}
            className={`p-1 rounded-lg transition-all ${isPlaying ? 'text-sky-500 bg-sky-50 animate-pulse' : 'text-slate-300 hover:text-sky-500 hover:bg-slate-50'}`}
          >
            <Volume2 size={20} />
          </button>
        </div>
        <p className="text-slate-600 leading-relaxed font-medium">
          {message}
        </p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="absolute -top-2 -right-2 bg-slate-200 p-1 rounded-full text-slate-500 hover:bg-slate-300 transition-colors">
          <X size={16} />
        </button>
      )}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DoriAssistant;
