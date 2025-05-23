'use client';

import Link from "next/link";
import { Calendar, BookOpen, Book, FileText, MessageCircle } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid gap-4">
      <h3 className="text-xl font-semibold text-[#264143]">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
        
      <Link 
          href="/admin/oauth" 
          className="p-4 bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#0070f3] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#0070f3] transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-[#EDDCD9] rounded-md mr-3 text-[#264143]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 5-5 14" />
                <path d="M7.5 9h13" />
                <path d="M3.5 15h13" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#264143]">Google Drive Setup</h4>
              <p className="text-sm text-[#264143]/70">Manage OAuth tokens</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/admin/notes" 
          className="p-4 bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#DE5499] transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-[#EDDCD9] rounded-md mr-3 text-[#264143]">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#264143]">Manage Notes</h4>
              <p className="text-sm text-[#264143]/70">Review and organize all notes</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/admin/feedback" 
          className="p-4 bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#8B5CF6] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#8B5CF6] transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-[#EDDCD9] rounded-md mr-3 text-[#264143]">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#264143]">User Feedback</h4>
              <p className="text-sm text-[#264143]/70">Review and manage feedback</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}