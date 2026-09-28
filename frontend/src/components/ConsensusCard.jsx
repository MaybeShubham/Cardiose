import React from 'react';
import { GitMerge } from 'lucide-react';

export default function ConsensusCard({ consensus }) {
  if (!consensus) return null;

  const models = [
    {
      id: 'logistic_regression',
      name: 'Logistic Regression',
      abbr: 'LR',
      prob: consensus.logistic_regression ?? 0,
      role: 'Linear log-odds baseline and calibrated margin probability',
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      abbr: 'RF',
      prob: consensus.random_forest ?? 0,
      role: 'Ensemble modeling non-linear biomarker interactions & splits',
      color: 'from-teal-500 to-emerald-600',
      badgeColor: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      id: 'naive_bayes',
      name: 'Gaussian Naive Bayes',
      abbr: 'GNB',
      prob: consensus.naive_bayes ?? 0,
      role: 'Class-conditional feature likelihood under normal distributions',
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  ];

  const probs = models.map(m => m.prob);
  const maxDiff = Math.max(...probs) - Math.min(...probs);
  const highAgreement = maxDiff <= 0.15;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <GitMerge className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Triangulated Algorithm Consensus
          </h3>
        </div>
        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
          highAgreement
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {highAgreement ? 'High Consensus Convergence' : 'Cross-Model Divergence'}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Three distinct statistical learning paradigms score the patient vector concurrently to eliminate single-estimator inductive bias.
      </p>

      {/* Model Breakdown Cards */}
      <div className="space-y-4">
        {models.map((m) => {
          const percentage = Math.round(m.prob * 100);
          return (
            <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`px-1.5 py-0.5 text-[11px] font-mono font-bold rounded border ${m.badgeColor}`}>
                    {m.abbr}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-base font-bold text-slate-900">{percentage}%</span>
                  <span className="text-[11px] text-slate-500">prob</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden my-2">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {m.role}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
