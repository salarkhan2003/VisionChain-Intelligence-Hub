
import * as React from 'react';
import { VisionDetection } from '@/components/vision/VisionDetection';
import { LiveFeed } from '@/components/vision/LiveFeed';
import { DetectionHistory } from '@/components/vision/DetectionHistory';

export function Vision() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vision AI System</h1>
        <p className="text-gray-600 mt-1">Real-time computer vision for theft detection and inventory tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveFeed />
        <VisionDetection />
      </div>
      
      <DetectionHistory />
    </div>
  );
}
