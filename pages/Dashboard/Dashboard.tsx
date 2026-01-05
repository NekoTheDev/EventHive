import React, { useEffect, useState } from 'react';
import { StatsCard } from '../../components/StatsCard';
import { ExportButton } from '../../components/ExportButton';
import { fetchStats, fetchRegistrations, checkInUser } from '../../api/registrations';
import { Stats, Registration } from '../../types';
import { Calendar, Users, CheckSquare, Activity, Search } from 'lucide-react';
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
  const { addToast } = useAppStore();

  const loadData = async () => {
    const [statsRes, regsRes] = await Promise.all([
      fetchStats(),
      fetchRegistrations({ page, limit: 10 })
    ]);
    setStats(statsRes);
    setRegistrations(regsRes.data);
    setTotalPages(regsRes.totalPages);
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
        addToast('Already checked in', 'info');
      } else {
        addToast('Invalid QR Code', 'error');
      }
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all for export
      const allRegs = await fetchRegistrations({ limit: 1000 });
      exportRegistrationsToCSV(allRegs.data, `registrations_export_${Date.now()}.csv`);
      addToast('Export started', 'success');
    } catch (e) {
      addToast('Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} color="text-blue-600" />
          <StatsCard title="Total Registrations" value={stats.totalRegistrations} icon={Users} color="text-purple-600" />
          <StatsCard title="Check-in Rate" value={`${stats.checkInRate}%`} icon={Activity} color="text-green-600" />
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-sm font-medium text-gray-500">Quick Check-in</h3>
            <form onSubmit={handleCheckIn} className="mt-2 flex gap-2">
              <input 
                type="text" 
                placeholder="Scan QR..." 
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                className="flex-1 px-3 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-primary" 
              />
              <button type="submit" className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Go</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
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
                      reg.status === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
