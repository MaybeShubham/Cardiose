import React from 'react';
import { Heart, Droplets, ArrowLeft } from 'lucide-react';

export default function TopHeader({ activeTab, onNewScreening, onBackToLanding }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'heart':
        return 'Cardiovascular Disease Screening';
      case 'diabetes':
        return 'Diabetes Mellitus Screening';
      case 'history':
        return 'Screening History & Audit';
      default:
        return 'Cardiovascular Disease Screening';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/90">
      {/* Current Page Title */}
      <div>
        <h2 className="text-base font-bold text-slate-800">
          {getTitle()}
        </h2>
      </div>

      {/* Right Controls: Quick Screening Launch Buttons */}
      <div className="flex items-center space-x-3">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-xs"
            title="Return to Cardiose Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Project Overview</span>
          </button>
        )}

        <button
          onClick={() => onNewScreening('heart')}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shadow-xs"
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>+ Heart Screen</span>
        </button>

        <button
          onClick={() => onNewScreening('diabetes')}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all shadow-xs"
        >
          <Droplets className="w-3.5 h-3.5 text-blue-600" />
          <span>+ Diabetes Screen</span>
        </button>
      </div>
    </header>
  );
}
