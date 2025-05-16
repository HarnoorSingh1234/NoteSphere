'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export default function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] overflow-hidden transition-all duration-200 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-[#264143]">{title}</CardTitle>
        <Icon className="h-5 w-5 text-[#264143]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#264143]">{value}</div>
        <p className="text-xs text-[#264143]/70">{description}</p>
      </CardContent>
    </Card>
  );
}