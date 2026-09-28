import React, { useState, useEffect, useRef } from 'react';
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
import { Activity, AlertCircle, ArrowDown, ArrowUp, ExternalLink, Printer, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('heart');
  const [isLoading, setIsLoading] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // History state for dashboard metrics
  const [history, setHistory] = useState([]);
  const [selectedAuditItem, setSelectedAuditItem] = useState(null);

  // Result state
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState('Heart Disease');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportInView, setIsReportInView] = useState(false);

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
    if (!resultsRef.current || !result) {
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
  }, [result, activeTab]);

  const scrollToReport = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      setResult(data);
      setResultType('Cardiovascular Disease');
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
      setResult(data);
      setResultType('Diabetes Mellitus');
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

  return (
    <>
      {/* Main Application Shell (hidden during report printing) */}
      <div id="main-app-shell" className="min-h-screen flex bg-[#f6f8fd] text-slate-800">
        {/* Left Navigation Sidebar (MindCare Style) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          activeTab={activeTab}
          onNewScreening={(track) => setActiveTab(track)}
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
                onSubmit={handleHeartSubmit}
                isLoading={isLoading}
                onShowReport={scrollToReport}
                hasReport={result && resultType === 'Cardiovascular Disease'}
                reportScore={result?.risk_score}
                reportLevel={result?.risk_level}
              />
            </div>
          )}

          {/* Tab 3: Diabetes Screening */}
          {activeTab === 'diabetes' && (
            <div className="space-y-6">
              <DiabetesForm
                onSubmit={handleDiabetesSubmit}
                isLoading={isLoading}
                onShowReport={scrollToReport}
                hasReport={result && resultType === 'Diabetes Mellitus'}
                reportScore={result?.risk_score}
                reportLevel={result?.risk_level}
              />
            </div>
          )}

          {/* Tab 4: Audit History */}
          {activeTab === 'history' && (
            <HistoryView apiBaseUrl={API_BASE_URL} />
          )}

          {/* Screening Results Section (Displays when a screening is performed) */}
          {result && (activeTab === 'heart' || activeTab === 'diabetes') && (
            <section
              ref={resultsRef}
              id="diagnostic-report-section"
              className="mt-8 pt-8 border-t border-slate-200 space-y-6 scroll-mt-6 animate-fadeIn"
            >
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm ${
                result.risk_level === 'HIGH'
                  ? 'bg-rose-50 border-rose-200'
                  : result.risk_level === 'MODERATE'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    result.risk_level === 'HIGH'
                      ? 'bg-rose-100'
                      : result.risk_level === 'MODERATE'
                      ? 'bg-amber-100'
                      : 'bg-emerald-100'
                  }`}>
                    <Activity className={`w-5 h-5 ${
                      result.risk_level === 'HIGH'
                        ? 'text-rose-600'
                        : result.risk_level === 'MODERATE'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Screening Complete — {result.risk_level} RISK
                      </h2>
                      <span className="text-xs font-semibold text-slate-600 bg-white/70 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {resultType}
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
                  score={result.risk_score}
                  level={result.risk_level}
                  diseaseType={resultType}
                />
                <ConsensusCard consensus={result.consensus} />
              </div>

              <EvidenceBox evidencePoints={result.evidence_points} />
              <ActionPlan actionPlan={result.action_plan} />
            </section>
          )}
        </main>
      </div>

      {/* Floating "Show Diagnostic Report" pill when report exists and user is scrolled away */}
      {result && (activeTab === 'heart' || activeTab === 'diabetes') && !isReportInView && (
        <button
          type="button"
          onClick={scrollToReport}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl flex items-center space-x-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 border border-blue-400/40 animate-fadeIn no-print"
        >
          <Activity className="w-4 h-4 text-white animate-pulse" />
          <span>Show Diagnostic Report ({result.risk_score}/100)</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      )}
      </div>

      {/* Dedicated Full Diagnostic Report Modal (Rendered outside main-app-shell for clean 1-page printing) */}
      {isReportModalOpen && result && (
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
                      {resultType}
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
                score={result.risk_score}
                level={result.risk_level}
                diseaseType={resultType}
              />
              <ConsensusCard consensus={result.consensus} />
            </div>

            <div className="print-avoid-break">
              <EvidenceBox evidencePoints={result.evidence_points} />
            </div>
            <div className="print-avoid-break">
              <ActionPlan actionPlan={result.action_plan} />
            </div>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal for Dashboard Flags */}
      {selectedAuditItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  selectedAuditItem.risk_level === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {selectedAuditItem.risk_level} ({selectedAuditItem.risk_score}/100)
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {selectedAuditItem.disease_type} Screening Audit
                </span>
              </div>
              <button
                onClick={() => setSelectedAuditItem(null)}
                className="text-slate-500 hover:text-slate-900 text-sm px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Biomarker Evidence:
              </h4>
              <ul className="space-y-1.5">
                {selectedAuditItem.evidence_points?.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>

            {selectedAuditItem.action_plan && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Action Plan:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="text-emerald-800 font-bold block mb-0.5">Dietary:</span>
                    <span className="text-slate-700">{selectedAuditItem.action_plan.dietary}</span>
                  </div>
                  <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                    <span className="text-sky-800 font-bold block mb-0.5">Lifestyle:</span>
                    <span className="text-slate-700">{selectedAuditItem.action_plan.lifestyle}</span>
                  </div>
                  <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                    <span className="text-purple-800 font-bold block mb-0.5">Clinical:</span>
                    <span className="text-slate-700">{selectedAuditItem.action_plan.clinical}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
