
import React, { useState, useEffect } from 'react';
import { BookOpen, Info, ShieldAlert, Heart, PhoneCall, Gift, Landmark, Send, MessageCircle, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { fetchScamNews } from '../services/gemini';

const RESOURCES = [
  {
    title: "שיטת 'הנכד בצרות'",
    icon: <Heart className="text-pink-500" />,
    desc: "מישהו מתקשר ומתחזה לנכד שנמצא במצוקה (מעצר, תאונה). הם תמיד מבקשים כסף בדחיפות ובסודיות.",
    tip: "נתקו מיד והתקשרו לנכד או להוריו ישירות למספר שאתם מכירים."
  },
  {
    title: "הודעה מהדואר/חבילה",
    icon: <ShieldAlert className="text-orange-500" />,
    desc: "מסרון הטוען שחבילה ממתינה לכם ויש לשלם 'דמי שחרור' קטנים כדי לקבל אותה.",
    tip: "אל תלחצו על קישורים בהודעות SMS. בדקו את מספר המעקב באתר הרשמי של דואר ישראל."
  },
  {
    title: "תמיכה טכנית מזויפת",
    icon: <PhoneCall className="text-blue-500" />,
    desc: "הודעה קופצת במחשב שטוענת שיש וירוס ומציגה מספר טלפון ל'עזרה' מיידית.",
    tip: "חברות כמו מיקרוסופט או אפל לעולם לא יציגו מספר טלפון בתוך הודעת אזהרה קופצת."
  }
];

const Library: React.FC = () => {
  const [news, setNews] = useState<any>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  useEffect(() => {
    handleFetchNews();
  }, []);

  const handleFetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const data = await fetchScamNews();
      setNews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingNews(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-right" dir="rtl">
      {/* Real-time Alerts Section */}
      <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/20 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-6 relative z-10 flex-row-reverse">
          <div className="flex items-center gap-3 flex-row-reverse">
            <Globe className="text-red-400 animate-pulse" />
            <h2 className="text-2xl font-brand font-black">התראות חמות מהשטח</h2>
          </div>
          <button 
            onClick={handleFetchNews} 
            disabled={isLoadingNews}
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            <RefreshCw size={20} className={isLoadingNews ? 'animate-spin' : ''} />
          </button>
        </div>

        {isLoadingNews ? (
          <div className="flex flex-col items-center py-10 space-y-4">
            <RefreshCw className="animate-spin text-sky-400" size={32} />
            <p className="text-slate-400 font-bold">דורי סורק את החדשות עבורכם...</p>
          </div>
        ) : news ? (
          <div className="space-y-4 relative z-10">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{news.text}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {news.sources?.map((chunk: any, i: number) => (
                chunk.web && (
                  <a 
                    key={i} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-sky-500/20 text-sky-300 px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-sky-500/40 transition-all border border-sky-500/30"
                  >
                    מקור {i+1} <ExternalLink size={12} />
                  </a>
                )
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-10">לחצו על רענון כדי לקבל את החדשות האחרונות.</p>
        )}
      </div>

      <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
        <h2 className="text-xl font-brand font-bold text-sky-800 flex items-center gap-2 mb-2 flex-row-reverse">
          <BookOpen className="w-6 h-6" />
          ספריית הידע של דורי
        </h2>
        <p className="text-slate-600 text-sm font-medium italic">"ידע הוא הכוח הטוב ביותר להגנה דיגיטלית."</p>
      </div>

      <div className="grid gap-4">
        {RESOURCES.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition-all group">
            <div className="flex items-center gap-3 mb-3 flex-row-reverse">
              <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-sky-50 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed font-medium">
              {item.desc}
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border-r-4 border-sky-400 border-l-0">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">הטיפ של דורי:</p>
              <p className="text-sm text-sky-800 font-semibold">{item.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
