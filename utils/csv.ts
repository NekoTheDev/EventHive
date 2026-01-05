import { Registration } from '../types';

export const exportRegistrationsToCSV = (registrations: Registration[], filename: string) => {
  const headers = ['Student Name', 'Email', 'Class', 'Event ID', 'Status', 'Created At'];
  
  const rows = registrations.map(reg => [
    reg.studentName,
    reg.email,
    reg.className,
    reg.eventId,
    reg.status,
    new Date(reg.createdAt).toISOString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
