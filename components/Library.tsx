
import React from 'react';
import { BookOpen, Info, ShieldAlert, Heart, PhoneCall, ChevronRight } from 'lucide-react';

const RESOURCES = [
  {
    title: "The 'Grandparent' Trick",
    icon: <Heart className="text-pink-500" />,
    desc: "Someone calls pretending to be a grandchild in trouble. They always ask for money quickly.",
    tip: "Always hang up and call your grandchild or their parents directly on their known number."
  },
  {
    title: "Fake Tech Support",
    icon: <PhoneCall className="text-blue-500" />,
    desc: "A pop-up says your computer has a virus and gives a number to call for help.",
    tip: "Real companies like Microsoft or Apple will never put a phone number in a pop-up alert."
  },
  {
    title: "Package Delivery Traps",
    icon: <ShieldAlert className="text-orange-500" />,
    desc: "Texts saying you missed a delivery and need to pay a small fee to reschedule.",
    tip: "Go to the official website of the delivery company (like UPS or FedEx) to check your tracking."
  },
  {
    title: "Romance Scams",
    icon: <Info className="text-red-400" />,
    desc: "People you meet online who quickly profess love but eventually ask for money for 'emergencies'.",
    tip: "Never send money to someone you have not met in person, no matter how much you trust them."
  }
];

const Library: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
        <h2 className="text-xl font-brand font-bold text-sky-800 flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6" />
          Safety Knowledge Base
        </h2>
        <p className="text-slate-600 text-sm font-medium italic">"An ounce of prevention is worth a pound of cure."</p>
      </div>

      <div className="grid gap-4">
        {RESOURCES.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-sky-50 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-800">{item.title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed font-medium">
              {item.desc}
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border-l-4 border-sky-400">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">Dori's Pro Tip:</p>
              <p className="text-sm text-sky-800 font-semibold">{item.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
