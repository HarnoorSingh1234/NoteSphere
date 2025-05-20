'use client';

import React from 'react';
import Link from 'next/link';
import { FilePlus2, ClipboardCheck, FileWarning } from 'lucide-react';

interface ActionButtonsProps {
  stats: {
    pending: number;
    rejected: number;
  };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/admin/notes/pending"
        className="px-4 py-2 bg-[#ff7849] text-white rounded-lg flex items-center gap-2 hover:bg-[#ff6a35] transition-colors"
      >
        <ClipboardCheck className="w-5 h-5" />
        <span>Pending Notes{stats.pending > 0 && ` (${stats.pending})`}</span>
      </Link>
      
      <Link
        href="/admin/notes/rejected"
        className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg flex items-center gap-2 hover:bg-[#c53030] transition-colors"
      >
        <FileWarning className="w-5 h-5" />
        <span>Rejected Notes{stats.rejected > 0 && ` (${stats.rejected})`}</span>
      </Link>
      
      <Link
        href="/admin/notes/create"
        className="px-4 py-2 bg-[#050505] text-white rounded-lg flex items-center gap-2 hover:bg-[#2d2d2d] transition-colors"
      >
        <FilePlus2 className="w-5 h-5" />
        <span>Add Note</span>
      </Link>
    </div>
  );
};

export default ActionButtons;