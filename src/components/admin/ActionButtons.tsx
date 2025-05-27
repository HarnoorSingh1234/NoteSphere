'use client';

import React from 'react';
import Link from 'next/link';
import { FilePlus2, ClipboardCheck, FileWarning } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionButtonsProps {
  stats: {
    pending: number;
    rejected: number;
  };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/admin/notes/pending"
        className="px-4 py-2 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
      >
        <motion.div 
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ClipboardCheck className="w-5 h-5" />
        </motion.div>
        <span>Pending Notes{stats.pending > 0 && <span className="ml-1 px-1.5 py-0.5 bg-[#E99F4C] text-white text-xs rounded-full">
          {stats.pending}
        </span>}</span>
      </Link>
      
      <Link
        href="/admin/notes/rejected"
        className="px-4 py-2 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#DE5499] flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
      >
        <motion.div 
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <FileWarning className="w-5 h-5" />
        </motion.div>
        <span>Rejected Notes{stats.rejected > 0 && <span className="ml-1 px-1.5 py-0.5 bg-[#DE5499] text-white text-xs rounded-full">
          {stats.rejected}
        </span>}</span>
      </Link>
      
      <Link
        href="/admin/notes/create"
        className="px-4 py-2 bg-[#7BB4B1] text-white border-[0.2em] border-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
      >
        <motion.div 
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <FilePlus2 className="w-5 h-5" />
        </motion.div>
        <span>Add Note</span>
      </Link>
    </div>
  );
};

export default ActionButtons;