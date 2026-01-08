
import React, { useState } from 'react';
import { Flag, ShieldCheck, Send, MessageSquare, AlertCircle } from 'lucide-react';
import DoriAssistant from './DoriAssistant';

const ReportScam: React.FC = () => {
  const [reported, setReported] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setReported(true);
  };

  if (reported) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 animate-in zoom-in duration-500">
        <div className="bg-green-100 p-8 rounded-full border-4 border-green-50">
          <ShieldCheck className="w-20 h-20 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-brand font-bold text-slate-800">Report Received!</h2>
          <p className="text-slate-500 font-medium px-8">
            Thank you for being a hero! Your report helps Dori protect thousands of other seniors from this specific trick.
          </p>
        </div>
        <button 
          onClick={() => { setReported(false); setText(''); }}
          className="px-8 py-3 bg-sky-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Report Another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <DoriAssistant message="Found a new trick out in the wild? Report it here! I'll add it to my 'Bad Actor' list so I can warn others faster." />
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <MessageSquare size={18} className="text-sky-500" />
            Describe the Scam
          </label>
          <textarea 
            className="w-full h-40 p-4 border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-sky-300 transition-all font-medium text-slate-600"
            placeholder="Paste the message or describe what happened (e.g., 'Got a call from fake Amazon saying my account was hacked...')"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
          <p className="text-xs text-amber-800 font-bold leading-tight">
            Note: Your personal info is always kept private. We only use the scam content to train Dori!
          </p>
        </div>

        <button 
          type="submit"
          disabled={!text.trim()}
          className="w-full bg-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl active:scale-95 transition-all"
        >
          <Flag size={20} />
          Protect the Community
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ReportScam;
