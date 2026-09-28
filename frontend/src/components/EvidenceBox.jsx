import React from 'react';
import { Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';

export default function EvidenceBox({ evidencePoints = [] }) {
  const isHealthy = evidencePoints.length === 1 && evidencePoints[0].includes('normative ranges');

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
            Why This Risk Was Flagged
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          AHA / ADA Guidelines
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Here's exactly which readings triggered the risk flag, and why they matter.
      </p>

      {isHealthy ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed font-medium">
            {evidencePoints[0]}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {evidencePoints.map((point, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 transition-all hover:border-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {point}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
