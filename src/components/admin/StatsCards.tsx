'use client';

import React from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total Notes Card */}
      <motion.div variants={cardVariants}>
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] p-6 hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_#7BB4B1] transition-all duration-300 relative overflow-hidden">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.4em] z-10"></div>
          
          <div className="flex items-center justify-between relative z-[1]">
            <div>
              <p className="text-sm text-[#264143]/70 mb-1 font-medium">Total Notes</p>
              <h3 className="text-3xl font-bold text-[#264143]">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] flex items-center justify-center shadow-[0.1em_0.1em_0_#E99F4C]">
              <FileText className="w-6 h-6 text-[#264143]" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Approved Notes Card */}
      <motion.div variants={cardVariants}>
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] p-6 hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_#7BB4B1] transition-all duration-300 relative overflow-hidden">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.4em] z-10"></div>
          
          <div className="flex items-center justify-between relative z-[1]">
            <div>
              <p className="text-sm text-[#264143]/70 mb-1 font-medium">Approved Notes</p>
              <h3 className="text-3xl font-bold text-[#264143]">{stats.approved}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] flex items-center justify-center shadow-[0.1em_0.1em_0_#E99F4C]">
              <CheckCircle className="w-6 h-6 text-[#7BB4B1]" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Pending Notes Card */}
      <motion.div variants={cardVariants}>
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] p-6 hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_#E99F4C] transition-all duration-300 relative overflow-hidden">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.4em] z-10"></div>
          
          <div className="flex items-center justify-between relative z-[1]">
            <div>
              <p className="text-sm text-[#264143]/70 mb-1 font-medium">Pending Notes</p>
              <h3 className="text-3xl font-bold text-[#264143]">{stats.pending}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E99F4C]/20 border-[0.15em] border-[#264143] flex items-center justify-center shadow-[0.1em_0.1em_0_#7BB4B1]">
              <Clock className="w-6 h-6 text-[#E99F4C]" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Rejected Notes Card */}
      <motion.div variants={cardVariants}>
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-6 hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_#DE5499] transition-all duration-300 relative overflow-hidden">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.4em] z-10"></div>
          
          <div className="flex items-center justify-between relative z-[1]">
            <div>
              <p className="text-sm text-[#264143]/70 mb-1 font-medium">Rejected Notes</p>
              <h3 className="text-3xl font-bold text-[#264143]">{stats.rejected}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#DE5499]/20 border-[0.15em] border-[#264143] flex items-center justify-center shadow-[0.1em_0.1em_0_#7BB4B1]">
              <XCircle className="w-6 h-6 text-[#DE5499]" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsCards;