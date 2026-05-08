import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange, minDate }) => {
  const [currentViewDate, setCurrentViewDate] = useState(new Date(value || new Date()));
  
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(year, month, day);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return date < min;
  };

  const handleDateSelect = (day: number) => {
    if (isDisabled(day)) return;
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;
    onChange(formatted);
  };

  const setQuickDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;
    onChange(formatted);
    setCurrentViewDate(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[var(--sienna)]" />
          {monthNames[month]} {year}
        </h4>
        <div className="flex gap-1">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map(i => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const selected = isSelected(day);
            const today = isToday(day);
            const disabled = isDisabled(day);

            return (
              <button
                key={day}
                disabled={disabled}
                onClick={() => handleDateSelect(day)}
                className={`
                  h-10 w-full flex items-center justify-center rounded-lg text-sm font-semibold transition-all
                  ${selected 
                    ? 'bg-[var(--sienna)] text-white shadow-md transform scale-105' 
                    : disabled 
                      ? 'text-gray-200 cursor-not-allowed' 
                      : 'hover:bg-gray-100 text-gray-700 hover:text-[var(--sienna)]'
                  }
                  ${today && !selected ? 'border border-[var(--sienna)] text-[var(--sienna)]' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-2">
        <button 
          onClick={() => setQuickDate(0)}
          className="py-1.5 px-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-[var(--sienna)] hover:text-[var(--sienna)] transition-colors"
        >
          Today
        </button>
        <button 
          onClick={() => setQuickDate(1)}
          className="py-1.5 px-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-[var(--sienna)] hover:text-[var(--sienna)] transition-colors"
        >
          Tomorrow
        </button>
        <button 
          onClick={() => setQuickDate(3)}
          className="py-1.5 px-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-[var(--sienna)] hover:text-[var(--sienna)] transition-colors"
        >
          In 3 Days
        </button>
      </div>
    </div>
  );
};
