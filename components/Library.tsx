
import React from 'react';
import { BookOpen, Info, ShieldAlert, Heart, PhoneCall, Gift, Landmark, Send, MessageCircle } from 'lucide-react';

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
  },
  {
    title: "הודעת בנק דחופה",
    icon: <Landmark className="text-sky-600" />,
    desc: "הודעה על 'פעילות חשודה' בחשבון שלכם עם בקשה להזדהות מחדש דרך קישור.",
    tip: "הבנק לעולם לא יבקש סיסמה או פרטי כרטיס אשראי דרך קישור בהודעת טקסט."
  },
  {
    title: "זכייה בלוטו/פיס",
    icon: <Gift className="text-amber-500" />,
    desc: "הודעה המבשרת שזכיתם בפרס כספי גדול, אך עליכם לשלם 'מס' או 'עמלה' כדי לקבלו.",
    tip: "אם לא קניתם כרטיס - לא זכיתם. לעולם אל תשלמו כסף כדי 'לקבל' פרס."
  },
  {
    title: "ביטוח לאומי/משרדי ממשלה",
    icon: <Info className="text-blue-400" />,
    desc: "מסרונים המבקשים 'לעדכן פרטים' כדי לקבל החזר מס או קצבה מיוחדת.",
    tip: "היכנסו לאזור האישי באתר הממשלתי הרשמי בלבד (Gov.il) ולא דרך קישורים בהודעות."
  },
  {
    title: "הונאות רומנטיקה",
    icon: <MessageCircle className="text-red-400" />,
    desc: "פרופילים מזויפים ברשתות חברתיות שמפתחים קשר רגשי ואז מבקשים כסף ל'מקרה חירום'.",
    tip: "לעולם אל תעבירו כסף לאדם שמעולם לא פגשתם פנים אל פנים."
  },
  {
    title: "בקשת תשלום ב-Bit",
    icon: <Send className="text-sky-500" />,
    desc: "הודעות המבקשות 'אישור תשלום' או טוענות שקיבלתם כסף ועליכם ללחוץ על קישור.",
    tip: "ודאו שאתם פותחים את אפליקציית ביט (Bit) המקורית מהטלפון ולא דרך קישור חיצוני."
  }
];

const Library: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-right">
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
