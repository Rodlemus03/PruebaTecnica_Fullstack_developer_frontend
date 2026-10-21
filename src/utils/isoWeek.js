const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

export function getIsoWeek(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  const weekday = date.getUTCDay() || 7;
  const thursday = new Date(date.getTime() + (4 - weekday) * MS_PER_DAY);
  const year = thursday.getUTCFullYear();
  const week = Math.floor((thursday.getTime() - Date.UTC(year, 0, 1)) / (7 * MS_PER_DAY)) + 1;

  return { year, week };
}

export function weeksInIsoYear(year) {
  return getIsoWeek(`${year}-12-28`).week;
}

export function getIsoWeekRange(year, week) {
  const january4 = new Date(Date.UTC(year, 0, 4));
  const weekday = january4.getUTCDay() || 7;
  const firstMonday = january4.getTime() - (weekday - 1) * MS_PER_DAY;
  const start = new Date(firstMonday + (week - 1) * 7 * MS_PER_DAY);
  const end = new Date(start.getTime() + 6 * MS_PER_DAY);

  return { startDate: toDateString(start), endDate: toDateString(end) };
}

export function shiftIsoWeek({ year, week }, offset) {
  const date = new Date(`${getIsoWeekRange(year, week).startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset * 7);

  return getIsoWeek(toDateString(date));
}

export function currentIsoWeek() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return getIsoWeek(`${now.getFullYear()}-${month}-${day}`);
}

export function describeInvalidWeek({ year, week }) {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return `El año debe ser un número entre ${MIN_YEAR} y ${MAX_YEAR}.`;
  }

  const weekCount = weeksInIsoYear(year);
  if (!Number.isInteger(week) || week < 1 || week > weekCount) {
    return `El año ${year} tiene ${weekCount} semanas ISO. Elige una semana entre 1 y ${weekCount}.`;
  }

  return '';
}
