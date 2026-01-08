
import React, { useState } from 'react';
import { Flag, ShieldCheck, Send, MessageSquare, AlertCircle, Bird } from 'lucide-react';
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
      <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 animate-in zoom-in duration-500 text-right" dir="rtl">
        <div className="bg-emerald-100 p-8 rounded-full border-4 border-emerald-50 shadow-inner">
          <ShieldCheck className="w-20 h-20 text-emerald-600" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-brand font-black text-slate-800">הדיווח התקבל בהצלחה!</h2>
          <p className="text-xl text-slate-500 font-medium px-8 leading-relaxed max-w-lg mx-auto">
            תודה רבה שאתם גיבורים דיגיטליים! הדיווח שלכם עוזר לדורי להגן על אלפי בני גיל הזהב אחרים מפני הטריק הספציפי הזה.
          </p>
        </div>
        <button 
          onClick={() => { setReported(false); setText(''); }}
          className="px-12 py-5 bg-sky-600 text-white font-brand text-2xl font-black rounded-[2rem] shadow-xl active:scale-95 transition-all"
        >
          דיווח על הונאה נוספת
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 text-right" dir="rtl">
      <DoriAssistant message="נתקלתם בטריק חדש 'בשטח'? דווחו לי כאן! אני אוסיף אותו לרשימת ה'שחקנים הרעים' שלי כדי שאוכל להזהיר אחרים מהר יותר." />
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-xl space-y-8">
        <div className="space-y-4">
          <label className="text-xl font-brand font-black text-slate-800 flex items-center gap-3 flex-row-reverse">
            <MessageSquare size={24} className="text-sky-500" />
            תארו את ההונאה
          </label>
          <textarea 
            className="w-full h-48 p-6 border-2 border-slate-50 bg-slate-50 rounded-[2rem] outline-none focus:border-sky-300 transition-all font-bold text-slate-700 text-lg placeholder:opacity-30"
            placeholder="הדביקו כאן את תוכן ההודעה או תארו מה קרה (למשל: 'קיבלתי שיחה ממישהו שהתחזה לנציג אמזון וטען שהחשבון שלי נפרץ...')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="rtl"
          />
        </div>

        <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-2xl border-2 border-amber-100 flex-row-reverse">
          <AlertCircle className="text-amber-500 flex-shrink-0" size={28} />
          <p className="text-sm text-amber-900 font-bold leading-relaxed">
            לתשומת לבכם: המידע האישי שלכם נשאר תמיד פרטי. אנחנו משתמשים רק בתוכן ההונאה כדי לאמן את דורי!
          </p>
        </div>

        <button 
          type="submit"
          disabled={!text.trim()}
          className="w-full bg-slate-800 text-white font-brand text-2xl font-black py-7 rounded-[2.5rem] flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl active:scale-95 transition-all flex-row-reverse"
        >
          <Flag size={28} />
          הגנו על הקהילה עכשיו
          <Send size={24} className="rotate-180" />
        </button>
      </form>
    </div>
  );
};

export default ReportScam;
