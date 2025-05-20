'use client';

import React from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Notes Card */}
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#4d61ff] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#050505]/70 mb-1">Total Notes</p>
            <h3 className="text-3xl font-bold text-[#050505]">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#4d61ff]/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#4d61ff]" />
          </div>
        </div>
      </div>
      
      {/* Approved Notes Card */}
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#10b981] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#050505]/70 mb-1">Approved Notes</p>
            <h3 className="text-3xl font-bold text-[#050505]">{stats.approved}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#10b981]" />
          </div>
        </div>
      </div>
      
      {/* Pending Notes Card */}
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#ff7849] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#050505]/70 mb-1">Pending Notes</p>
            <h3 className="text-3xl font-bold text-[#050505]">{stats.pending}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ff7849]/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#ff7849]" />
          </div>
        </div>
      </div>
      
      {/* Rejected Notes Card */}
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#e53e3e] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#050505]/70 mb-1">Rejected Notes</p>
            <h3 className="text-3xl font-bold text-[#050505]">{stats.rejected}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#e53e3e]/10 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-[#e53e3e]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;