export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  banner: string;
  status: 'upcoming' | 'full' | 'completed';
}

export interface Registration {
  id: string;
  eventId: string;
  studentName: string;
  email: string;
  className: string;
  qrCode: string;
  createdAt: string;
  status: 'registered' | 'checked-in';
}

export interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  checkInRate: number;
  recentActivity: Registration[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
