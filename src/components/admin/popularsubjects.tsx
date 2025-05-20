'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface PopularSubject {
  id: string;
  name: string;
  code: string;
  semester: {
    number: number;
    year: {
      number: number;
    }
  };
  notesCount: number;
  likesCount: number;
}

export default function PopularSubjects() {
  const [subjects, setSubjects] = useState<PopularSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularSubjects() {
      try {
        const response = await fetch('/api/admin/popular-subjects');
        if (!response.ok) {
          throw new Error('Failed to fetch popular subjects');
        }
        const data = await response.json();
        setSubjects(data.subjects || []);
      } catch (err) {
        console.error('Error fetching popular subjects:', err);
        setError('Failed to load popular subjects');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularSubjects();
  }, []);

  return (
    <Card className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#4CAF50] overflow-hidden transition-all duration-200 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#4CAF50] h-full">
      <CardHeader className="pb-2 sm:pb-3 md:pb-4">
        <CardTitle className="text-lg sm:text-xl font-bold text-[#264143]">Popular Subjects</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-[#264143]/70">Most liked subject areas</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-3 border-[#4CAF50] rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-6 text-[#264143]/70">No subjects with likes yet</div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {subjects.map((subject, i) => (
              <div key={subject.id} className="flex items-center justify-between transition-all duration-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#EDDCD9] text-xs font-bold text-[#264143]">
                    {i + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-medium text-[#264143] line-clamp-1">
                      {subject.name}
                    </span>
                    <span className="text-xs text-[#264143]/70">
                      {subject.code} • Y{subject.semester.year.number}S{subject.semester.number}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-2">
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-[#264143]">
                    <Heart size={12} className="text-red-500 fill-red-500" />
                    <span>{subject.likesCount}</span>
                  </div>
                  <span className="text-xs text-[#264143]/70">
                    {subject.notesCount} {subject.notesCount === 1 ? 'note' : 'notes'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}