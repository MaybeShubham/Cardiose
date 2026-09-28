import React from 'react';
import { Apple, Dumbbell, ClipboardList } from 'lucide-react';

export default function ActionPlan({ actionPlan }) {
  if (!actionPlan) return null;

  const categories = [
    {
      title: 'Diet',
      icon: <Apple className="w-5 h-5 text-emerald-600" />,
      content: actionPlan.dietary,
      borderColor: 'border-emerald-200 hover:border-emerald-300',
      tag: 'Nutrition',
      tagColor: 'text-emerald-800 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Lifestyle & Exercise',
      icon: <Dumbbell className="w-5 h-5 text-sky-600" />,
      content: actionPlan.lifestyle,
      borderColor: 'border-sky-200 hover:border-sky-300',
      tag: 'Activity',
      tagColor: 'text-sky-800 bg-sky-50 border-sky-200'
    },
    {
      title: 'See a Doctor',
      icon: <ClipboardList className="w-5 h-5 text-purple-600" />,
      content: actionPlan.clinical,
      borderColor: 'border-purple-200 hover:border-purple-300',
      tag: 'Medical Tests',
      tagColor: 'text-purple-800 bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
          What To Do Next
        </h3>
        <span className="text-[11px] font-semibold text-teal-700">
          Personalised Recommendations
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Based on the flagged readings, here's what this patient should do next.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-slate-50 border ${cat.borderColor} flex flex-col justify-between transition-all duration-300 shadow-sm`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                  {cat.icon}
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${cat.tagColor}`}>
                  {cat.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                {cat.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {cat.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
