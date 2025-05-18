import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react'; // Add this import
import moment from 'moment';
import { Input } from '../ui/input';

type DatePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  type?: 'date' | 'datetime-local';
};

const DatePicker = ({
  value,
  onChange,
  type = 'date',
  ...props
}: DatePickerProps) => {
  const dateInputRef = useRef(null);
  const [displayValue, setDisplayValue] = useState('');

  const handleButtonClick = () => {
    (dateInputRef.current as unknown as HTMLInputElement)?.showPicker?.();
    (dateInputRef.current as unknown as HTMLInputElement)?.click();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setDisplayValue(
      date
        ? type === 'date'
          ? moment(date).format('MMM D, YYYY')
          : moment(date).format('MMM D, YYYY hh:mm A')
        : '',
    );
    onChange?.(date || '');
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(
        type === 'date'
          ? moment(value).format('MMM D, YYYY')
          : moment(value).format('MMM D, YYYY hh:mm A'),
      );
    } else {
      setDisplayValue('');
    }
  }, [value, type]);

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={handleButtonClick}>
        <Input
          placeholder={`Select ${type === 'date' ? 'date' : 'date and time'}`}
          value={displayValue}
          readOnly
          className="cursor-pointer"
          {...props}
        />
        <Calendar className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
      <Input
        className="absolute inset-0 -z-10"
        ref={dateInputRef}
        type={type}
        onChange={handleDateChange}
        value={value || ''}
      />
    </div>
  );
};

export default DatePicker;
