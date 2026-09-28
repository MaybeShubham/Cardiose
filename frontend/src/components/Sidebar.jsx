import React from 'react';
import {
  Heart,
  Droplets,
  ClipboardList
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
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
        className="flex items-center space-x-3 cursor-pointer px-2 py-2 mb-8"
        onClick={() => setActiveTab('heart')}
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
    </aside>
  );
}
