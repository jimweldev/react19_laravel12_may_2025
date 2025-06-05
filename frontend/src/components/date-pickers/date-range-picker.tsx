import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateRangePickerProps = {
  date?: DateRange;
  setDate: (date: DateRange | undefined) => void;
  size: 'sm' | 'default' | 'lg';
  className?: string;
};

const DateRangePicker = ({
  date,
  setDate,
  size = 'default',
  className,
}: DateRangePickerProps) => {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={size}
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-between text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {moment(date.from).format('MMM DD, YYYY')} -{' '}
                  {moment(date.to).format('MMM DD, YYYY')}
                </>
              ) : (
                moment(date.from).format('MMM DD, YYYY')
              )
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="flex justify-end p-3 pt-0">
            <Button onClick={() => setDate(undefined)} size="sm">
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
