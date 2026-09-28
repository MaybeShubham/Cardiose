import React, { useState, useEffect } from 'react';
import { History, Heart, Droplets, RefreshCw, Calendar, FileText } from 'lucide-react';

export default function HistoryView({ apiBaseUrl }) {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/history?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [apiBaseUrl]);

  const filteredHistory = history.filter(item => {
    if (filter === 'ALL') return true;
    return item.disease_type === filter;
  });

  const getRiskBadge = (level) => {
    switch (level) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
            <History className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Screening Audit Log & History</h2>
            <p className="text-xs text-slate-500">
              Every screening is automatically saved. Click any row to review it.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilter('HEART')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'HEART' ? 'bg-white text-rose-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Heart
            </button>
            <button
              onClick={() => setFilter('DIABETES')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'DIABETES' ? 'bg-white text-teal-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diabetes
            </button>
          </div>

          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all border border-slate-200 shadow-xs"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Screening Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Run a Heart or Diabetes screening from the sidebar to see records here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 font-bold">Date & Time</th>
                <th className="px-4 py-3.5 font-bold">Track</th>
                <th className="px-4 py-3.5 font-bold">Triangulated Risk</th>
                <th className="px-4 py-3.5 font-bold">Model Agreement (LR / RF / NB)</th>
                <th className="px-4 py-3.5 font-bold">Drivers Flagged</th>
                <th className="px-4 py-3.5 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredHistory.map((item, idx) => {
                const date = item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : 'Just now';
                const isHeart = item.disease_type === 'HEART';
                const lr = item.model_breakdown?.logistic_regression ?? '-';
                const rf = item.model_breakdown?.random_forest ?? '-';
                const nb = item.model_breakdown?.naive_bayes ?? '-';

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{date}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isHeart
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}>
                        {isHeart ? <Heart className="w-3 h-3 text-rose-500" /> : <Droplets className="w-3 h-3 text-teal-600" />}
                        <span>{item.disease_type}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900">{item.risk_score}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getRiskBadge(item.risk_level)}`}>
                          {item.risk_level}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      LR: {typeof lr === 'number' ? `${Math.round(lr * 100)}%` : lr} | RF: {typeof rf === 'number' ? `${Math.round(rf * 100)}%` : rf} | NB: {typeof nb === 'number' ? `${Math.round(nb * 100)}%` : nb}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">
                      {item.evidence_points?.length || 0} biological marker(s)
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskBadge(selectedItem.risk_level)}`}>
                  {selectedItem.risk_level} ({selectedItem.risk_score}/100)
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {selectedItem.disease_type} Screening Audit #{selectedItem.id ? selectedItem.id.substring(0, 8) : 'RECORD'}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-500 hover:text-slate-900 text-sm px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Flagged Biomarkers & Clinical Evidence:
              </h4>
              <ul className="space-y-1.5">
                {selectedItem.evidence_points?.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>

            {selectedItem.action_plan && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Action Plan:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <span className="text-emerald-800 font-bold block mb-0.5">Dietary:</span>
                    <span className="text-slate-700">{selectedItem.action_plan.dietary}</span>
                  </div>
                  <div className="p-2.5 bg-sky-50/60 rounded-lg border border-sky-100">
                    <span className="text-sky-800 font-bold block mb-0.5">Lifestyle:</span>
                    <span className="text-slate-700">{selectedItem.action_plan.lifestyle}</span>
                  </div>
                  <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-100">
                    <span className="text-purple-800 font-bold block mb-0.5">Clinical:</span>
                    <span className="text-slate-700">{selectedItem.action_plan.clinical}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
