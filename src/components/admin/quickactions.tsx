'use client';

import Link from "next/link";
import { Calendar, BookOpen, Book } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid gap-4">
      <h3 className="text-xl font-semibold text-[#264143]">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Link 
          href="/admin/years" 
          className="p-4 bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-[#EDDCD9] rounded-md mr-3 text-[#264143]">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#264143]">Manage Years</h4>
              <p className="text-sm text-[#264143]/70">Add or edit academic years</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/admin/semesters" 
          className="p-4 bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#DE5499] transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-[#EDDCD9] rounded-md mr-3 text-[#264143]">
              <BookOpen size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#264143]">Manage Semesters</h4>
              <p className="text-sm text-[#264143]/70">Add or edit semesters</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/admin/subjects" 
          className="p-4 bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#4CAF50] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#4CAF50] transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-[#EDDCD9] rounded-md mr-3 text-[#264143]">
              <Book size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#264143]">Manage Subjects</h4>
              <p className="text-sm text-[#264143]/70">Add or edit subjects</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}