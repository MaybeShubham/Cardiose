import React, { useState } from 'react';
import { Droplets, Dices, Info, CheckCircle2, FileText, ArrowDown } from 'lucide-react';
import { COHORT_ARCHETYPES, generateRandomCorrelatedPatient } from '../utils/patientGenerator';

export default function DiabetesForm({ onSubmit, isLoading, onShowReport, hasReport, reportScore, reportLevel, onValuesChange }) {
  const [formData, setFormData] = useState(COHORT_ARCHETYPES[3].diabetes); // Middle-Aged Male 52y default
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
    onValuesChange?.();
  };

  const handleSelectArchetype = (archetype) => {
    setFormData(archetype.diabetes);
    setActivePersona(archetype.label);
    setActivePersonaDesc(archetype.description);
    onValuesChange?.();
  };

  const handleRandomPatient = () => {
    const randomCase = generateRandomCorrelatedPatient('diabetes');
    setFormData(randomCase.diabetes);
    setActivePersona(randomCase.label);
    setActivePersonaDesc(`Correlated random generation: BMI (${randomCase.diabetes.bmi}) & Insulin (${randomCase.diabetes.insulin} mu U/ml) coupled to age ${randomCase.diabetes.age}y and biological sex.`);
    onValuesChange?.();
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
              <Droplets className="w-5 h-5 text-teal-600" />
              <span>Diabetes Mellitus Screening Panel</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              8 clinical measurements · 3-model ensemble prediction
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
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-all flex items-center space-x-1.5 shadow-xs"
              title="Draw a realistic patient with biometrics physiologically correlated to age & sex"
            >
              <Dices className="w-4 h-4 text-teal-600" />
              <span>Generate Random Correlated Case</span>
            </button>
          </div>
        </div>

        {/* Active Profile Info Banner */}
        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-slate-800">Active Profile: </span>
            <span className="text-teal-700 font-medium">{activePersona}</span>
            <span className="text-slate-500 ml-1.5">— {activePersonaDesc}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Glycemic & Hemodynamic Biomarkers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b border-slate-100 pb-2">
            1. Blood Sugar & Pressure
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Blood Sugar (2-hr Glucose Test)
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Lower is better (&lt;100 mg/dL)
              </span>
            </div>
            <input
              type="number"
              name="glucose"
              min="40"
              max="350"
              placeholder="e.g. 95 mg/dL (Healthy: 70–99 | High: 126+)"
              value={formData.glucose}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Blood Pressure (Diastolic / Bottom Number)
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Lower is better (&lt;80 mm Hg)
              </span>
            </div>
            <input
              type="number"
              name="blood_pressure"
              min="30"
              max="200"
              placeholder="e.g. 74 mm Hg"
              value={formData.blood_pressure}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                2-Hour Blood Insulin Level
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Moderate is best (16–166)
              </span>
            </div>
            <input
              type="number"
              name="insulin"
              min="0"
              max="900"
              placeholder="e.g. 70 mu U/ml"
              value={formData.insulin}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Body Fat Fold (Triceps Skin Thickness)
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Healthy: 10–25 mm</span>
            </div>
            <input
              type="number"
              name="skin_thickness"
              min="0"
              max="100"
              placeholder="e.g. 20 mm"
              value={formData.skin_thickness}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Anthropometric & Hereditary Indicators */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-slate-100 pb-2">
            2. Body Weight & Family History
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Body Mass Index (BMI)
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                Healthy: 18.5 – 24.9
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              name="bmi"
              min="10"
              max="70"
              placeholder="e.g. 23.5 (Over 25 = Overweight | Over 30 = Obese)"
              value={formData.bmi}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Family History of Diabetes Score
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                ⬇ Lower is better (&lt;0.3)
              </span>
            </div>
            <input
              type="number"
              step="0.001"
              name="dpf"
              min="0.01"
              max="3.5"
              placeholder="e.g. 0.25 (Higher score = More diabetic relatives)"
              value={formData.dpf}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Pregnancies
                </label>
                <span className="text-[10px] text-slate-400">Females only</span>
              </div>
              <input
                type="number"
                name="pregnancies"
                min="0"
                max="25"
                value={formData.pregnancies}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>
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
              <FileText className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
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
                <Droplets className="w-4 h-4" />
                <span>Run Diabetes Screening</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
