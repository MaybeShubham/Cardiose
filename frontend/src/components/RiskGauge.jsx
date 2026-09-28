import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HeartPulse } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'LOW', diseaseType = 'Heart Disease' }) {
  const targetScore = Math.max(0, Math.min(100, Number(score) || 0));
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = animatedScore;
    const diff = targetScore - startValue;
    if (diff === 0) return;

    let frameId;
    const duration = 850;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(startValue + diff * easeOut));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetScore]);

  const radius = 80;
  const halfCircumference = Math.PI * radius;
  const strokeDashoffset = halfCircumference - (animatedScore / 100) * halfCircumference;

  const getTheme = () => {
    switch (level) {
      case 'HIGH':
        return {
          textColor: 'text-rose-600',
          bgColor: 'bg-rose-50/70',
          borderColor: 'border-rose-200',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200 animate-pulseGlow',
          strokeColor: '#e11d48',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />,
          description: "Several of this patient's readings are outside safe ranges. A doctor should review this soon."
        };
      case 'MODERATE':
        return {
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50/70',
          borderColor: 'border-amber-200',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          strokeColor: '#d97706',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          description: 'Some readings are borderline. Lifestyle changes now can significantly lower this risk.'
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
          description: 'All readings look healthy. Keep up the good habits and schedule routine check-ups.'
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`p-6 rounded-2xl border ${theme.borderColor} ${theme.bgColor} bg-white backdrop-blur-sm transition-all duration-500 shadow-md animate-reportEntrance`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-5 h-5 text-slate-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Risk Score
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border flex items-center space-x-1.5 transition-all ${theme.badgeBg}`}>
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
            Risk Score
          </span>
        </div>
      </div>

      {/* Plain-English Triage Summary */}
      <p className="text-xs text-slate-600 text-center mt-3 max-w-sm mx-auto leading-relaxed font-medium">
        {theme.description}
      </p>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center text-[11px] text-slate-500 font-medium">
        <span>Screening for: {diseaseType}</span>
      </div>
    </div>
  );
}
