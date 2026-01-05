import React from 'react';
import { Download } from 'lucide-react';

interface Props {
  onExport: () => void;
  isLoading?: boolean;
}

export const ExportButton: React.FC<Props> = ({ onExport, isLoading }) => {
  return (
    <button
      onClick={onExport}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
    >
      <Download size={16} />
      {isLoading ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};
