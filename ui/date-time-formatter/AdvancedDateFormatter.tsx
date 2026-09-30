import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AdvancedDateFormatterProps } from './type';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

const AdvancedDateFormatter: React.FC<AdvancedDateFormatterProps> = ({
  date,
  DateOnly = false,
  TimeOnly = false,
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'HH:mm:ss',
  timezone = 'UTC',
  use24HourFormat = false,
  useRelativeTime = false,
  className
}) => {
  const formatDate = (input: string | number) => {
    let dateObj = dayjs(input);

    if (timezone) {
      dateObj = dateObj.tz(timezone);
    }

    if (useRelativeTime) {
      return dateObj.fromNow();
    }

    if (DateOnly) {
      return dateObj.format(dateFormat);
    }

    if (TimeOnly) {
      return dateObj.format(use24HourFormat ? timeFormat : timeFormat.replace('HH', 'hh') + ' A');
    }

    const dateString = dateObj.format(dateFormat);
    const timeString = dateObj.format(
      use24HourFormat ? timeFormat : timeFormat.replace('HH', 'hh') + ' A'
    );
    return `${dateString} ${timeString}`;
  };

  return <span className={className}>{formatDate(date)}</span>;
};

export default AdvancedDateFormatter;
