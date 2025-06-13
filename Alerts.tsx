
import * as React from 'react';
import { AlertsList } from '@/components/alerts/AlertsList';
import { AlertsOverview } from '@/components/alerts/AlertsOverview';
import { SecurityMonitoring } from '@/components/alerts/SecurityMonitoring';

export function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security & Theft Alerts</h1>
        <p className="text-gray-600 mt-1">AI-powered theft detection and security monitoring system</p>
      </div>

      <AlertsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList />
        <SecurityMonitoring />
      </div>
    </div>
  );
}
