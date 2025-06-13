
import * as React from 'react';
import { DeliveryOverview } from '@/components/delivery/DeliveryOverview';
import { RouteOptimization } from '@/components/delivery/RouteOptimization';
import { VehicleStatus } from '@/components/delivery/VehicleStatus';

export function Delivery() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Delivery Management</h1>
        <p className="text-gray-600 mt-1">AI-powered route optimization and last-mile delivery tracking</p>
      </div>

      <DeliveryOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RouteOptimization />
        <VehicleStatus />
      </div>
    </div>
  );
}
