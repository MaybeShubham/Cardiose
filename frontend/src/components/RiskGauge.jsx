import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HeartPulse } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'LOW', diseaseType = 'Heart Disease' }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));

  const radius = 80;
  const halfCircumference = Math.PI * radius;
  const strokeDashoffset = halfCircumference - (normalizedScore / 100) * halfCircumference;

  const getTheme = () => {
    switch (level) {
      case 'HIGH':
        return {
          textColor: 'text-rose-600',
          bgColor: 'bg-rose-50/70',
          borderColor: 'border-rose-200',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          strokeColor: '#e11d48',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
          description: 'High Risk Profile: Multiple aberrant biomarkers indicate elevated probability of cardiovascular/metabolic pathology.'
        };
      case 'MODERATE':
        return {
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50/70',
          borderColor: 'border-amber-200',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          strokeColor: '#d97706',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          description: 'Moderate Risk Profile: Borderline biometrics observed. Proactive lifestyle intervention recommended.'
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50/70',
          borderColor: 'border-emerald-200',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          strokeColor: '#059669',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
          description: 'Low Risk Profile: Biometrics adhere to normal physiological thresholds. Continue routine health maintenance.'
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`p-6 rounded-2xl border ${theme.borderColor} ${theme.bgColor} bg-white backdrop-blur-sm transition-all duration-500 shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-5 h-5 text-slate-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Triangulated Risk Gauge
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border flex items-center space-x-1.5 ${theme.badgeBg}`}>
          {theme.icon}
          <span>{level} RISK</span>
        </span>
      </div>

      {/* SVG Semi-Circle Meter */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Value Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={theme.strokeColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="flex items-baseline">
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${theme.textColor}`}>
              {normalizedScore}
            </span>
            <span className="text-slate-400 text-sm font-medium ml-1">/ 100</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Consensus Risk Index
          </span>
        </div>
      </div>

      {/* Triage Summary */}
      <p className="text-xs text-slate-600 text-center mt-3 max-w-sm mx-auto leading-relaxed font-medium">
        {theme.description}
      </p>

      {/* Sensitivity Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Target: {diseaseType}</span>
        <span className="text-teal-700 font-semibold">High Sensitivity (Recall Optimized)</span>
      </div>
    </div>
  );
}
