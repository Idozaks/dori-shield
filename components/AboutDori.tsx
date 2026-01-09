
import React from 'react';
import { Bird, ShieldCheck, Heart, Sparkles, Zap, Users, GraduationCap, ChevronLeft, Handshake, Target } from 'lucide-react';

interface AboutDoriProps {
  onBack: () => void;
}

const AboutDori: React.FC<AboutDoriProps> = ({ onBack }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 text-right" dir="rtl">
      {/* Header Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="bg-sky-600 p-8 rounded-[3rem] shadow-2xl shadow-sky-200 inline-block ring-8 ring-sky-50">
          <Handshake className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-4xl font-brand font-black text-slate-800">אימון ואמון: הפילוסופיה של דורי</h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          אנחנו מאמינים שאמון הוא לא משהו שמקבלים, אלא משהו שבונים דרך אימון נכון וליווי אישי.
        </p>
      </div>

      {/* Vision Cards */}
      <div className="grid gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-start gap-6 flex-row-reverse">
          <div className="p-4 bg-sky-50 rounded-2xl text-sky-600">
            <Target size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-brand font-black text-slate-800 mb-2">האימון (The Training)</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              אימון הוא הבסיס לכל הצלחה. דורי מעמיד לרשותכם מעבדת סימולציות שבה תוכלו להתאמן על זיהוי הודעות בנק מזויפות, הודעות משפחתיות חשודות ואיומי רשת נוספים. כאן מתרגלים את "השריר הדיגיטלי".
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-start gap-6 flex-row-reverse">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <Handshake size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-brand font-black text-slate-800 mb-2">האמון (The Trust)</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              התוצאה של אימון טוב היא אמון מלא בעצמכם ובכלים שקיבלתם. דורי בונה אתכם כך שתוכלו לסמוך על האינטואיציה הדיגיטלית שלכם ולדעת בדיוק מתי הודעה היא בטוחה ומתי היא מלכודת.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex items-start gap-6 flex-row-reverse">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
            <ShieldCheck size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-brand font-black text-slate-800 mb-2">אמון קהילתי</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              אנחנו לא לבד. האמון של דורי נשען גם על קהילה חזקה של משתמשים המדווחים על איומים בזמן אמת. כל דיווח שלכם מחזק את האמון של אלפי אחרים.
            </p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-slate-800 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-brand font-black flex items-center gap-3 flex-row-reverse">
            <Users className="text-sky-400" />
            משפחת דורי
          </h3>
          <p className="text-lg opacity-80 font-medium leading-relaxed">
            כשמתאמנים יחד, בונים אמון חזק יותר. דורי הוא המנטור שמחבר בין ידע טכנולוגי לבין הביטחון האישי של כל אחד ואחת מכם.
          </p>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl" />
      </div>

      {/* Team/Values */}
      <div className="text-center space-y-8 py-10">
        <div className="flex justify-center gap-8">
          <ValueIcon icon={<Target size={24} />} label="אימון" />
          <ValueIcon icon={<Handshake size={24} />} label="אמון" />
          <ValueIcon icon={<ShieldCheck size={24} />} label="ביטחון" />
        </div>
        <button 
          onClick={onBack}
          className="bg-sky-600 text-white font-brand font-black text-xl py-5 px-12 rounded-full shadow-xl hover:bg-sky-700 transition-all flex items-center gap-4 mx-auto flex-row-reverse"
        >
          חזרה לאימונים
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
