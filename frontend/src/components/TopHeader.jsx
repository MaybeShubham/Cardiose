import React from 'react';
import { Heart, Droplets, ArrowLeft, ArrowRight } from 'lucide-react';

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
      {/* Navigation History Controls & Current Page Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50 shadow-xs">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-white transition shadow-2xs"
            title="Go Back"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.history.forward()}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-white transition shadow-2xs"
            title="Go Forward"
            aria-label="Go Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-800">
            {getTitle()}
          </h2>
        </div>
      </div>

      {/* Right Controls: Quick Screening Launch Buttons */}
      <div className="flex items-center space-x-3">
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
