import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NoticeSkeletonProps {
  count?: number;
}

export default function NoticeSkeleton({ count = 1 }: NoticeSkeletonProps) {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <Card key={index} className="mb-4 overflow-hidden border border-gray-200">
          <CardHeader className="pb-3 bg-[#EDDCD9]/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-6 w-28" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}