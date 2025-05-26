import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NoticeDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        className="mb-6 text-[#264143]/70"
        disabled
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to notices
      </Button>

      <Card className="mb-6">
        <CardHeader className="pb-3 bg-[#EDDCD9]/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-6" />

          {/* Document viewer skeleton */}
          <div className="mb-6 border rounded-lg bg-gray-50">
            <Skeleton className="h-64 w-full" />
          </div>

          <div className="flex items-center gap-4 border-t pt-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Comments section skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>

        <CardContent>
          <Skeleton className="h-24 w-full mb-6" />
          
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-[#EDDCD9]/10 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}