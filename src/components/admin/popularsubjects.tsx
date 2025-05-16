'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PopularSubjects() {
  const subjects = ["Computer Science", "Biology", "Economics", "Physics", "Mathematics"];

  return (
    <Card className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#4CAF50] overflow-hidden transition-all duration-200 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#4CAF50]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-[#264143]">Popular Subjects</CardTitle>
        <CardDescription className="text-sm text-[#264143]/70">Most active subject areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject, i) => (
            <div key={subject} className="flex items-center justify-between transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDDCD9] text-xs font-bold text-[#264143]">
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-[#264143]">{subject}</span>
              </div>
              <span className="text-xs font-medium text-[#264143]/70">
                {Math.floor(Math.random() * 100) + 20} notes
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}