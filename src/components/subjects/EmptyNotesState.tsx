'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyNotesStateProps {
  type: string;
}

const EmptyNotesState: React.FC<EmptyNotesStateProps> = ({ type }) => {
  const messages = {
    all: {
      title: "No notes available yet",
      description: "Be the first to upload study materials for this subject!"
    },
    pdf: {
      title: "No PDF notes available",
      description: "Upload PDF notes to help your peers!"
    },
    lecture: {
      title: "No lecture notes available",
      description: "Share your lecture notes with the community!"
    },
    handwritten: {
      title: "No handwritten notes available",
      description: "Upload your handwritten notes to help others!"
    },
    ppt: {
      title: "No presentations available",
      description: "Share your presentations with classmates!"
    }
  };

  const message = messages[type as keyof typeof messages] || messages.all;

  return (
    <div className="p-8 bg-white border-[0.15em] border-dashed border-[#050505] rounded-[0.6em] text-center">
      <FileText className="w-12 h-12 mx-auto text-[#050505]/40 mb-2" />
      <h3 className="text-lg font-bold text-[#050505] mb-1">{message.title}</h3>
      <p className="text-[#050505]/70">{message.description}</p>
    </div>
  );
};

export default EmptyNotesState;
