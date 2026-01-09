
import React, { useState, useRef, useEffect } from 'react';
import { Bird, X, Send, MessageCircle, Sparkles, HelpCircle, Target, ShieldAlert, BookOpen, Loader2, Trash2, ArrowLeft, Volume2 } from 'lucide-react';
import { chatWithDori, DoriChatResponse, getDoriVoice, playAudioFromBase64 } from '../services/gemini';
import { UserPersona } from '../types';

interface Message {
  text: string;
  isBot: boolean;
}

interface DoriChatbotProps {
  currentAppState: string;
  persona: UserPersona | null;
}

const INITIAL_STARTERS = [
  "איך סורקים תמונה?",
  "מה עושים בפינת התרגול?",
  "איפה מוצאים טיפים על הונאות?",
  "מי אתה דורי?"
];

const DoriChatbot: React.FC<DoriChatbotProps> = ({ currentAppState, persona }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "שלום! אני דורי, המנטור שלכם. יש לכם שאלה על איך משתמשים באפליקציה?", isBot: true }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_STARTERS);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingIdx, setIsSpeakingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const userMsg = text || input;
    if (!userMsg.trim() || isLoading) return;

    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const response: DoriChatResponse = await chatWithDori(userMsg, currentAppState, persona || undefined);
      setMessages(prev => [...prev, { text: response.text || "סליחה, אני קצת מבולבל. אפשר לשאול שוב?", isBot: true }]);
      setSuggestions(response.suggestions && response.suggestions.length > 0 ? response.suggestions : INITIAL_STARTERS);
    } catch (err) {
      setMessages(prev => [...prev, { text: "אוי, משהו השתבש בחיבור שלי. נסו שוב עוד רגע.", isBot: true }]);
      setSuggestions(INITIAL_STARTERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (index: number, text: string) => {
    if (isSpeakingIdx !== null) return;
    setIsSpeakingIdx(index);
    try {
      const audioData = await getDoriVoice(text);
      if (audioData) {
        await playAudioFromBase64(audioData);
      }
    } catch (err) {
      console.error("Speech failed", err);
    } finally {
      setIsSpeakingIdx(null);
    }
  };

  const handleClear = () => {
    setMessages([{ text: "שלום! הצ'אט נוקה. איך אני יכול לעזור לכם עכשיו?", isBot: true }]);
    setSuggestions(INITIAL_STARTERS);
  };

  return (
    <div className="fixed bottom-32 left-6 z-[100] flex flex-col items-end pointer-events-none" dir="rtl">
      {isOpen && (
        <div className="w-[300px] h-[480px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-sky-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 pointer-events-auto mb-4">
          {/* Header */}
          <div className="bg-[#0083cc] p-4 text-white flex justify-between items-center shadow-md relative z-10">
            <div className="flex items-center gap-2.5">
              <Bird size={22} className="animate-bounce" />
              <span className="font-brand font-black text-lg">דורי הצ'אטבוט</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleClear} 
                className="hover:bg-white/20 p-1.5 rounded-lg transition-all text-white/80 hover:text-white group"
                title="ניקוי צ'אט"
              >
                <Trash2 size={16} className="group-hover:rotate-12" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[88%] p-3.5 rounded-[1.5rem] text-sm font-bold shadow-sm relative group ${m.isBot ? 'bg-white text-slate-700 border border-slate-100 animate-message-in' : 'bg-[#0083cc] text-white'}`}>
                  {m.text}
                  {m.isBot && (
                    <button 
                      onClick={() => handleSpeak(i, m.text)}
                      className={`absolute -bottom-1.5 -left-1.5 p-1.5 bg-white rounded-full shadow-md border border-slate-100 transition-all ${isSpeakingIdx === i ? 'text-sky-500 animate-pulse scale-105' : 'text-slate-400 hover:text-sky-500 hover:scale-110 opacity-0 group-hover:opacity-100'}`}
                      disabled={isSpeakingIdx !== null}
                    >
                      {isSpeakingIdx === i ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3.5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-2 animate-message-in">
                  <Loader2 size={16} className="animate-spin text-sky-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">דורי חושב...</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic suggestions (continuers) */}
          {!isLoading && (
            <div className="p-3 flex flex-wrap gap-1.5 justify-end bg-white border-t border-slate-50 min-h-[80px]">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(s)}
                  className="text-[10px] font-black bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full border border-sky-100 transition-all flex items-center gap-1 active:scale-95 text-right shadow-sm hover:bg-sky-600 hover:text-white group"
                >
                  <ArrowLeft size={12} className="text-sky-300 group-hover:text-white transition-all" /> {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-50 flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="שאלו את דורי..."
              className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-inner"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="bg-[#0083cc] text-white p-2.5 rounded-xl disabled:opacity-30 active:scale-90 transition-all shadow-lg hover:bg-sky-700 flex items-center justify-center"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rotate-180" />}
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto bg-[#0083cc] text-white p-4 rounded-full shadow-[0_15px_30px_rgba(0,131,204,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center group relative ${isOpen ? 'rotate-90 bg-slate-800 shadow-none' : ''}`}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
        {!isOpen && (
          <div className="absolute top-0 right-0 bg-red-500 w-5 h-5 rounded-full border-[3px] border-white animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default DoriChatbot;
