import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  qrCode: string;
  studentName: string;
  eventName: string;
}

export const QRPreview: React.FC<Props> = ({ qrCode, studentName, eventName }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm mx-auto border border-gray-100">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-green-600" size={32} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Confirmed!</h2>
      <p className="text-gray-500 mb-6">You are all set for {eventName}</p>
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
        {/* Simulated QR Code Pattern */}
        <div className="w-48 h-48 bg-white mx-auto grid grid-cols-4 gap-1 p-2 border border-gray-900">
            {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={`${Math.random() > 0.3 ? 'bg-black' : 'bg-transparent'}`} />
            ))}
        </div>
        <p className="mt-4 text-xs font-mono text-gray-500 break-all">{qrCode}</p>
      </div>

      <div className="text-left bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800"><strong>Name:</strong> {studentName}</p>
        <p className="text-sm text-blue-800 mt-1">Please show this QR code at the entrance.</p>
      </div>
    </div>
  );
};
