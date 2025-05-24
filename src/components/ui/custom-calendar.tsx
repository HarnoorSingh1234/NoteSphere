'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  mode?: 'single' | 'range' | 'multiple';
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
  initialFocus?: boolean;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
  disabled,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    selected instanceof Date ? selected : undefined
  );

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    if (disabled) return;
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    onSelect?.(date);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className={cn('p-3 w-full', className)}>
      <div className="flex items-center justify-between space-x-2 pt-1 pb-4">
        <h2 className="font-semibold">
          {monthName} {year}
        </h2>
        <div className="space-x-1">
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={handlePreviousMonth}
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={handleNextMonth}
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <Button
              key={day}
              variant="ghost"
              className={cn(
                'h-9 w-full p-0 font-normal',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                isToday && !isSelected && 'bg-muted text-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
              onClick={() => handleDateSelect(day)}
            >
              {day}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
