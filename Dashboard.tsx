import * as React from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentEvents } from '@/components/dashboard/RecentEvents';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { LiveMetrics } from '@/components/dashboard/LiveMetrics';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';

export function Dashboard() {
  return (
    <div className="space-y-8 dark-pattern min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl glow-blue">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 text-shadow neon-blue">
                VisionChain Intelligence Hub
              </h1>
              <p className="text-slate-200 text-lg font-medium">
                AI-Powered Retail Intelligence & Supply Chain Management Platform
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-200 text-sm font-medium">All Systems Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-200 text-sm font-medium">AI Models Active</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <WeatherWidget />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          <LiveMetrics />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentEvents />
            <SystemStatus />
          </div>
          
          <QuickActions />
        </div>
        
        <div className="xl:col-span-1">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}
