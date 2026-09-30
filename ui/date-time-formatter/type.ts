export type DateFormat =
  | 'YYYY-MM-DD'
  | 'YY-MM-DD'
  | 'YYYY/MM/DD'
  | 'YY/MM/DD'
  | 'DD/MM/YYYY'
  | 'DD/MM/YY'
  | 'MM/DD/YYYY'
  | 'MM/DD/YY'
  | 'DD-MM-YYYY'
  | 'DD-MM-YY'
  | 'MM-DD-YYYY'
  | 'MM-DD-YY'
  | 'MMMM D, YYYY'
  | 'MMMM D, YY'
  | 'MMM D, YYYY'
  | 'MMM D, YY'
  | 'D MMMM YYYY'
  | 'D MMMM YY'
  | 'D MMM YYYY'
  | 'D MMM YY'
  | 'MMMM YYYY'
  | 'MMM YYYY'
  | 'YYYY'
  | 'YY';

export type TimeFormat =
  | 'HH:mm:ss'
  | 'hh:mm:ss A'
  | 'HH:mm'
  | 'hh:mm A'
  | 'HH:mm:ss.SSS'
  | 'hh:mm:ss.SSS A'
  | 'H:mm:ss'
  | 'h:mm:ss A'
  | 'H:mm'
  | 'h:mm A'
  | 'HH:mm:ssZ'
  | 'hh:mm:ss A Z'
  | 'HH:mm:ss ZZ'
  | 'hh:mm:ss A ZZ';

export type Timezone =
  // Africa
  | 'Africa/Abidjan'
  | 'Africa/Accra'
  | 'Africa/Addis_Ababa'
  | 'Africa/Algiers'
  | 'Africa/Cairo'
  | 'Africa/Casablanca'
  | 'Africa/Dakar'
  | 'Africa/Johannesburg'
  | 'Africa/Lagos'
  | 'Africa/Nairobi'
  | 'Africa/Tunis'

  // America
  | 'America/Anchorage'
  | 'America/Bogota'
  | 'America/Buenos_Aires'
  | 'America/Caracas'
  | 'America/Chicago'
  | 'America/Denver'
  | 'America/Halifax'
  | 'America/Havana'
  | 'America/Lima'
  | 'America/Los_Angeles'
  | 'America/Mexico_City'
  | 'America/New_York'
  | 'America/Phoenix'
  | 'America/Santiago'
  | 'America/Sao_Paulo'
  | 'America/St_Johns'
  | 'America/Toronto'
  | 'America/Vancouver'

  // Antarctica
  | 'Antarctica/Casey'
  | 'Antarctica/Davis'
  | 'Antarctica/DumontDUrville'
  | 'Antarctica/Mawson'
  | 'Antarctica/McMurdo'
  | 'Antarctica/Palmer'
  | 'Antarctica/Rothera'
  | 'Antarctica/Syowa'
  | 'Antarctica/Troll'
  | 'Antarctica/Vostok'

  // Asia
  | 'Asia/Baghdad'
  | 'Asia/Bangkok'
  | 'Asia/Beirut'
  | 'Asia/Dhaka'
  | 'Asia/Dubai'
  | 'Asia/Hong_Kong'
  | 'Asia/Istanbul'
  | 'Asia/Jakarta'
  | 'Asia/Jerusalem'
  | 'Asia/Kabul'
  | 'Asia/Karachi'
  | 'Asia/Kathmandu'
  | 'Asia/Kolkata'
  | 'Asia/Kuwait'
  | 'Asia/Manila'
  | 'Asia/Muscat'
  | 'Asia/Riyadh'
  | 'Asia/Seoul'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Taipei'
  | 'Asia/Tehran'
  | 'Asia/Tokyo'

  // Atlantic
  | 'Atlantic/Azores'
  | 'Atlantic/Bermuda'
  | 'Atlantic/Canary'
  | 'Atlantic/Cape_Verde'
  | 'Atlantic/Reykjavik'

  // Australia
  | 'Australia/Adelaide'
  | 'Australia/Brisbane'
  | 'Australia/Darwin'
  | 'Australia/Hobart'
  | 'Australia/Melbourne'
  | 'Australia/Perth'
  | 'Australia/Sydney'

  // Europe
  | 'Europe/Amsterdam'
  | 'Europe/Athens'
  | 'Europe/Belgrade'
  | 'Europe/Berlin'
  | 'Europe/Brussels'
  | 'Europe/Bucharest'
  | 'Europe/Budapest'
  | 'Europe/Copenhagen'
  | 'Europe/Dublin'
  | 'Europe/Helsinki'
  | 'Europe/Istanbul'
  | 'Europe/Lisbon'
  | 'Europe/London'
  | 'Europe/Madrid'
  | 'Europe/Moscow'
  | 'Europe/Oslo'
  | 'Europe/Paris'
  | 'Europe/Prague'
  | 'Europe/Rome'
  | 'Europe/Stockholm'
  | 'Europe/Vienna'
  | 'Europe/Warsaw'
  | 'Europe/Zurich'

  // Indian
  | 'Indian/Maldives'
  | 'Indian/Mauritius'
  | 'Indian/Reunion'

  // Pacific
  | 'Pacific/Auckland'
  | 'Pacific/Fiji'
  | 'Pacific/Guam'
  | 'Pacific/Honolulu'
  | 'Pacific/Kiritimati'
  | 'Pacific/Noumea'
  | 'Pacific/Pago_Pago'
  | 'Pacific/Port_Moresby'
  | 'Pacific/Tongatapu'

  // UTC
  | 'UTC'
  | 'GMT';

// Props when only date should be displayed
type DateOnlyProps = {
  DateOnly: true;
  dateFormat?: DateFormat;
  TimeOnly?: never;
  timeFormat?: never;
  use24HourFormat?: never;
  useRelativeTime?: never;
};

// Props when only time should be displayed
type TimeOnlyProps = {
  TimeOnly: true;
  timeFormat?: TimeFormat;
  use24HourFormat?: boolean;
  DateOnly?: never;
  dateFormat?: never;
  useRelativeTime?: never;
};

// Props when neither DateOnly nor TimeOnly are true
type DateTimeProps = {
  DateOnly?: false;
  TimeOnly?: false;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  use24HourFormat?: boolean;
  useRelativeTime?: boolean;
};

// Combine all props into a union type
export type AdvancedDateFormatterProps = {
  date: string | number;
  timezone?: Timezone;
  className?: string;
} & (DateOnlyProps | TimeOnlyProps | DateTimeProps);
