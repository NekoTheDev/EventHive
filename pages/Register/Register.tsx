import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerForEvent, fetchEventById } from '../../api/events';
import { FormInput } from '../../components/FormInput';
import { QRPreview } from '../../components/QRPreview';
import { useAppStore } from '../../store/events.store';
import { Registration } from '../../types';
import { Loader2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { addToast } = useAppStore();
  
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState('');
  const [regData, setRegData] = useState<Registration | null>(null);

  const [form, setForm] = useState({
    studentName: '',
    email: '',
    className: ''
  });

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId).then(e => setEventName(e.title)).catch(() => navigate('/404'));
    }
  }, [eventId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    // Simple validation
    if (!form.studentName || !form.email || !form.className) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      addToast('Invalid email format', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await registerForEvent(eventId, form);
      setRegData(data);
      setStep('success');
      addToast('Registration successful!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success' && regData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <QRPreview 
          qrCode={regData.qrCode} 
          studentName={regData.studentName} 
          eventName={eventName} 
        />
        <div className="mt-8 flex gap-4">
          <button onClick={() => window.print()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Print Ticket
          </button>
          <button onClick={() => navigate('/events')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
            Browse More Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Register</h1>
          <p className="text-gray-500 mt-1">{eventName || 'Loading event...'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            placeholder="John Doe"
            value={form.studentName}
            onChange={(e) => setForm({...form, studentName: e.target.value})}
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            placeholder="john@university.edu"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
          <FormInput
            label="Class / Grade"
            placeholder="Class of 2024"
            value={form.className}
            onChange={(e) => setForm({...form, className: e.target.value})}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
