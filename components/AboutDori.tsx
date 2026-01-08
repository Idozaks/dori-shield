
import React from 'react';
import { Bird, ShieldCheck, Heart, Sparkles, Zap, Users, GraduationCap, ChevronLeft } from 'lucide-react';

interface AboutDoriProps {
  onBack: () => void;
}

const AboutDori: React.FC<AboutDoriProps> = ({ onBack }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 text-right" dir="rtl">
      {/* Header Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="bg-sky-500 p-8 rounded-[3rem] shadow-2xl shadow-sky-200 inline-block ring-8 ring-sky-50">
          <Bird className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-4xl font-brand font-black text-slate-800">הכירו את דורי</h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          המנטור הדיגיטלי האישי שלכם, שנולד כדי להפוך את האינטרנט למקום בטוח, נגיש ומזמין עבור כולם.
        </p>
      </div>

      {/* Vision Cards */}
      <div className="grid gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-start gap-6 flex-row-reverse">
          <div className="p-4 bg-sky-50 rounded-2xl text-sky-600">
            <Heart size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-brand font-black text-slate-800 mb-2">למה דורי?</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              העולם הדיגיטלי מתפתח מהר, ולפעמים זה מרגיש כמו שפה חדשה ומפחידה. דורי נוצר כדי לגשר על הפער הזה, לא רק על ידי חסימת סכנות, אלא על ידי לימוד הכלים לזהות אותן בעצמכם.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-start gap-6 flex-row-reverse">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <ShieldCheck size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-brand font-black text-slate-800 mb-2">הביטחון שלכם במרכז</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              דורי משתמש בבינה מלאכותית מתקדמת כדי לנתח הודעות, קישורים ותמונות. הוא לא רק אומר "זהירות", הוא מסביר בדיוק למה, כדי שבפעם הבאה תזהו את זה לבד.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-start gap-6 flex-row-reverse">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
            <GraduationCap size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-brand font-black text-slate-800 mb-2">למידה ללא סיכון</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              דרך "מעבדת התרגול" שלנו, תוכלו להתנסות בסימולציות של הונאות אמיתיות בסביבה סטרילית. כאן מותר לטעות, כי כל טעות היא שיעור חשוב לחיים האמיתיים.
            </p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-slate-800 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-brand font-black flex items-center gap-3 flex-row-reverse">
            <Users className="text-sky-400" />
            כוחה של הקהילה
          </h3>
          <p className="text-lg opacity-80 font-medium leading-relaxed">
            כשאתם מדווחים על הונאה חדשה שנתקלתם בה, אתם לא רק מגינים על עצמכם — אתם מעדכנים את "המוח" של דורי ומגינים על אלפי משתמשים אחרים. יחד, אנחנו בונים חומת הגנה קהילתית.
          </p>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl" />
      </div>

      {/* Team/Values */}
      <div className="text-center space-y-8 py-10">
        <div className="flex justify-center gap-8">
          <ValueIcon icon={<Zap size={24} />} label="מהירות" />
          <ValueIcon icon={<Sparkles size={24} />} label="חדשנות" />
          <ValueIcon icon={<ShieldCheck size={24} />} label="אמינות" />
        </div>
        <button 
          onClick={onBack}
          className="bg-sky-600 text-white font-brand font-black text-xl py-5 px-12 rounded-full shadow-xl hover:bg-sky-700 transition-all flex items-center gap-4 mx-auto flex-row-reverse"
        >
          חזרה לשיעורים
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

const ValueIcon: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="bg-white p-4 rounded-2xl shadow-sm text-sky-500 border border-slate-50">
      {icon}
    </div>
    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

export default AboutDori;
