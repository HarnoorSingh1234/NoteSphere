'use client';

import React from 'react';
import NoteCard from './NoteCard';
import EmptyNotesState from './EmptyNotesState';
import { Note } from './types';

interface NotesListingProps {
  notes: Note[];
  subjectName: string;
}

const NotesListing: React.FC<NotesListingProps> = ({ notes = [], subjectName = 'this subject' }) => {
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Make sure notes is an array to avoid errors
  const safeNotes = Array.isArray(notes) ? notes : [];
  
  const filteredNotes = React.useMemo(() => {
    if (activeTab === 'all') return safeNotes;
    return safeNotes.filter(note => note?.type?.toLowerCase() === activeTab.toLowerCase());
  }, [safeNotes, activeTab]);

  return (
    <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden">
      <div className="p-6 border-b-[0.15em] border-[#050505]">
        <h2 className="text-2xl font-bold text-[#050505]">Study Materials</h2>
        <p className="text-[#050505]/70">Notes, lectures, and resources for {subjectName}</p>
      </div>
      
      <div className="p-6">
        <div className="border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.1em_0.1em_0_#050505] bg-[#EDDCD9]/30 p-1 mb-6 grid grid-cols-4 overflow-hidden">
          {['all', 'pdf', 'lecture', 'handwritten', 'ppt'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 transition-all rounded-[0.3em] ${
                activeTab === tab 
                  ? 'bg-white text-[#050505] font-bold shadow-[0.1em_0.1em_0_#050505]' 
                  : 'text-[#050505]/70 hover:bg-white/50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <EmptyNotesState type={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesListing;