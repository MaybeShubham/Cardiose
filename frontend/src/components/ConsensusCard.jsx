import React, { useState, useEffect } from 'react';
import { GitMerge } from 'lucide-react';

function ModelRow({ model, delay = 0 }) {
  const targetPct = Math.max(0, Math.min(100, Math.round((Number(model?.prob) || 0) * 100)));
  const [animatedPct, setAnimatedPct] = useState(targetPct);
  const [barWidth, setBarWidth] = useState(targetPct);

  useEffect(() => {
    setBarWidth(0);
    const timer = setTimeout(() => {
      setBarWidth(targetPct);
    }, 40 + delay);

    let startTimestamp = null;
    const startVal = animatedPct;
    const diff = targetPct - startVal;
    if (diff === 0) return () => clearTimeout(timer);

    let frameId;
    const duration = 650;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(Math.round(startVal + diff * easeOut));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, [targetPct]);

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2">
          <span className={`px-1.5 py-0.5 text-[11px] font-mono font-bold rounded border ${model.badgeColor}`}>
            {model.abbr}
          </span>
          <span className="text-sm font-semibold text-slate-800">{model.name}</span>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-base font-bold text-slate-900">{animatedPct}%</span>
          <span className="text-[11px] text-slate-500">risk</span>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden my-2">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${model.color} transition-all duration-1000 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-600 leading-snug">
        {model.role}
      </p>
    </div>
  );
}

export default function ConsensusCard({ consensus }) {
  if (!consensus) return null;

  const models = [
    {
      id: 'logistic_regression',
      name: 'Logistic Regression',
      abbr: 'LR',
      prob: consensus.logistic_regression ?? 0,
      role: 'Weighs how much each reading shifts the risk — like a medical scoring checklist.',
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      abbr: 'RF',
      prob: consensus.random_forest ?? 0,
      role: 'Runs 100 decision trees and takes a majority vote — catches hidden patterns between readings.',
      color: 'from-teal-500 to-emerald-600',
      badgeColor: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      id: 'naive_bayes',
      name: 'Naive Bayes',
      abbr: 'NB',
      prob: consensus.naive_bayes ?? 0,
      role: 'Asks: how likely are these exact numbers for a healthy person vs an at-risk person?',
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  ];

  const probs = models.map(m => m.prob);
  const maxDiff = Math.max(...probs) - Math.min(...probs);
  const highAgreement = maxDiff <= 0.15;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 backdrop-blur-md shadow-md animate-reportEntrance">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <GitMerge className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            3-Model Agreement
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all ${
          highAgreement
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {highAgreement ? '✓ All 3 Models Agree' : '⚠ Models Slightly Disagree'}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Three completely different algorithms checked this patient independently. When they all agree, the result is highly reliable.
      </p>

      {/* Model Breakdown Cards */}
      <div className="space-y-4">
        {models.map((m, idx) => (
          <ModelRow key={m.id} model={m} delay={idx * 120} />
        ))}
      </div>
    </div>
  );
}
