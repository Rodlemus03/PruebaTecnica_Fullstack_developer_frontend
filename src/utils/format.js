const shortDateFormatter = new Intl.DateTimeFormat('es-GT', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const longDateFormatter = new Intl.DateTimeFormat('es-GT', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const quantityFormatter = new Intl.NumberFormat('es-GT');

function toUtcDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

export function formatDate(value) {
  return shortDateFormatter.format(toUtcDate(value));
}

export function formatLongDate(value) {
  return longDateFormatter.format(toUtcDate(value));
}

export function formatQuantity(value) {
  return quantityFormatter.format(value);
}

export function formatAmount(value) {
  const [integerPart, decimalPart = ''] = String(value).split('.');
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${groupedInteger}.${decimalPart.padEnd(3, '0')}`;
}

export function formatMillis(millis) {
  const integerPart = Math.floor(millis / 1000);
  const decimalPart = String(millis % 1000).padStart(3, '0');

  return formatAmount(`${integerPart}.${decimalPart}`);
}

const dayMonthFormatter = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const dayMonthYearFormatter = new Intl.DateTimeFormat('es-GT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const shortDayMonthFormatter = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const compactFormatter = new Intl.NumberFormat('es-GT', { notation: 'compact', maximumFractionDigits: 1 });

export function formatDateRange(startDate, endDate) {
  const start = toUtcDate(startDate);
  const end = toUtcDate(endDate);
  const endText = dayMonthYearFormatter.format(end);

  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `Del ${dayMonthYearFormatter.format(start)} al ${endText}`;
  }

  if (start.getUTCMonth() !== end.getUTCMonth()) {
    return `Del ${dayMonthFormatter.format(start)} al ${endText}`;
  }

  return `Del ${start.getUTCDate()} al ${endText}`;
}

export function formatShortRange(startDate, endDate) {
  const start = toUtcDate(startDate);
  const end = toUtcDate(endDate);

  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${shortDayMonthFormatter.format(end)}`;
  }

  return `${shortDayMonthFormatter.format(start)} – ${shortDayMonthFormatter.format(end)}`;
}

export function formatCompact(value) {
  return compactFormatter.format(value);
}

export function amountToMillis(value) {
  const [integerPart, decimalPart = ''] = String(value).split('.');
  return Number(integerPart) * 1000 + Number(decimalPart.padEnd(3, '0').slice(0, 3));
}
