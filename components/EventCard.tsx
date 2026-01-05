import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../types';
import { formatDate } from '../utils/format';

interface Props {
  event: Event;
}

export const EventCard: React.FC<Props> = ({ event }) => {
  const isFull = event.registered >= event.capacity;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 w-full overflow-hidden relative">
        <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.status === 'completed' ? 'bg-gray-100 text-gray-600' :
            isFull ? 'bg-red-100 text-red-700' : 
            'bg-green-100 text-green-700'
          }`}>
            {event.status === 'completed' ? 'Completed' : isFull ? 'Full' : 'Available'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{event.title}</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span>{event.registered} / {event.capacity} registered</span>
          </div>
        </div>
        <Link 
          to={`/events/${event.id}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
