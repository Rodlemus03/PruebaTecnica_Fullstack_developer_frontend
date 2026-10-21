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
