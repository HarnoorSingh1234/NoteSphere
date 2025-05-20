// Admin dashboard updates to include notes management links
import React from 'react';
import Link from 'next/link';
import { FileText, ThumbsUp, MessageCircle, Clock, User, Plus, CheckCircle, XCircle } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden">
      <div className="p-6 border-b-[0.15em] border-[#050505]">
        <h2 className="text-2xl font-bold text-[#050505]">Quick Actions</h2>
        <p className="text-[#050505]/70">Common tasks and actions for administrators</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-[#050505]/10 border-[#050505]/10">
        {/* Add new action links for notes management */}
        <Link
          href="/admin/notes"
          className="flex items-center p-6 hover:bg-[#050505]/5 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#4d61ff]/10 rounded-full border-[0.1em] border-[#4d61ff] mr-4">
            <FileText className="w-6 h-6 text-[#4d61ff]" />
          </div>
          <div>
            <h3 className="font-bold text-[#050505] mb-1">Manage All Notes</h3>
            <p className="text-sm text-[#050505]/70">View and manage all notes in the system</p>
          </div>
        </Link>
        
        <Link
          href="/admin/notes/pending"
          className="flex items-center p-6 hover:bg-[#050505]/5 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#ff3e00]/10 rounded-full border-[0.1em] border-[#ff3e00] mr-4">
            <Clock className="w-6 h-6 text-[#ff3e00]" />
          </div>
          <div>
            <h3 className="font-bold text-[#050505] mb-1">Pending Notes</h3>
            <p className="text-sm text-[#050505]/70">Verify or reject notes waiting for approval</p>
          </div>
        </Link>
        
        <Link
          href="/admin/notes/rejected"
          className="flex items-center p-6 hover:bg-[#050505]/5 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#dc2626]/10 rounded-full border-[0.1em] border-[#dc2626] mr-4">
            <XCircle className="w-6 h-6 text-[#dc2626]" />
          </div>
          <div>
            <h3 className="font-bold text-[#050505] mb-1">Rejected Notes</h3>
            <p className="text-sm text-[#050505]/70">View and manage rejected notes</p>
          </div>
        </Link>
        
        <Link
          href="/admin/years"
          className="flex items-center p-6 hover:bg-[#050505]/5 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#DE5499]/10 rounded-full border-[0.1em] border-[#DE5499] mr-4">
            <Plus className="w-6 h-6 text-[#DE5499]" />
          </div>
          <div>
            <h3 className="font-bold text-[#050505] mb-1">Add Academic Year</h3>
            <p className="text-sm text-[#050505]/70">Create a new academic year</p>
          </div>
        </Link>
        
        <Link
          href="/admin/subjects"
          className="flex items-center p-6 hover:bg-[#050505]/5 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#E99F4C]/10 rounded-full border-[0.1em] border-[#E99F4C] mr-4">
            <Plus className="w-6 h-6 text-[#E99F4C]" />
          </div>
          <div>
            <h3 className="font-bold text-[#050505] mb-1">Add Subject</h3>
            <p className="text-sm text-[#050505]/70">Create a new subject for a semester</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

// Component for pending notes summary
const PendingNotesCard = ({ pendingCount }: { pendingCount: number }) => {
  return (
    <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.3em_0.3em_0_#ff3e00] overflow-hidden">
      <div className="p-6 border-b-[0.15em] border-[#050505]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#050505]">Pending Notes</h2>
          <div className="bg-[#ff3e00] text-white font-bold text-xl px-4 py-1 rounded-full">
            {pendingCount}
          </div>
        </div>
        <p className="text-[#050505]/70">Notes waiting for verification</p>
      </div>
      
      <div className="p-6">
        {pendingCount > 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-[#050505]">
              There {pendingCount === 1 ? 'is' : 'are'} <strong>{pendingCount}</strong> note{pendingCount !== 1 ? 's' : ''} waiting for your review and approval.
            </p>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin/notes/pending"
                className="px-5 py-2.5 bg-[#ff3e00] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#e63600] transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Verify Notes</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#050505] mb-1">All Clear</h3>
              <p className="text-sm text-[#050505]/70">No notes are pending verification</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for rejected notes summary
const RejectedNotesCard = ({ rejectedCount }: { rejectedCount: number }) => {
  return (
    <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.3em_0.3em_0_#dc2626] overflow-hidden">
      <div className="p-6 border-b-[0.15em] border-[#050505]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#050505]">Rejected Notes</h2>
          <div className="bg-[#dc2626] text-white font-bold text-xl px-4 py-1 rounded-full">
            {rejectedCount}
          </div>
        </div>
        <p className="text-[#050505]/70">Notes that have been rejected</p>
      </div>
      
      <div className="p-6">
        {rejectedCount > 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-[#050505]">
              There {rejectedCount === 1 ? 'is' : 'are'} <strong>{rejectedCount}</strong> note{rejectedCount !== 1 ? 's' : ''} that have been rejected.
            </p>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin/notes/rejected"
                className="px-5 py-2.5 bg-[#9e9e9e] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#858585] transition-colors"
              >
                <XCircle className="w-5 h-5" />
                <span>View Rejected</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h3 className="font-bold text-[#050505] mb-1">No Rejected Notes</h3>
              <p className="text-sm text-[#050505]/70">No notes have been rejected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { QuickActions, PendingNotesCard, RejectedNotesCard };
