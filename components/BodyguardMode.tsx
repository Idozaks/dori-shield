
import React, { useState, useEffect, useRef } from 'react';
import { Bird, X, Mic, MicOff, Volume2, ShieldAlert, Loader2 } from 'lucide-react';
import { connectLiveDori, encode, decodeBase64, decodeAudioData } from '../services/gemini';

interface BodyguardModeProps {
  onClose: () => void;
}

const BodyguardMode: React.FC<BodyguardModeProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  const startSession = async () => {
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = connectLiveDori({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16[i] = inputData[i] * 32768;
            }
            sessionPromise.then(s => s.sendRealtimeInput({
              media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
            }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && audioContextRef.current) {
            const ctx = audioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => console.error("Live API Error", e),
        onclose: () => setIsActive(false),
      });

      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error("Failed to start bodyguard mode", err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
    }
    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-right" dir="rtl">
      <div className="absolute top-10 left-10">
        <button onClick={onClose} className="bg-white/10 p-4 rounded-full hover:bg-white/20 transition-all">
          <X size={32} />
        </button>
      </div>

      <div className="max-w-xl w-full flex flex-col items-center space-y-12">
        <div className="relative">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 border-sky-500/30 transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_80px_rgba(14,165,233,0.4)]' : ''}`}>
             <div className={`w-36 h-36 bg-sky-600 rounded-full flex items-center justify-center shadow-2xl ${isActive ? 'animate-pulse' : ''}`}>
               <Bird size={64} className="text-white" />
             </div>
          </div>
          {isActive && (
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-sky-400 opacity-20" />
          )}
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-5xl font-brand font-black">דורי בשידור חי</h2>
          <p className="text-xl text-sky-300 font-bold">מצב שומר ראש פעיל</p>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 mt-6">
            <p className="text-lg leading-relaxed opacity-90">
              {isConnecting ? "מתחבר לדורי..." : "דורי מקשיבה לכם עכשיו. אתם יכולים לדבר בחופשיות, לתאר סיטואציה חשודה או לבקש עצה מיידית."}
            </p>
          </div>
        </div>

        <div className="flex gap-6 w-full">
          <button 
            onClick={stopSession}
            className="flex-1 bg-red-600 hover:bg-red-700 p-8 rounded-[2.5rem] font-brand font-black text-2xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
          >
            סיום שיחה
          </button>
        </div>

        {!isActive && !isConnecting && (
          <p className="text-amber-400 font-bold">החיבור נותק. נסו להתחבר שוב.</p>
        )}
      </div>
    </div>
  );
};

export default BodyguardMode;
