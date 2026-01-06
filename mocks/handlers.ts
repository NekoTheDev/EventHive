import { http, HttpResponse, delay } from 'msw';
import { mockEvents, mockRegistrations } from './data';
import { Event, Registration } from '../types';

// Simulate realistic network latency
const NETWORK_DELAY = 600;

// Helper to safely parse URL parameters
const getSearchParams = (requestUrl: string) => {
  try {
    if (!requestUrl) return new URLSearchParams();
    const url = new URL(requestUrl, 'http://localhost');
    return url.searchParams;
  } catch (error) {
    console.warn('Failed to parse URL:', requestUrl, error);
    return new URLSearchParams();
  }
};

export const handlers = [
  // GET /api/events
  http.get('/api/events', async ({ request }) => {
    await delay(NETWORK_DELAY);
    
    const params = getSearchParams(request.url);
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');
    const q = params.get('q')?.toLowerCase() || '';
    const filter = params.get('filter') || 'all';
    const sort = params.get('sort') || 'date-asc';

    let filteredEvents = mockEvents.filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(q) || evt.description.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || evt.status === filter;
      return matchesSearch && matchesFilter;
    });

    // Sorting Logic
    filteredEvents.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'capacity-desc':
          return b.capacity - a.capacity;
        case 'available-desc':
          return (b.capacity - b.registered) - (a.capacity - a.registered);
        case 'date-asc':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    const total = filteredEvents.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedData = filteredEvents.slice(start, start + limit);

    return HttpResponse.json({
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    });
  }),

  // GET /api/events/:id
  http.get('/api/events/:id', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const event = mockEvents.find(e => e.id === params.id);
    
    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(event);
  }),

  // POST /api/events/:id/register
  http.post('/api/events/:id/register', async ({ params, request }) => {
    await delay(NETWORK_DELAY);
    const { id } = params;
    
    let body: any = {};
    try {
        body = await request.json();
    } catch(e) {
        return new HttpResponse('Invalid JSON', { status: 400 });
    }

    const eventIndex = mockEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) return new HttpResponse(null, { status: 404 });

    const event = mockEvents[eventIndex];
    if (event.registered >= event.capacity) {
        return new HttpResponse(JSON.stringify({ message: 'Event is full' }), { status: 400 });
    }

    // Update event count
    mockEvents[eventIndex].registered += 1;

    // Create registration
    const newReg: Registration = {
      id: Math.random().toString(36).substring(7),
      eventId: id as string,
      studentName: body.studentName,
      email: body.email,
      className: body.className,
      qrCode: `QR_${id}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'registered'
    };

    mockRegistrations.unshift(newReg);

    return HttpResponse.json(newReg);
  }),

  // GET /api/registrations
  http.get('/api/registrations', async ({ request }) => {
    await delay(NETWORK_DELAY);
    const params = getSearchParams(request.url);
    const eventId = params.get('eventId');
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');
    const q = params.get('q')?.toLowerCase() || '';

    let filtered = mockRegistrations;

    if (eventId) {
      filtered = filtered.filter(r => r.eventId === eventId);
    }

    if (q) {
      filtered = filtered.filter(r => 
        r.studentName.toLowerCase().includes(q) || 
        r.email.toLowerCase().includes(q)
      );
    }

    // Sort by created recent
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const paginatedData = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);

    return HttpResponse.json({
      data: paginatedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  }),

  // GET /api/stats
  http.get('/api/stats', async () => {
    await delay(NETWORK_DELAY);
    const totalEvents = mockEvents.length;
    const totalRegistrations = mockRegistrations.length;
    const checkedIn = mockRegistrations.filter(r => r.status === 'checked-in').length;
    const checkInRate = totalRegistrations ? Math.round((checkedIn / totalRegistrations) * 100) : 0;
    
    // Get recent 5
    const recentActivity = [...mockRegistrations]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return HttpResponse.json({
      totalEvents,
      totalRegistrations,
      checkInRate,
      recentActivity
    });
  }),

  // POST /api/checkin/:qrCode
  http.post('/api/checkin/:qrCode', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const { qrCode } = params;
    const regIndex = mockRegistrations.findIndex(r => r.qrCode === qrCode);

    if (regIndex === -1) {
      return new HttpResponse(JSON.stringify({ message: 'Invalid QR Code' }), { status: 404 });
    }

    const reg = mockRegistrations[regIndex];
    if (reg.status === 'checked-in') {
      return new HttpResponse(JSON.stringify({ message: 'Already checked in', registration: reg }), { status: 409 });
    }

    mockRegistrations[regIndex].status = 'checked-in';
    
    return HttpResponse.json({ message: 'Check-in successful', registration: mockRegistrations[regIndex] });
  })
];