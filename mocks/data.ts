import { Event, Registration } from '../types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock Events
export const mockEvents: Event[] = Array.from({ length: 15 }).map((_, i) => {
  const isPast = i > 10;
  const isFull = i === 2 || i === 5;
  const capacity = 50 + Math.floor(Math.random() * 100);
  const registered = isFull ? capacity : Math.floor(Math.random() * (capacity - 1));

  return {
    id: `evt_${i + 1}`,
    title: `Event ${i + 1}: ${['Tech Talk', 'Hackathon', 'Workshop', 'Meetup', 'Career Fair'][i % 5]}`,
    description: 'Join us for an amazing experience where you will learn, network, and have fun. This event covers various topics relevant to students.',
    date: new Date(Date.now() + (isPast ? -1 : 1) * (i * 86400000 * 2)).toISOString(),
    location: `Building ${String.fromCharCode(65 + (i % 5))}, Room ${100 + i}`,
    capacity,
    registered,
    banner: `https://picsum.photos/800/400?random=${i}`,
    status: isPast ? 'completed' : isFull ? 'full' : 'upcoming',
  };
});

// Mock Registrations
export const mockRegistrations: Registration[] = [];

// Seed some registrations
mockEvents.forEach(evt => {
  for (let i = 0; i < Math.min(evt.registered, 10); i++) {
    mockRegistrations.push({
      id: generateId(),
      eventId: evt.id,
      studentName: `Student ${i}`,
      email: `student${i}@university.edu`,
      className: `Class of 202${4 + (i % 4)}`,
      qrCode: `QR_${evt.id}_${i}`,
      createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      status: Math.random() > 0.7 ? 'checked-in' : 'registered'
    });
  }
});
