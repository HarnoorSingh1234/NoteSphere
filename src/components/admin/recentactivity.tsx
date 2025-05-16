'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function RecentActivity() {
  return (
    <Card className="md:col-span-2 bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#DE5499] overflow-hidden transition-all duration-200 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#DE5499]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-[#264143]">Recent Activity</CardTitle>
        <CardDescription className="text-sm text-[#264143]/70">
          Your latest interactions on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 rounded-lg border-[0.15em] border-[#264143]/20 p-3 transition-all duration-200 hover:translate-y-[-0.1em]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDDCD9]">
                <FileText className="h-5 w-5 text-[#264143]" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-[#264143]">
                  {i % 2 === 0 ? "You uploaded" : "You downloaded"} a new note
                </p>
                <p className="text-xs text-[#264143]/70">
                  {i % 2 === 0 ? "Organic Chemistry - Lecture Notes" : "Calculus II - Exam Prep"}
                </p>
              </div>
              <div className="text-xs font-medium text-[#264143]/70">
                {i === 1 ? "Just now" : i === 2 ? "2 hours ago" : `${i} days ago`}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}