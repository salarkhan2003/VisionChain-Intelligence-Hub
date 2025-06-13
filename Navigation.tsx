import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Camera, 
  Package, 
  AlertTriangle, 
  Truck, 
  BarChart3,
  Eye,
  MessageSquare,
  Settings,
  Bell,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vision AI', href: '/vision', icon: Eye },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Delivery', href: '/delivery', icon: Truck },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Navigation() {
  const location = useLocation();
  const [notifications, setNotifications] = React.useState(3);

  return (
    <nav className="bg-slate-900/95 border-b border-indigo-500/30 shadow-2xl sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg glow-blue">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent neon-blue">
                  VisionChain
                </span>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  AI Retail Intelligence Platform
                </div>
              </div>
            </Link>
            
            <div className="hidden lg:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 interactive-element',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg glow-blue'
                        : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-800/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.name === 'Alerts' && notifications > 0 && (
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full">
                        {notifications}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-slate-800/50 text-slate-300 hover:text-indigo-400">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">AI Assistant</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="relative hover:bg-slate-800/50 text-slate-300 hover:text-indigo-400">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="hover:bg-slate-800/50 text-slate-300 hover:text-indigo-400">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
              <div className="text-sm text-slate-300">
                <div className="font-semibold">Store Manager</div>
                <div className="text-xs text-slate-500">Supercenter #1</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg glow-purple">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
