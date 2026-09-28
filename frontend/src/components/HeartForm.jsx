import React, { useState } from 'react';
import { Heart, Dices, Info, CheckCircle2, FileText, ArrowDown } from 'lucide-react';
import { COHORT_ARCHETYPES, generateRandomCorrelatedPatient } from '../utils/patientGenerator';

export default function HeartForm({ onSubmit, isLoading, onShowReport, hasReport, reportScore, reportLevel }) {
  const [formData, setFormData] = useState(COHORT_ARCHETYPES[3].heart); // Middle-Aged Male 52y default
  const [activePersona, setActivePersona] = useState(COHORT_ARCHETYPES[3].label);
  const [activePersonaDesc, setActivePersonaDesc] = useState(COHORT_ARCHETYPES[3].description);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : parseInt(value, 10)
    }));
    setActivePersona('Custom Biometrics');
    setActivePersonaDesc('User-modified clinical values');
  };

  const handleSelectArchetype = (archetype) => {
    setFormData(archetype.heart);
    setActivePersona(archetype.label);
    setActivePersonaDesc(archetype.description);
  };

  const handleRandomPatient = () => {
    const randomCase = generateRandomCorrelatedPatient('heart');
    setFormData(randomCase.heart);
    setActivePersona(randomCase.label);
    setActivePersonaDesc(`Correlated random generation: BP & peak HR (${randomCase.heart.thalach} bpm) scaled to age ${randomCase.heart.age}y and biological sex.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header and Correlated Cohort Dataset Selector */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Cardiovascular Disease Screening Panel</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              13 clinical measurements · 3-model ensemble prediction
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Cohort Archetype Dropdown */}
            <div className="relative">
              <select
                aria-label="Select Cohort Archetype"
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  if (!isNaN(idx)) handleSelectArchetype(COHORT_ARCHETYPES[idx]);
                }}
                value={COHORT_ARCHETYPES.findIndex(a => a.label === activePersona) !== -1 ? COHORT_ARCHETYPES.findIndex(a => a.label === activePersona) : ''}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="" disabled>Select Cohort Case...</option>
                {COHORT_ARCHETYPES.map((arch, idx) => (
                  <option key={arch.label} value={idx}>
                    {arch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Random Correlated Generator Button */}
            <button
              type="button"
              onClick={handleRandomPatient}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all flex items-center space-x-1.5 shadow-xs"
              title="Draw a realistic patient with biometrics physiologically correlated to age & sex"
            >
              <Dices className="w-4 h-4 text-blue-600" />
              <span>Generate Random Correlated Case</span>
            </button>
          </div>
        </div>

        {/* Active Profile Info Banner */}
        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-slate-800">Active Profile: </span>
            <span className="text-blue-700 font-medium">{activePersona}</span>
            <span className="text-slate-500 ml-1.5">— {activePersonaDesc}</span>
          </div>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Quick Demo:</span>
          <button
            type="button"
            onClick={() => handleSelectArchetype(COHORT_ARCHETYPES[1])}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center space-x-1.5 shadow-xs"
          >
            🟢 Healthy Young
          </button>
          <button
            type="button"
            onClick={() => handleSelectArchetype(COHORT_ARCHETYPES[3])}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all flex items-center space-x-1.5 shadow-xs"
          >
            🟡 Borderline Risk
          </button>
          <button
            type="button"
            onClick={() => handleSelectArchetype(COHORT_ARCHETYPES[5])}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all flex items-center space-x-1.5 shadow-xs"
          >
            🔴 High Risk Senior
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Demographics & Vitals */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b border-slate-100 pb-2">
            1. Patient Basics & Vitals
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              name="age"
              min="18"
              max="120"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Biological Sex
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={1}>Male</option>
              <option value={0}>Female</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Resting Blood Pressure
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Lower is better (&lt;120)
              </span>
            </div>
            <input
              type="number"
              name="trestbps"
              min="50"
              max="260"
              placeholder="e.g. 120 mm Hg"
              value={formData.trestbps}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Total Blood Cholesterol
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Lower is better (&lt;200)
              </span>
            </div>
            <input
              type="number"
              name="chol"
              min="80"
              max="600"
              placeholder="e.g. 185 mg/dL"
              value={formData.chol}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Electrocardiogram & Stress Testing */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 border-b border-slate-100 pb-2">
            2. Exercise Test & ECG Readings
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Chest Discomfort / Pain
              </label>
              <span className="text-[10px] text-slate-500 font-medium">"No pain" is best</span>
            </div>
            <select
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={0}>No Pain (Healthy / Best)</option>
              <option value={1}>Mild Atypical Ache (Caution)</option>
              <option value={2}>Non-Heart Chest Pain</option>
              <option value={3}>Severe Tightness / Angina (High Risk)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Peak Exercise Heart Rate
              </label>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                ⬆ Higher is better (Stamina)
              </span>
            </div>
            <input
              type="number"
              name="thalach"
              min="50"
              max="250"
              placeholder="e.g. 165 bpm"
              value={formData.thalach}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Chest Pain During Exercise?
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                "No" is better
              </span>
            </div>
            <select
              name="exang"
              value={formData.exang}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={0}>No — No chest pain during exercise (Healthy)</option>
              <option value={1}>Yes — Chest pain during exercise (Oxygen lack)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Heart Strain on ECG (ST Depression)
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Lower is better (&lt;1.0)
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              name="oldpeak"
              min="0"
              max="10"
              placeholder="e.g. 0.2 mm"
              value={formData.oldpeak}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Heart Rate Recovery Slope on ECG
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Recovery quality</span>
            </div>
            <select
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={1}>1: Upsloping (Healthy cardiac recovery — Best)</option>
              <option value={2}>2: Flat (Moderate strain marker)</option>
              <option value={3}>3: Downsloping (High concern for ischemia)</option>
            </select>
          </div>
        </div>

        {/* Section 3: Diagnostic Fluoroscopy & Scintigraphy */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-slate-100 pb-2">
            3. Medical Scans & Blood Sugar
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Resting Heart Rhythm (ECG)
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Electrical rhythm</span>
            </div>
            <select
              name="restecg"
              value={formData.restecg}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={0}>0: Normal heart rhythm (Healthy / Best)</option>
              <option value={1}>1: Mild wave abnormality (Borderline)</option>
              <option value={2}>2: Enlarged heart muscle / LVH (High Concern)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Fasting Blood Sugar Over 120 mg/dL?
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                "No" is better
              </span>
            </div>
            <select
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={0}>No — Normal fasting sugar (≤120 mg/dL — Healthy)</option>
              <option value={1}>Yes — High fasting sugar (&gt;120 mg/dL — Warning)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Blocked Major Arteries (Scan)
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                0 is best (Open arteries)
              </span>
            </div>
            <select
              name="ca"
              value={formData.ca}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={0}>0 Blocked Vessels (Clear arteries — Best)</option>
              <option value={1}>1 Narrowed Vessel (Mild plaque)</option>
              <option value={2}>2 Narrowed Vessels (Moderate plaque)</option>
              <option value={3}>3 Narrowed Vessels (Severe blockage)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Heart Blood Supply Scan (Thallium)
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Muscle oxygenation</span>
            </div>
            <select
              name="thal"
              value={formData.thal}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            >
              <option value={1}>1: Normal Blood Flow Everywhere (Best)</option>
              <option value={2}>2: Fixed Scar from Past Heart Damage</option>
              <option value={3}>3: Active Reduced Blood Flow (Warning)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clean SaaS Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          {hasReport && (
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Report Ready:</span>
              <span className="font-bold">{reportScore}/100</span>
              <span className="text-emerald-600">({reportLevel})</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {hasReport && (
            <button
              type="button"
              onClick={onShowReport}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 hover:border-slate-300 transition-all flex items-center space-x-2 shadow-xs group"
            >
              <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Show Diagnostic Report</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Biometrics...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Run Cardiovascular Screening</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
