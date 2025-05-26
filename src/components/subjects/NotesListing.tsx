'use client';

import React from 'react';
import NoteCard from './NoteCard';
import EmptyNotesState from './EmptyNotesState';
import { Note } from './types';
import { motion } from 'framer-motion';

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

  // Animation variants for tabs
  const tabVariants = {
    active: {
      backgroundColor: "#DE5499",
      color: "white",
      boxShadow: "0.1em 0.1em 0 #264143",
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    inactive: {
      backgroundColor: "transparent",
      color: "#264143",
      boxShadow: "none",
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  // Animation variants for notes container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden relative">
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
      
      {/* Pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
      
      <div className="p-6 border-b-[0.25em] border-[#264143] bg-white relative z-10">
        <h2 className="text-2xl font-bold text-[#264143]">Study Materials</h2>
        <p className="text-[#264143]/80">Notes, lectures, and resources for {subjectName}</p>
      </div>
      
      <div className="p-6 relative z-10">
        {/* Filter tabs */}
        <div className="border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] bg-white p-1 mb-6 flex flex-wrap overflow-x-auto">
          {['all', 'pdf', 'lecture', 'handwritten', 'ppt'].map((tab) => (
            <motion.button
              key={tab}
              className="py-2 px-4 transition-all rounded-[0.3em] flex-shrink-0 font-medium"
              variants={tabVariants}
              animate={activeTab === tab ? "active" : "inactive"}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: activeTab !== tab ? 1.05 : 1.02 }}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
          
        {/* Notes grid layout */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 py-4 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <motion.div 
                key={note.id}
                variants={itemVariants}
              >
                <NoteCard note={note} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-full flex justify-center items-center py-10"
              variants={itemVariants}
            >
              <EmptyNotesState type={activeTab} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotesListing;