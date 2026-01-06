import React, { useEffect, useState } from 'react';
import { EventCard } from '../../components/EventCard';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { fetchEvents } from '../../api/events';
import { Event } from '../../types';
import { Loader2, SortAsc } from 'lucide-react';

export const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('upcoming');
  const [sort, setSort] = useState('date-asc');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchEvents({ page, limit: 9, q: search, filter, sort });
      setEvents(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error('Failed to load events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(loadEvents, 500);
    return () => clearTimeout(debounce);
  }, [page, search, filter, sort]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
          <p className="text-gray-500 mt-1">Discover and register for upcoming activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="flex-1 sm:w-32 px-4 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="full">Full</option>
              <option value="completed">Completed</option>
            </select>
            <div className="relative flex-1 sm:w-40">
                <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary text-gray-700 appearance-none"
                >
                    <option value="date-asc">Date: Sooner</option>
                    <option value="date-desc">Date: Later</option>
                    <option value="capacity-desc">Largest Capacity</option>
                    <option value="available-desc">Most Available</option>
                </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          <button 
            onClick={() => { setSearch(''); setFilter('all'); setSort('date-asc'); }} 
            className="mt-4 text-primary hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};