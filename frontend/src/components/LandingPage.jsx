import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  ShieldCheck,
  Activity,
  Brain,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Scale,
  Database,
  FileCheck,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { COHORT_ARCHETYPES } from '../utils/patientGenerator';

export default function LandingPage({ onEnterWorkspace, onSelectArchetypeAndEnter }) {
  const [activeTabNav, setActiveTabNav] = useState('overview');

  const scrollToSection = (id) => {
    setActiveTabNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cae4fc] via-[#e8f2fc] via-40% to-[#faf9f5] text-slate-900 font-sans selection:bg-[#fef08a] selection:text-slate-900">
      {/* Top Floating Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-200/80 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Cardiose Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
                Cardiose
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
                Clinical CDSS
              </span>
            </div>
          </div>

          {/* Floating Pill Center Menu */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/70 backdrop-blur-md border border-white/80 shadow-xs px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('overview')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTabNav === 'overview' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('solution')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTabNav === 'solution' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              Dual-Disease AI
            </button>
            <button
              onClick={() => scrollToSection('triangulation')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTabNav === 'triangulation' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              Triangulation
            </button>
            <button
              onClick={() => scrollToSection('archetypes')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTabNav === 'archetypes' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              Archetypes
            </button>
            <button
              onClick={() => scrollToSection('evidence')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTabNav === 'evidence' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              Clinical Guidelines
            </button>
          </nav>

          {/* Right Action: Launch Workspace */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onEnterWorkspace}
              className="bg-[#0c0d12] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="overview" className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-blue-200/60 shadow-xs text-blue-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Cardiometabolic Risk Stratification Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-500">AHA & ADA Grounded</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.12]">
            <span className="font-serif block text-slate-950">
              Smarter Healthcare
            </span>
            <span className="block mt-1 font-sans text-slate-900">
              Powered by{' '}
              <span className="bg-[#fef08a] px-3.5 py-0.5 rounded-2xl text-slate-950 inline-block shadow-xs border border-amber-300/40">
                Intelligence
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            Screen cardiovascular and diabetic risk concurrently. Reduce diagnostic silos,
            mitigate AI hallucination through 3-model consensus triangulation, and receive
            instant guideline-grounded clinical action plans.
          </p>

          {/* Dual Pill CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onEnterWorkspace}
              className="bg-[#0c0d12] hover:bg-black text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
            >
              <span>Launch Screening Platform</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => scrollToSection('triangulation')}
              className="bg-white/80 hover:bg-white text-slate-900 border border-slate-300/80 px-7 py-3.5 rounded-full text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center space-x-2"
            >
              <span>Explore 3-Model Consensus</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Hero Interactive Mockup Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl p-6 sm:p-8 overflow-hidden">
            {/* Top Bar inside mockup */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Today's Screening Overview</h3>
                  <p className="text-xs text-slate-500">Live Dual-Disease Biometric Synthesis</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active CDSS Engine
                </span>
                <button
                  onClick={onEnterWorkspace}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition"
                >
                  Open Live Workspace
                </button>
              </div>
            </div>

            {/* Main Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
              {/* Left Column: Dual Disease Real-Time Cards */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Heart Disease Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/50 border border-rose-100/80 shadow-xs relative overflow-hidden group hover:border-rose-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        Cardiovascular
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Framingham & Cleveland Cohort</div>
                    <div className="text-xl font-black text-slate-900 mt-1">13 Biometrics</div>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-rose-100/60">
                      <span className="text-slate-500">Consensus AUC</span>
                      <span className="font-bold text-slate-800">0.912</span>
                    </div>
                  </div>

                  {/* Diabetes Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/50 border border-teal-100/80 shadow-xs relative overflow-hidden group hover:border-teal-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        Metabolic
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Pima & NHANES Validated</div>
                    <div className="text-xl font-black text-slate-900 mt-1">8 Biometrics</div>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-teal-100/60">
                      <span className="text-slate-500">Consensus AUC</span>
                      <span className="font-bold text-slate-800">0.894</span>
                    </div>
                  </div>
                </div>

                {/* Dark Consensus Banner (like the reference card's black banner) */}
                <div className="rounded-2xl bg-[#0c0d12] text-white p-4.5 sm:p-5 flex items-center justify-between shadow-lg">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Triangulated Multi-Model Consensus
                    </div>
                    <div className="text-2xl font-black text-white mt-0.5 flex items-center space-x-2">
                      <span>3 / 3 Agreement</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        High Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Logistic Regression, Random Forest & Naive Bayes cross-validate every case to prevent false-negative blindspots.
                    </p>
                  </div>
                  <button
                    onClick={onEnterWorkspace}
                    className="shrink-0 ml-4 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition"
                  >
                    Run Test
                  </button>
                </div>

                {/* Model Agreement Breakdown */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Algorithm Triangulation Benchmarks</span>
                    <span className="text-[11px] font-normal text-slate-500">Independent Classifiers</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">Logistic Reg.</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">86.8% Acc.</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-1">Calibrated Odds</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">Random Forest</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">98.3% Acc.</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-1">Non-linear splits</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">Naive Bayes</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">85.2% Acc.</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-1">Conditional Prob.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Actions & Clinical Preview (like the right column of the reference mockup) */}
              <div className="md:col-span-5 space-y-4">
                {/* Yellow Quick Action card */}
                <div 
                  onClick={onEnterWorkspace}
                  className="rounded-2xl p-5 bg-[#fef08a] border border-amber-300/80 shadow-xs cursor-pointer hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                        Interactive Screening
                      </span>
                      <h4 className="text-lg font-black text-slate-950 mt-1">
                        Start Patient Triage
                      </h4>
                      <p className="text-xs text-amber-950/80 mt-1">
                        Input clinical vitals or test with preloaded multi-cohort patient cases.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Preloaded Archetype Quick Pill List */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Preloaded Clinical Cohorts</span>
                    <span className="text-[11px] text-blue-600 font-medium">4 Validated</span>
                  </div>
                  <div className="space-y-2">
                    {COHORT_ARCHETYPES.map((arch, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (onSelectArchetypeAndEnter) {
                            onSelectArchetypeAndEnter(arch);
                          } else {
                            onEnterWorkspace();
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition text-left group"
                      >
                        <div className="pr-2">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                            {arch.label}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {arch.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guideline badge */}
                <div className="rounded-2xl bg-slate-100/80 p-3.5 border border-slate-200/60 flex items-center space-x-3 text-xs text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Aligned with <strong>AHA/ACC 2023</strong> & <strong>ADA 2024 Standards of Care</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Section 1: The Cardiometabolic Intersection / Dual-Disease Solution */}
      <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Cardiometabolic Syndrome
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Why Screen Heart Disease & Diabetes Together?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Cardiovascular Disease (CVD) and Type 2 Diabetes (T2D) do not exist in isolation.
            They share common underlying drivers: chronic insulin resistance, vascular endothelial inflammation,
            dyslipidemia, and microvascular stress.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Siloed Screening Fails Patients</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Diabetic patients have a 2-4x higher risk of cardiovascular mortality, often asymptomatic until adverse ischemic events occur. Cardiose synchronizes biometrics across both domains to capture early systemic warnings.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Biometric Coupling</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Resting blood pressure, peak heart rate, fasting blood glucose, and BMI are physiologically correlated. Our active patient state guarantees that when vitals change in one form, the companion screening context stays grounded.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Actionable Dual Plans</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Rather than generic suggestions, Cardiose generates individualized 4-pillar action plans prioritizing both cardioprotective therapies (e.g. SGLT2 inhibitors / GLP-1 RAs) and targeted biometric monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: 3-Model Triangulation Engine */}
      <section id="triangulation" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 bg-gradient-to-b from-white/60 to-transparent rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Reliable Machine Learning
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              3-Model Triangulation Eliminates Single-Model Bias
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Medical decisions cannot hinge on a single black-box model. Cardiose runs every patient through three mathematically diverse algorithms, measuring agreement, divergence, and prediction confidence.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Logistic Regression (Interpretability)</h4>
                  <p className="text-xs text-slate-500">Provides calibrated log-odds and linear biometric thresholds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Random Forest (Non-Linear Interactions)</h4>
                  <p className="text-xs text-slate-500">Detects subtle multi-parameter dependencies (e.g. ST depression × Age).</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Gaussian Naive Bayes (Probabilistic Prior)</h4>
                  <p className="text-xs text-slate-500">Rapid probabilistic baseline resilient to outlier biometric spikes.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onEnterWorkspace}
                className="bg-[#0c0d12] hover:bg-black text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-2"
              >
                <span>Test Triangulation in Workspace</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-bold tracking-wide">Multi-Algorithm Consensus Engine</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Real-Time Synthesis
                </span>
              </div>

              {/* Visualized voting stack */}
              <div className="space-y-4">
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200">Logistic Regression</div>
                    <div className="text-[11px] text-slate-400">Cardiovascular: 86.8% | Diabetes: 77.2%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      Normal (0.14)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200">Random Forest Ensemble</div>
                    <div className="text-[11px] text-slate-400">Cardiovascular: 98.3% | Diabetes: 76.6%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      Normal (0.08)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200">Gaussian Naive Bayes</div>
                    <div className="text-[11px] text-slate-400">Cardiovascular: 85.2% | Diabetes: 75.3%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      Normal (0.12)
                    </span>
                  </div>
                </div>
              </div>

              {/* Consensus Result Pill */}
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-medium">Consensus Strategy</span>
                <span className="text-white font-bold">Unanimous Concordance (Low Risk Profile)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Preloaded Clinical Archetypes Showcase */}
      <section id="archetypes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Rapid Benchmarking
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Validated Clinical Patient Archetypes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Test realistic patient cohorts instantly. Each archetype features physiologically correlated biometrics across both Cardiovascular and Metabolic spectrums.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COHORT_ARCHETYPES.map((arch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {arch.label}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {arch.description}
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">BP / Heart Rate</span>
                    <span className="font-semibold text-slate-800">{arch.heart.trestbps} mm Hg / {arch.heart.thalach} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Glucose / BMI</span>
                    <span className="font-semibold text-slate-800">{arch.diabetes.glucose} mg/dL / {arch.diabetes.bmi}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectArchetypeAndEnter) {
                    onSelectArchetypeAndEnter(arch);
                  } else {
                    onEnterWorkspace();
                  }
                }}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Load in Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Clinical Guidelines & Evidence Base */}
      <section id="evidence" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-400/30">
              Evidence-Based Medicine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Designed as a High-Utility Clinical Decision Support System (CDSS)
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Cardiose does not replace clinical judgment—it enhances it. By combining machine learning confidence intervals with hardcoded clinical risk markers from the AHA/ACC and ADA guidelines, physicians receive transparent rationale for every recommendation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <Award className="w-5 h-5 text-amber-300 mb-2" />
                <h4 className="text-sm font-bold text-white">ADA 2024 Standards</h4>
                <p className="text-xs text-blue-200 mt-1">
                  Threshold screening for impaired fasting glucose (&gt;100 mg/dL), diabetes diagnostic range (&ge;126 mg/dL), and BMI obesity brackets.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-300 mb-2" />
                <h4 className="text-sm font-bold text-white">AHA/ACC 2023 Guidelines</h4>
                <p className="text-xs text-blue-200 mt-1">
                  Hypertension Stage 1/2 categorization, resting ST depression analysis, exercise angina flags, and age-adjusted peak HR deficits.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnterWorkspace}
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-lg transition flex items-center space-x-2"
              >
                <span>Launch Clinical Workspace</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Cardiose Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900">Cardiose</span>
              <p className="text-xs text-slate-500">Explainable Dual-Disease Risk Screening Platform</p>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-slate-500 max-w-lg">
            <p>
              <strong>Disclaimer:</strong> Cardiose is an investigational clinical decision support system designed for research and educational purposes. Not intended as a standalone diagnostic substitute for medical examination.
            </p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} Cardiose Project. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
