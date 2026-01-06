import React, { useEffect, useState } from 'react';
import { StatsCard } from '../../components/StatsCard';
import { ExportButton } from '../../components/ExportButton';
import { fetchStats, fetchRegistrations, checkInUser } from '../../api/registrations';
import { Stats, Registration } from '../../types';
import { Calendar, Users, Activity, QrCode, RefreshCw } from 'lucide-react';
import { Pagination } from '../../components/Pagination';
import { exportRegistrationsToCSV } from '../../utils/csv';
import { useAppStore } from '../../store/events.store';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { addToast } = useAppStore();

  const loadData = async () => {
    setRefreshing(true);
    try {
        const [statsRes, regsRes] = await Promise.all([
        fetchStats(),
        fetchRegistrations({ page, limit: 10 })
        ]);
        setStats(statsRes);
        setRegistrations(regsRes.data);
        setTotalPages(regsRes.totalPages);
    } catch(e) {
        console.error(e);
        addToast('Failed to load dashboard data', 'error');
    } finally {
        setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!qrInput) return;
    try {
      await checkInUser(qrInput);
      addToast('Check-in successful!', 'success');
      setQrInput('');
      loadData(); // Refresh stats
    } catch (err: any) {
      if(err.response?.status === 409) {
        addToast('User already checked in', 'info');
      } else {
        addToast('Invalid QR Code or Registration not found', 'error');
      }
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all for export
      const allRegs = await fetchRegistrations({ limit: 1000 });
      exportRegistrationsToCSV(allRegs.data, `registrations_export_${Date.now()}.csv`);
      addToast('Export started successfully', 'success');
    } catch (e) {
      addToast('Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button 
            onClick={loadData} 
            disabled={refreshing}
            className={`p-2 rounded-lg border border-gray-200 hover:bg-white bg-gray-50 text-gray-600 transition-all ${refreshing ? 'opacity-70' : ''}`}
            title="Refresh Data"
        >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} color="text-blue-600" />
          <StatsCard title="Total Registrations" value={stats.totalRegistrations} icon={Users} color="text-purple-600" />
          <StatsCard title="Check-in Rate" value={`${stats.checkInRate}%`} icon={Activity} color="text-green-600" />
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 text-white flex flex-col justify-between">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <QrCode size={16} /> Quick Check-in
            </h3>
            <form onSubmit={handleCheckIn} className="mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Scan / Enter QR..." 
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white text-sm outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400" 
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                Go
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Recent Registrations</h2>
          <ExportButton onExport={handleExport} isLoading={loading} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Class</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{reg.studentName}</td>
                  <td className="px-6 py-4 text-gray-600">{reg.email}</td>
                  <td className="px-6 py-4 text-gray-600">{reg.className}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      reg.status === 'checked-in' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {reg.status === 'checked-in' ? 'Checked In' : 'Registered'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No registrations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};