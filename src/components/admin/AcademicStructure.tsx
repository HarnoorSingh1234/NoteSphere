'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Book, Notebook, FileText, Edit, Trash2, Plus } from 'lucide-react';
import { Year, Semester, Subject } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface AcademicStructureProps {
  years: Year[];
}

const AcademicStructure: React.FC<AcademicStructureProps> = ({ years }) => {
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({});
  
  const toggleYear = (yearId: string) => {
    setExpandedYears(prev => ({
      ...prev,
      [yearId]: !prev[yearId]
    }));
  };
  
  const toggleSemester = (semesterId: string) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semesterId]: !prev[semesterId]
    }));
  };
  
  return (
    <div className="p-6 relative z-[1]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-[0.4em] bg-[#EDDCD9]/50 border-[0.15em] border-[#264143] flex items-center justify-center shadow-[0.15em_0.15em_0_#E99F4C]">
          <Book className="w-5 h-5 text-[#264143]" />
        </div>
        <h2 className="text-xl font-bold text-[#264143]">Academic Structure</h2>
      </div>
      
      {years.length === 0 ? (
        <div className="text-center py-10 px-6 bg-[#EDDCD9]/20 border-[0.15em] border-[#264143]/10 border-dashed rounded-[0.5em]">
          <p className="text-[#264143]/70 mb-6 font-medium">No academic years found yet.</p>
          <Link
            href="/admin/years/create"
            className="px-5 py-2.5 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] inline-flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create Your First Year
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {years.map((year) => (
            <motion.div 
              key={year.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-[0.15em] border-[#264143] rounded-[0.5em] overflow-hidden bg-white"
            >
              {/* Year Header */}
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-[#EDDCD9]/20 transition-colors ${expandedYears[year.id] ? 'bg-[#EDDCD9]/10' : ''}`}
                onClick={() => toggleYear(year.id)}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: expandedYears[year.id] ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full bg-[#7BB4B1]/20 border-[0.1em] border-[#264143] flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4 text-[#264143]" />
                  </motion.div>
                  <div className="w-8 h-8 rounded-[0.3em] bg-[#7BB4B1]/20 border-[0.1em] border-[#264143] flex items-center justify-center">
                    <Book className="w-4 h-4 text-[#264143]" />
                  </div>
                  <span className="font-bold text-[#264143]">Year {year.number}</span>
                  <span className="text-xs bg-[#EDDCD9]/40 px-2 py-1 rounded-full text-[#264143]/70 font-medium border-[0.1em] border-[#264143]/20">
                    {year.semesters?.length || 0} semester(s)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/years/${year.id}/edit`} 
                    className="p-1.5 bg-white border-[0.1em] border-[#264143] rounded-[0.3em] hover:bg-[#7BB4B1]/10 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="w-4 h-4 text-[#264143]" />
                  </Link>
                  {(year.semesters?.length || 0) === 0 && (
                    <button 
                      className="p-1.5 bg-white border-[0.1em] border-[#264143] rounded-[0.3em] hover:bg-[#DE5499]/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add delete logic here
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-[#DE5499]" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Year Content */}
              <AnimatePresence>
                {expandedYears[year.id] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-10 pr-4 pb-4 pt-2">
                      {year.semesters?.length === 0 ? (
                        <div className="text-center py-6 bg-[#EDDCD9]/10 rounded-[0.4em] border-[0.1em] border-[#264143]/10 border-dashed">
                          <p className="text-sm text-[#264143]/70 mb-3 font-medium">No semesters in this year yet.</p>
                          <Link
                            href={`/admin/semesters/create?yearId=${year.id}`}
                            className="text-sm px-3 py-1.5 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.3em] shadow-[0.15em_0.15em_0_#7BB4B1] inline-flex items-center gap-1.5 hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Semester
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {year.semesters?.map((semester) => (
                            <motion.div 
                              key={semester.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-[0.15em] border-[#264143]/70 rounded-[0.4em] overflow-hidden bg-white"
                            >
                              {/* Semester Header */}
                              <div 
                                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-[#EDDCD9]/20 transition-colors ${expandedSemesters[semester.id] ? 'bg-[#EDDCD9]/10' : ''}`}
                                onClick={() => toggleSemester(semester.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    animate={{ rotate: expandedSemesters[semester.id] ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-5 h-5 rounded-full bg-[#E99F4C]/20 border-[0.1em] border-[#264143] flex items-center justify-center"
                                  >
                                    <ChevronRight className="w-3 h-3 text-[#264143]" />
                                  </motion.div>
                                  <div className="w-6 h-6 rounded-[0.3em] bg-[#E99F4C]/20 border-[0.1em] border-[#264143] flex items-center justify-center">
                                    <Notebook className="w-3.5 h-3.5 text-[#264143]" />
                                  </div>
                                  <span className="font-bold text-[#264143]">Semester {semester.number}</span>
                                  <span className="text-xs bg-[#EDDCD9]/40 px-2 py-0.5 rounded-full text-[#264143]/70 font-medium border-[0.1em] border-[#264143]/10">
                                    {semester.subjects?.length || 0} subject(s)
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1.5">
                                  <Link 
                                    href={`/admin/semesters/${semester.id}/edit`} 
                                    className="p-1 bg-white border-[0.1em] border-[#264143] rounded-[0.3em] hover:bg-[#7BB4B1]/10 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Edit className="w-3.5 h-3.5 text-[#264143]" />
                                  </Link>
                                  {(semester.subjects?.length || 0) === 0 && (
                                    <button 
                                      className="p-1 bg-white border-[0.1em] border-[#264143] rounded-[0.3em] hover:bg-[#DE5499]/10 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Add delete logic here
                                      }}
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-[#DE5499]" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              {/* Semester Content */}
                              <AnimatePresence>
                                {expandedSemesters[semester.id] && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-10 pr-3 pb-3 pt-1">
                                      {semester.subjects?.length === 0 ? (
                                        <div className="text-center py-4 bg-[#EDDCD9]/10 rounded-[0.3em] border-[0.1em] border-[#264143]/10 border-dashed">
                                          <p className="text-sm text-[#264143]/70 mb-2">No subjects in this semester yet.</p>
                                          <Link
                                            href={`/admin/subjects/create?semesterId=${semester.id}`}
                                            className="text-xs px-3 py-1.5 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.3em] shadow-[0.1em_0.1em_0_#7BB4B1] inline-flex items-center gap-1.5 hover:translate-y-[-0.1em] hover:shadow-[0.15em_0.15em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#7BB4B1] transition-all duration-200"
                                          >
                                            <Plus className="w-3 h-3" />
                                            Add Subject
                                          </Link>
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          {semester.subjects?.map((subject) => (
                                            <motion.div 
                                              key={subject.id} 
                                              initial={{ opacity: 0, y: 5 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className="border-[0.1em] border-[#264143]/50 rounded-[0.3em] bg-white p-2.5"
                                            >
                                              {/* Subject Header */}
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-5 h-5 rounded-[0.2em] bg-[#7BB4B1]/20 border-[0.1em] border-[#264143] flex items-center justify-center">
                                                    <FileText className="w-3 h-3 text-[#264143]" />
                                                  </div>
                                                  <span className="font-medium text-[#264143]">{subject.name}</span>
                                                  <span className="text-xs bg-[#EDDCD9]/40 px-1.5 py-0.5 rounded-full text-[#264143]/70 font-medium">
                                                    {subject.code}
                                                  </span>
                                                  <span className="text-xs bg-[#7BB4B1]/20 px-1.5 py-0.5 rounded-full text-[#264143]/70 font-medium">
                                                    {subject._count?.notes ?? subject.notes?.length ?? 0} note(s)
                                                  </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-1.5">
                                                  <Link 
                                                    href={`/admin/notes/subject/${subject.id}`} 
                                                    className="text-xs px-2 py-1 bg-white border-[0.1em] border-[#264143] text-[#264143] font-medium rounded-[0.3em] shadow-[0.1em_0.1em_0_#7BB4B1] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#7BB4B1] transition-all duration-200"
                                                  >
                                                    View Notes
                                                  </Link>
                                                  <Link 
                                                    href={`/admin/subjects/${subject.id}/edit`} 
                                                    className="p-1 bg-white border-[0.1em] border-[#264143] rounded-[0.2em] hover:bg-[#7BB4B1]/10 transition-colors"
                                                  >
                                                    <Edit className="w-3 h-3 text-[#264143]" />
                                                  </Link>
                                                  {((subject._count?.notes ?? subject.notes?.length ?? 0) === 0) && (
                                                    <button 
                                                      className="p-1 bg-white border-[0.1em] border-[#264143] rounded-[0.2em] hover:bg-[#DE5499]/10 transition-colors"
                                                    >
                                                      <Trash2 className="w-3 h-3 text-[#DE5499]" />
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            </motion.div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicStructure;