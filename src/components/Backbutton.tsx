"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  subjectName: string;
}

export default function BackButton({ subjectName }: BackButtonProps) {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()}
      className="inline-flex items-center text-[#264143] hover:text-[#DE5499] transition-colors font-medium"
    >
      <ChevronLeft className="w-4 h-4 mr-2" />
      <span>Back to {subjectName}</span>
    </button>
  );
}