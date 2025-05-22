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
    <div className="bg-[#F8F5F2] border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden">
      <div className="p-6 border-b-[0.15em] border-[#264143] bg-white">
        <h2 className="text-2xl font-bold text-[#264143]">Study Materials</h2>
        <p className="text-[#264143]/80">Notes, lectures, and resources for {subjectName}</p>
      </div>
      
      <div className="p-6">
        {/* Filter tabs */}
        <div className="border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.1em_0.1em_0_#264143] bg-white p-1 mb-6 flex flex-wrap overflow-x-auto">
          {['all', 'pdf', 'lecture', 'handwritten', 'ppt'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 transition-all rounded-[0.3em] flex-shrink-0 ${
                activeTab === tab 
                  ? 'bg-[#DE5499] text-white font-medium shadow-[0.1em_0.1em_0_#264143]' 
                  : 'text-[#264143] hover:bg-[#EDDCD9]/50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}        </div>
          {/* Notes grid layout */}
      <div className="flex flex-wrap justify-start gap-4 py-4 px-4">
        {filteredNotes && filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note.id} className="flex-grow-0 flex-shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.33%-0.67rem)] lg:basis-[calc(25%-0.75rem)]">
              <NoteCard note={note} />
            </div>
          ))
        ) : (
          <div className="w-full flex justify-center items-center py-10">
            <EmptyNotesState type={activeTab} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default NotesListing;