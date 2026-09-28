import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import HeartForm from './components/HeartForm';
import DiabetesForm from './components/DiabetesForm';
import RiskGauge from './components/RiskGauge';
import ConsensusCard from './components/ConsensusCard';
import EvidenceBox from './components/EvidenceBox';
import ActionPlan from './components/ActionPlan';
import HistoryView from './components/HistoryView';
import ColdStartBanner from './components/ColdStartBanner';
import { Activity, AlertCircle, ArrowDown, ArrowUp, ExternalLink, Printer, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { COHORT_ARCHETYPES, generateRandomCorrelatedPatient } from './utils/patientGenerator';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getRouteFromLocation() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#/workspace')) {
    const parts = hash.split('/');
    const tab = parts[2] || 'heart';
    return {
      view: 'workspace',
      tab: ['heart', 'diabetes', 'history'].includes(tab) ? tab : 'heart'
    };
  }
  return { view: 'landing', tab: 'heart' };
}

export default function App() {
  const initialRoute = getRouteFromLocation();
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [activeTab, setActiveTab] = useState(initialRoute.tab);
  const [isLoading, setIsLoading] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync state with browser URL & history stack
  const navigateTo = (view, tab = null, options = { push: true }) => {
    const nextTab = tab || (view === 'workspace' ? activeTab || 'heart' : 'heart');
    setCurrentView(view);
    if (view === 'workspace') {
      setActiveTab(nextTab);
    }

    const targetHash = view === 'landing' ? '#/' : `#/workspace/${nextTab}`;
    if (window.location.hash !== targetHash) {
      if (options.push) {
        window.history.pushState({ view, tab: nextTab }, '', targetHash);
      } else {
        window.history.replaceState({ view, tab: nextTab }, '', targetHash);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromLocation();
      setCurrentView(route.view);
      setActiveTab(route.tab);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Normalize initial root hash
    if (!window.location.hash) {
      window.history.replaceState({ view: 'landing', tab: 'heart' }, '', '#/');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // History state for dashboard metrics
  const [history, setHistory] = useState([]);

  // Shared active patient profile across both Heart and Diabetes screenings
  const [activePersona, setActivePersona] = useState(COHORT_ARCHETYPES[3].label);
  const [activePersonaDesc, setActivePersonaDesc] = useState(COHORT_ARCHETYPES[3].description);
  const [heartFormData, setHeartFormData] = useState(COHORT_ARCHETYPES[3].heart);
  const [diabetesFormData, setDiabetesFormData] = useState(COHORT_ARCHETYPES[3].diabetes);

  // Independent result states for each screening track
  const [heartResult, setHeartResult] = useState(null);
  const [diabetesResult, setDiabetesResult] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportInView, setIsReportInView] = useState(false);

  const activeResult = activeTab === 'heart' ? heartResult : activeTab === 'diabetes' ? diabetesResult : null;
  const activeResultType = activeTab === 'heart' ? 'Cardiovascular Disease' : 'Diabetes Mellitus';

  const resultsRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching screening history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Track visibility of report section to show/hide floating button
  useEffect(() => {
    if (!resultsRef.current || !activeResult) {
      setIsReportInView(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReportInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(resultsRef.current);
    return () => observer.disconnect();
  }, [activeResult, activeTab]);

  const scrollToReport = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectArchetype = (archetype) => {
    setActivePersona(archetype.label);
    setActivePersonaDesc(archetype.description);
    setHeartFormData(archetype.heart);
    setDiabetesFormData(archetype.diabetes);
    setHeartResult(null);
    setDiabetesResult(null);
  };

  const handleRandomPatient = () => {
    const randomCase = generateRandomCorrelatedPatient();
    setActivePersona(randomCase.label);
    setActivePersonaDesc(`Correlated random generation: BP (${randomCase.heart.trestbps} mm Hg), peak HR (${randomCase.heart.thalach} bpm), BMI (${randomCase.diabetes.bmi}), and Glucose (${randomCase.diabetes.glucose} mg/dL) coupled to age ${randomCase.heart.age}y and biological sex.`);
    setHeartFormData(randomCase.heart);
    setDiabetesFormData(randomCase.diabetes);
    setHeartResult(null);
    setDiabetesResult(null);
  };

  const handleHeartFieldChange = (name, value) => {
    setHeartFormData(prev => ({ ...prev, [name]: value }));
    // Synchronize common biometric fields (age, sex) across both panels automatically
    if (name === 'age') {
      setDiabetesFormData(prev => ({ ...prev, age: value }));
    }
    setActivePersona('Custom Biometrics');
    setActivePersonaDesc('User-modified clinical values');
    setHeartResult(null);
  };

  const handleDiabetesFieldChange = (name, value) => {
    setDiabetesFormData(prev => ({ ...prev, [name]: value }));
    // Synchronize common biometric fields (age) across both panels automatically
    if (name === 'age') {
      setHeartFormData(prev => ({ ...prev, age: value }));
    }
    setActivePersona('Custom Biometrics');
    setActivePersonaDesc('User-modified clinical values');
    setDiabetesResult(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeartSubmit = async (payload) => {
    setIsLoading(true);
    setErrorMessage(null);
    const coldTimer = setTimeout(() => setColdStartNotice(true), 2500);

    try {
      const res = await fetch(`${API_BASE_URL}/api/predict/heart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setHeartResult(data);
      fetchHistory();

      // Explicit visual movement: Smoothly scroll down to the generated diagnostic report
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to Cardiose Screening API.');
    } finally {
      clearTimeout(coldTimer);
      setColdStartNotice(false);
      setIsLoading(false);
    }
  };

  const handleDiabetesSubmit = async (payload) => {
    setIsLoading(true);
    setErrorMessage(null);
    const coldTimer = setTimeout(() => setColdStartNotice(true), 2500);

    try {
      const res = await fetch(`${API_BASE_URL}/api/predict/diabetes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setDiabetesResult(data);
      fetchHistory();

      // Explicit visual movement: Smoothly scroll down to the generated diagnostic report
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to Cardiose Screening API.');
    } finally {
      clearTimeout(coldTimer);
      setColdStartNotice(false);
      setIsLoading(false);
    }
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterWorkspace={() => navigateTo('workspace', 'heart')}
        onSelectArchetypeAndEnter={(arch) => {
          handleSelectArchetype(arch);
          navigateTo('workspace', 'heart');
        }}
      />
    );
  }

  return (
    <>
      {/* Main Application Shell (hidden during report printing) */}
      <div id="main-app-shell" className="min-h-screen flex bg-[#f6f8fd] text-slate-800">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => navigateTo('workspace', tab)}
          onBackToLanding={() => navigateTo('landing')}
        />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          activeTab={activeTab}
          onNewScreening={(track) => navigateTo('workspace', track)}
          onBackToLanding={() => navigateTo('landing')}
        />

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
          <ColdStartBanner isPending={coldStartNotice} />

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start space-x-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-950">Screening Pipeline Alert</h4>
                <p className="text-xs mt-0.5 text-rose-800">{errorMessage}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  API target: <code className="text-blue-700 font-mono">{API_BASE_URL}</code>
                </p>
              </div>
            </div>
          )}


          {/* Tab 2: Cardiovascular Screening */}
          {activeTab === 'heart' && (
            <div className="space-y-6">
              <HeartForm
                formData={heartFormData}
                activePersona={activePersona}
                activePersonaDesc={activePersonaDesc}
                onChange={handleHeartFieldChange}
                onSelectArchetype={handleSelectArchetype}
                onRandomPatient={handleRandomPatient}
                onSubmit={handleHeartSubmit}
                isLoading={isLoading}
                onShowReport={scrollToReport}
                hasReport={Boolean(heartResult)}
                reportScore={heartResult?.risk_score}
                reportLevel={heartResult?.risk_level}
              />

              {/* Step Navigation Bar: Proceed to Diabetes */}
              <div className="flex items-center justify-end p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('workspace', 'diabetes')}
                  className="flex items-center space-x-2 text-xs font-bold text-white px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                >
                  <span>Next: Diabetes Screening</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Diabetes Screening */}
          {activeTab === 'diabetes' && (
            <div className="space-y-6">
              <DiabetesForm
                formData={diabetesFormData}
                activePersona={activePersona}
                activePersonaDesc={activePersonaDesc}
                onChange={handleDiabetesFieldChange}
                onSelectArchetype={handleSelectArchetype}
                onRandomPatient={handleRandomPatient}
                onSubmit={handleDiabetesSubmit}
                isLoading={isLoading}
                onShowReport={scrollToReport}
                hasReport={Boolean(diabetesResult)}
                reportScore={diabetesResult?.risk_score}
                reportLevel={diabetesResult?.risk_level}
              />

              {/* Step Navigation Bar: Heart <-> History */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('workspace', 'heart')}
                  className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-950 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous: Heart Screening</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('workspace', 'history')}
                  className="flex items-center space-x-2 text-xs font-bold text-white px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                >
                  <span>Next: Screening History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Audit History */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <HistoryView apiBaseUrl={API_BASE_URL} />

              {/* Step Navigation Bar: Diabetes <-> Heart */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('workspace', 'diabetes')}
                  className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-950 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous: Diabetes Screening</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('workspace', 'heart')}
                  className="flex items-center space-x-2 text-xs font-bold text-slate-900 hover:text-blue-600 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 transition border border-slate-200/60"
                >
                  <span>Return to Heart Screening</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Screening Results Section (Displays when a screening is performed for the active track) */}
          {activeResult && (activeTab === 'heart' || activeTab === 'diabetes') && (
            <section
              key={`report-${activeTab}-${activeResult.risk_score}-${activeResult.risk_level}`}
              ref={resultsRef}
              id="diagnostic-report-section"
              className="mt-8 pt-8 border-t border-slate-200 space-y-6 scroll-mt-6 animate-reportEntrance"
            >
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm ${
                activeResult.risk_level === 'HIGH'
                  ? 'bg-rose-50 border-rose-200'
                  : activeResult.risk_level === 'MODERATE'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    activeResult.risk_level === 'HIGH'
                      ? 'bg-rose-100'
                      : activeResult.risk_level === 'MODERATE'
                      ? 'bg-amber-100'
                      : 'bg-emerald-100'
                  }`}>
                    <Activity className={`w-5 h-5 ${
                      activeResult.risk_level === 'HIGH'
                        ? 'text-rose-600'
                        : activeResult.risk_level === 'MODERATE'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Screening Complete — {activeResult.risk_level} RISK
                      </h2>
                      <span className="text-xs font-semibold text-slate-600 bg-white/70 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {activeResultType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Risk score from 3 AI models — plus what caused the flag and what to do next.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center space-x-1.5"
                    title="Scroll up to edit inputs"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Inputs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs border border-blue-700 transition-colors flex items-center space-x-1.5 shadow-sm"
                    title="Open report in focused modal window"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                    <span>View &amp; Print Report</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskGauge
                  score={activeResult.risk_score}
                  level={activeResult.risk_level}
                  diseaseType={activeResultType}
                />
                <ConsensusCard consensus={activeResult.consensus} />
              </div>

              <EvidenceBox evidencePoints={activeResult.evidence_points} />
              <ActionPlan actionPlan={activeResult.action_plan} />
            </section>
          )}
        </main>
      </div>

      {/* Floating "Show Diagnostic Report" pill when report exists and user is scrolled away */}
      {activeResult && (activeTab === 'heart' || activeTab === 'diabetes') && !isReportInView && (
        <button
          type="button"
          onClick={scrollToReport}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl flex items-center space-x-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 border border-blue-400/40 animate-fadeIn no-print"
        >
          <Activity className="w-4 h-4 text-white animate-pulse" />
          <span>Show Diagnostic Report ({activeResult.risk_score}/100)</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      )}
      </div>

      {/* Dedicated Full Diagnostic Report Modal (Rendered outside main-app-shell for clean 1-page printing) */}
      {isReportModalOpen && activeResult && (
        <div
          id="printable-report-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
        >
          <div
            id="printable-report-card"
            className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Cardiose Screening Summary Report
                    </h3>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {activeResultType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cardiose AI Health Screening • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="text-slate-500 hover:text-slate-900 text-sm px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors font-semibold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-avoid-break">
              <RiskGauge
                score={activeResult.risk_score}
                level={activeResult.risk_level}
                diseaseType={activeResultType}
              />
              <ConsensusCard consensus={activeResult.consensus} />
            </div>

            <div className="print-avoid-break">
              <EvidenceBox evidencePoints={activeResult.evidence_points} />
            </div>
            <div className="print-avoid-break">
              <ActionPlan actionPlan={activeResult.action_plan} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
