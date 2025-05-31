import moment from 'moment-timezone';
import useTimezoneStore from '@/_stores/timezone-store';

export const getDateTimezone = (
  date: string,
  type: 'date' | 'date_time',
  timezone?: string,
): string => {
  const {
    timezone: userTz,
    date_format,
    time_format,
  } = useTimezoneStore.getState();

  const defaultFormats = {
    date: 'YYYY-MM-DD',
    time: 'HH:mm:ss',
  };

  let format = '';
  const dateFormat = date_format || defaultFormats.date;
  const timeFormat = time_format || defaultFormats.time;

  if (type === 'date') {
    format = dateFormat;
  }

  if (type === 'date_time') {
    format = `${dateFormat} - ${timeFormat}`;
  }

  if (timezone) {
    return moment(date).tz(timezone).format(format);
  }

  const userTimezone = userTz || moment.tz.guess();

  return moment(date).tz(userTimezone).format(format);
};
