import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export const StatsCard: React.FC<Props> = ({ title, value, icon: Icon, color = "text-primary" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
      <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        <Icon className={color} size={24} />
      </div>
    </div>
  );
};
