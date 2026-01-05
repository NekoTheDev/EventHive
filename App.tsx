import React from 'react';
import { Routes, Route, Link, HashRouter } from 'react-router-dom';
import { EventsList } from './pages/EventsList/EventsList';
import { EventDetail } from './pages/EventDetail/EventDetail';
import { Register } from './pages/Register/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { LayoutDashboard, Compass, Ticket } from 'lucide-react';
import { useAppStore } from './store/events.store';

const ToastContainer = () => {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          onClick={() => removeToast(toast.id)}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium cursor-pointer animate-in slide-in-from-right fade-in duration-300 ${
            toast.type === 'success' ? 'bg-green-500' : 
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

const Navigation = () => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <Ticket className="text-primary" size={28} />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          EventHive
        </span>
      </Link>
      <div className="flex gap-6">
        <Link to="/events" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <Compass size={18} />
          <span className="hidden sm:inline">Events</span>
        </Link>
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <LayoutDashboard size={18} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/register/:eventId" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div className="p-20 text-center">Page Not Found</div>} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
