
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/pages/Dashboard';
import { Vision } from '@/pages/Vision';
import { Inventory } from '@/pages/Inventory';
import { Alerts } from '@/pages/Alerts';
import { Delivery } from '@/pages/Delivery';
import { Analytics } from '@/pages/Analytics';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
