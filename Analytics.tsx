
import * as React from 'react';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { DemandForecasting } from '@/components/analytics/DemandForecasting';
import { PerformanceMetrics } from '@/components/analytics/PerformanceMetrics';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Advanced analytics powered by Gemini AI for data-driven decisions</p>
      </div>

      <AnalyticsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemandForecasting />
        <PerformanceMetrics />
      </div>
    </div>
  );
}
