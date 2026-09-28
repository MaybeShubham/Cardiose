import React from 'react';
import {
  Heart,
  Droplets,
  ClipboardList,
  Globe,
  ArrowLeft
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onBackToLanding }) {
  const navItems = [
    {
      id: 'heart',
      label: 'Heart Screening',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'diabetes',
      label: 'Diabetes Screening',
      icon: <Droplets className="w-5 h-5" />
    },
    {
      id: 'history',
      label: 'Screening History',
      icon: <ClipboardList className="w-5 h-5" />
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 min-h-screen p-5">
      {/* Brand Header */}
      <div
        className="flex items-center space-x-3 cursor-pointer px-2 py-2 mb-6"
        onClick={() => {
          if (onBackToLanding) {
            onBackToLanding();
          } else {
            setActiveTab('heart');
          }
        }}
        title="Return to Cardiose Website"
      >
        <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-xs border border-slate-200 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="Cardiose Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            Cardiose
          </h1>
          <p className="text-[11px] font-medium text-slate-400">Clinical Decision Support</p>
        </div>
      </div>

      {/* Return to Project Overview Button */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="mb-4 w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Project Overview</span>
        </button>
      )}

      {/* Navigation Menu */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Website Link */}
      {onBackToLanding && (
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onBackToLanding}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Cardiose Website</span>
          </button>
        </div>
      )}
    </aside>
  );
}
