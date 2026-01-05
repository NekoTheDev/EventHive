import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../../api/events';
import { Event } from '../../types';
import { Calendar, MapPin, Users, ArrowLeft, Share2 } from 'lucide-react';
import { formatDate } from '../../utils/format';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-400">Loading details...</div>;
  if (error || !event) return <div className="text-center py-20 text-red-500">Event not found.</div>;

  const isFull = event.registered >= event.capacity;
  const isPast = new Date(event.date) < new Date();
  const canRegister = !isFull && !isPast && event.status !== 'completed';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Events
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-64 md:h-80 w-full relative">
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 w-full text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm md:text-base opacity-90">
                <span className="flex items-center gap-2"><Calendar size={18} /> {formatDate(event.date)}</span>
                <span className="flex items-center gap-2"><MapPin size={18} /> {event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Registration Info</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Capacity</span>
                <span className="font-medium">{event.capacity} seats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Registered</span>
                <span className="font-medium">{event.registered} people</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
                ></div>
              </div>
            </div>

            {canRegister ? (
              <Link 
                to={`/register/${event.id}`}
                className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
              >
                Register Now
              </Link>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed">
                {isPast ? 'Event Ended' : 'Sold Out'}
              </button>
            )}
            
            <p className="text-xs text-center text-gray-400 mt-4">
              {canRegister ? 'Spots filling up fast!' : 'Check back later for cancellations.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
