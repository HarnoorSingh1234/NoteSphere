'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Book, Notebook, FileText, Edit, Trash2 } from 'lucide-react';
import { Year, Semester, Subject } from '@/types'; // Import from root types file for consistency

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
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#050505] mb-4">Academic Structure</h2>
      
      {years.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#050505]/70 mb-4">No academic years found.</p>
          <Link
            href="/admin/years/create"
            className="px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
          >
            Create Your First Year
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {years.map((year) => (
            <div key={year.id} className="border border-gray-200 rounded-lg">
              {/* Year Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleYear(year.id)}
              >
                <div className="flex items-center space-x-2">
                  {expandedYears[year.id] ? (
                    <ChevronDown className="w-5 h-5 text-[#4d61ff]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#4d61ff]" />
                  )}                  <Book className="w-5 h-5 text-[#4d61ff]" />
                  <span className="font-medium text-[#050505]">Year {year.number}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {year.semesters?.length || 0} semester(s)
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/years/${year.id}/edit`} className="p-1 hover:bg-gray-200 rounded">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Link>
                  {(year.semesters?.length || 0) === 0 && (
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Year Content */}
              {expandedYears[year.id] && (
                <div className="pl-8 pr-4 pb-4">
                  {year.semesters?.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-[#050505]/70 mb-2">No semesters in this year.</p>
                      <Link
                        href={`/admin/semesters/create?yearId=${year.id}`}
                        className="text-sm px-3 py-1.5 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
                      >
                        Add Semester
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {year.semesters?.map((semester) => (
                        <div key={semester.id} className="border border-gray-200 rounded-lg">
                          {/* Semester Header */}
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleSemester(semester.id)}
                          >
                            <div className="flex items-center space-x-2">
                              {expandedSemesters[semester.id] ? (
                                <ChevronDown className="w-4 h-4 text-[#ff7849]" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-[#ff7849]" />
                              )}                              <Notebook className="w-4 h-4 text-[#ff7849]" />
                              <span className="font-medium text-[#050505]">Semester {semester.number}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                {semester.subjects?.length || 0} subject(s)
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Link href={`/admin/semesters/${semester.id}/edit`} className="p-1 hover:bg-gray-200 rounded">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </Link>
                              {(semester.subjects?.length || 0) === 0 && (
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Semester Content */}
                          {expandedSemesters[semester.id] && (
                            <div className="pl-8 pr-4 pb-3">
                              {semester.subjects?.length === 0 ? (
                                <div className="text-center py-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-[#050505]/70 mb-2">No subjects in this semester.</p>
                                  <Link
                                    href={`/admin/subjects/create?semesterId=${semester.id}`}
                                    className="text-sm px-3 py-1.5 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
                                  >
                                    Add Subject
                                  </Link>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {semester.subjects?.map((subject) => (
                                    <div key={subject.id} className="border border-gray-200 rounded-lg">
                                      {/* Subject Header */}
                                      <div className="flex items-center justify-between p-2">
                                        <div className="flex items-center space-x-2">
                                          <FileText className="w-4 h-4 text-[#10b981]" />
                                          <span className="font-medium text-[#050505]">{subject.name}</span>
                                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                            {subject.code}
                                          </span>                                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                            {subject._count?.notes ?? subject.notes?.length ?? 0} note(s)
                                          </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">                                          <Link href={`/admin/notes/subject/${subject.id}`} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                                            View Notes
                                          </Link>
                                          <Link href={`/admin/subjects/${subject.id}/edit`} className="p-1 hover:bg-gray-200 rounded">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                          </Link>                                          {((subject._count?.notes ?? subject.notes?.length ?? 0) === 0) && (
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                              <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicStructure;