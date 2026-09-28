import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

export default function ColdStartBanner({ isPending }) {
  if (!isPending) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start space-x-3 shadow-md animate-pulse">
      <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-amber-900">Processing Clinical Screening...</h4>
        <p className="text-xs text-amber-800 mt-0.5">
          If this is the initial request on a cloud free-tier environment (e.g. Render), instances may spin down on inactivity and take 30–50 seconds to warm up. Once active, inferences execute in &lt;10ms.
        </p>
      </div>
    </div>
  );
}
