
import * as React from 'react';
import { InventoryOverview } from '@/components/inventory/InventoryOverview';
import { ShelfMonitoring } from '@/components/inventory/ShelfMonitoring';
import { StockAlerts } from '@/components/inventory/StockAlerts';

export function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Inventory Management</h1>
        <p className="text-gray-600 mt-1">Real-time shelf monitoring with IoT sensors and AI insights</p>
      </div>

      <InventoryOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShelfMonitoring />
        <StockAlerts />
      </div>
    </div>
  );
}
