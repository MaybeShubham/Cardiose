import React from 'react';
import { Heart, Droplets, History } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('heart')}>
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Cardiose Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">Cardiose</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-teal-700 bg-teal-50 border border-teal-200 rounded">
                  CDSS v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Explainable Dual-Disease Risk Screening Platform</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('heart')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'heart'
                  ? 'bg-white text-rose-700 border border-rose-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Heart Disease</span>
            </button>

            <button
              onClick={() => setActiveTab('diabetes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'diabetes'
                  ? 'bg-white text-teal-700 border border-teal-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Droplets className="w-4 h-4 text-teal-600" />
              <span>Diabetes</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-sky-700 border border-sky-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <History className="w-4 h-4 text-sky-600" />
              <span>Audit History</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
