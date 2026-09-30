import React, { type FC, useEffect, useMemo, useRef, useState } from 'react';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { cva } from 'class-variance-authority';

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isToday,
  isWithinInterval,
  parse,
  startOfToday,
  startOfWeek
} from 'date-fns';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import Button from '../../button/Button';
import Input from '../input/Input';

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7'
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const numberRegex = /^-?\d*\.?\d+$/;

const pickerStyles = cva('mx-auto flex w-full py-2 items-center justify-center text-xs ', {
  variants: {
    isToday: { true: '', false: '' },
    isSelected: { true: '', false: '' },
    isSameMonth: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [
    {
      isSelected: true,
      className: 'font-medium'
    },
    {
      isToday: true,
      className: 'font-medium bg-primary-500 text-white'
    },
    {
      isSelected: true,
      isToday: true,
      className: 'bg-secondary-500 text-white'
    },
    {
      isSelected: false,
      isToday: false,
      isSameMonth: true,
      className:
        'text-center hover:bg-muted-100 hover:text-primary-500 dark:hover:bg-muted-800 disabled:dark:hover:bg-transparent disabled:text-muted-300 dark:disabled:text-muted-700 disabled:cursor-not-allowed'
    },
    {
      isSelected: false,
      isToday: false,
      isSameMonth: false,
      className:
        'text-muted-300 dark:hover:bg-muted-800 disabled:dark:hover:bg-transparent disabled:cursor-not-allowed'
    },
    {
      isSelected: true,
      isToday: false,
      className: 'bg-secondary-500 text-white'
    }
  ]
});

export interface DatePickerProps extends Omit<React.HTMLProps<HTMLInputElement>, 'size' | 'value'> {
  value?: Date | [Date, Date];
  valueFormat?: string;
  icon?: string;
  label?: string;
  shape?: 'straight' | 'rounded' | 'smooth' | 'curved' | 'full';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'contrast' | 'muted' | 'mutedContrast';
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
  loading?: boolean;
  dateRange?: boolean;
}

const DatePicker: FC<DatePickerProps> = ({
  value,
  valueFormat = 'yyyy-MM-dd', //MMM dd
  icon,
  shape = 'smooth',
  size = 'md',
  color = 'default',
  label,
  placeholder,
  minDate,
  disabled,
  loading = false,
  dateRange = false,
  ...props
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [overlayInput, setOverlayInput] = useState('');

  const pickerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(pickerRef, () => setPickerOpen(false));

  const today = startOfToday();
  const [selectedDays, setSelectedDays] = useState<[Date | null, Date | null]>([null, null]);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const [selectingStartDate, setSelectingStartDate] = useState(true);

  const { onChange } = props;
  useEffect(() => {
    if (onChange && selectedDays[0] && selectedDays[1]) {
      onChange({
        target: {
          value: selectedDays
        }
      } as any);
    }
  }, [onChange, selectedDays]);

  const displayValue = useMemo(() => {
    if (!clicked) return '';
    if (dateRange) {
      const [start, end] = selectedDays;
      if (start && end) {
        return `${format(start, valueFormat)} - ${format(end, valueFormat)}`;
      } else if (start) {
        return `${format(start, valueFormat)} - End Date`;
      }
      return 'Start Date';
    }
    return selectedDays[0] ? format(selectedDays[0], valueFormat) : '';
  }, [selectedDays, valueFormat, clicked, dateRange]);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth))
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function handleFocused() {
    setPickerOpen(true);
    setClicked(true);
  }

  function handleOverlayYear(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if ((value != '' && !numberRegex.test(value)) || value.length > 4) {
      return;
    }
    setOverlayInput(value);
  }

  function handleConfirm() {
    const newDate = new Date().setFullYear(+overlayInput);
    setCurrentMonth(format(newDate, 'MMM-yyyy'));
    setShowOverlay(false);
  }

  function handleGotoMonth(month: number) {
    const year =
      numberRegex.test(overlayInput) && overlayInput.length == 4
        ? +overlayInput
        : today.getFullYear();
    const newDate = new Date().setFullYear(year, month);
    setCurrentMonth(format(newDate, 'MMM-yyyy'));
    setShowOverlay(false);
  }

  function isdisabled(date: Date) {
    if (minDate) {
      return isBefore(date, minDate);
    }
    return false;
  }

  function isSelected(day: Date) {
    return (
      (selectedDays[0] && isEqual(day, selectedDays[0])) ||
      (selectedDays[1] && isEqual(day, selectedDays[1]))
    );
  }

  function isInRange(day: Date) {
    return (
      selectedDays[0] &&
      selectedDays[1] &&
      isWithinInterval(day, { start: selectedDays[0], end: selectedDays[1] })
    );
  }

  function handleDateSelection(day: Date) {
    if (dateRange) {
      if (selectingStartDate || !selectedDays[0] || (selectedDays[0] && selectedDays[1])) {
        setSelectedDays([day, null]);
        setSelectingStartDate(false);
      } else {
        const [start, end] =
          selectedDays[0]! <= day ? [selectedDays[0], day] : [day, selectedDays[0]];
        setSelectedDays([start, end]);
        setSelectingStartDate(true);
        // setPickerOpen(false);
      }
    } else {
      setSelectedDays([day, null]);
      // setPickerOpen(false);
    }
  }

  return (
    <div ref={pickerRef} className="relative w-full font-sans">
      <Input
        type="text"
        label={label}
        shape={shape}
        size={size}
        color={color}
        icon={icon}
        placeholder={placeholder}
        onFocus={handleFocused}
        value={displayValue}
        disabled={disabled}
        loading={loading}
        {...props}
      />
      <div
        className={`absolute start-0 top-full isolate z-40 mt-2 w-full border border-muted-200 bg-white p-5 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/20 ${
          pickerOpen ? 'block' : 'hidden'
        } ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'smooth' ? 'rounded-lg' : ''} ${
          shape === 'curved' ? 'rounded-xl' : ''
        } ${shape === 'full' ? 'rounded-xl' : ''}`}
      >
        {/* {dateRange && (
          <div className="mb-4 text-center text-sm font-medium text-muted-600 dark:text-muted-300">
            {selectingStartDate ? 'Pick start date' : 'Pick end date'}
          </div>
        )} */}
        <div className="w-full text-xs text-muted-800 dark:text-muted-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="flex flex-none items-center justify-center p-1.5 text-muted-500 hover:text-muted-400"
            >
              <span className="sr-only">Previous month</span>
              <ReIcon iconName="BiSolidChevronLeft" className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setShowOverlay(true)}
              className="text-sm font-medium text-muted-800 hover:underline dark:text-muted-100"
            >
              {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </button>
            <button
              onClick={nextMonth}
              type="button"
              className="flex flex-none items-center justify-center p-1.5 text-muted-500 hover:text-muted-400"
            >
              <span className="sr-only">Next month</span>
              <ReIcon iconName="BiSolidChevronRight" className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7">
            {dayLabels.map((dayLabel, index) => (
              <div
                key={index}
                className="py-2 text-center text-[0.65rem] font-normal uppercase text-muted-400"
              >
                {dayLabel}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={`${dayIdx === 0 ? colStartClasses[getDay(day)] : ''}`}
              >
                <button
                  type="button"
                  onClick={() => handleDateSelection(day)}
                  disabled={isdisabled(day)}
                  className={`${pickerStyles({
                    isSelected: isSelected(day),
                    isToday: isToday(day),
                    isSameMonth: isSameMonth(day, firstDayCurrentMonth)
                  })} ${shape === 'rounded' ? 'rounded-md' : ''} ${
                    shape === 'smooth' ? 'rounded-lg' : ''
                  } ${shape === 'curved' ? 'rounded-xl' : ''} ${
                    shape === 'full' ? 'rounded-full' : ''
                  } ${
                    dateRange && isInRange(day) && !isSelected(day)
                      ? 'bg-secondary-100 !text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-900 dark:text-secondary-200 dark:hover:bg-secondary-800'
                      : ''
                  } w-full`}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-lg bg-white p-5 text-white transition-all duration-300 dark:bg-muted-950 ${showOverlay ? 'z-[2] opacity-100' : '-z-[1] opacity-0'} `}
        >
          <div>
            <input
              type="text"
              pattern="(^\d{4}$)|(^\d{4}-\d{2}-\d{2}$)"
              placeholder="4-digit year"
              value={overlayInput}
              onChange={handleOverlayYear}
              className="mx-auto block w-4/5 border-b border-muted-200 bg-transparent py-1 text-center text-base text-muted-800 focus:outline-none dark:border-muted-800 dark:text-muted-100"
            />

            <button
              type="button"
              onClick={() => setShowOverlay(false)}
              className="absolute end-2 top-0 p-2 text-2xl opacity-70"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-3">
            {months.map((month, index) => (
              <button
                key={index}
                type="button"
                data-month={index + 1}
                onClick={() => handleGotoMonth(index)}
                className={`py-2 text-sm text-muted-800/70 hover:bg-muted-100 hover:text-muted-800 dark:text-muted-400 dark:hover:bg-muted-800 dark:hover:text-white ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'smooth' ? 'rounded-lg' : ''} ${shape === 'curved' ? 'rounded-xl' : ''} ${shape === 'full' ? 'rounded-full' : ''} `}
              >
                {month}
              </button>
            ))}
          </div>

          <Button
            type="button"
            color="primary"
            shape={shape}
            onClick={handleConfirm}
            disabled={overlayInput.length != 4}
            className="mx-auto !h-auto !px-3 !py-[.35rem]"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
