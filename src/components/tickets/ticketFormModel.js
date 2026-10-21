const CODE_MAX_LENGTH = 20;
export const MAX_LINES = 50;
const MAX_QUANTITY = 1000000;
const QUANTITY_PATTERN = /^\d+$/;
const PRICE_PATTERN = /^\d{1,5}(\.\d{1,3})?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HEADER_FIELDS = ['code', 'date', 'supplierId', 'landId', 'details'];
const LINE_FIELD_PATTERN = /^details\[(\d+)\]\.(productId|quantity|price)$/;

let lastLineKey = 0;

export function createLine(values = {}) {
  lastLineKey += 1;
  return { key: `linea-${lastLineKey}`, productId: '', quantity: '', price: '', ...values };
}

function todayInLocalTime() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
}

export function createEmptyTicket() {
  return { code: '', date: todayInLocalTime(), supplierId: '', landId: '', lines: [createLine()] };
}

export function ticketToFormValues(ticket) {
  return {
    code: ticket.code,
    date: ticket.date,
    supplierId: String(ticket.supplier.id),
    landId: String(ticket.land.id),
    lines: ticket.details.map((line) =>
      createLine({ productId: String(line.product.id), quantity: String(line.quantity), price: line.price }),
    ),
  };
}

function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseQuantity(value) {
  const text = value.trim();
  if (!QUANTITY_PATTERN.test(text)) return null;

  const quantity = Number(text);
  return quantity <= MAX_QUANTITY ? quantity : null;
}

export function parsePriceMillis(value) {
  const text = value.trim();
  if (!PRICE_PATTERN.test(text)) return null;

  const [integerPart, decimalPart = ''] = text.split('.');
  const millis = Number(integerPart) * 1000 + Number(decimalPart.padEnd(3, '0'));

  return millis > 0 ? millis : null;
}

export function lineAmountMillis(line) {
  const quantity = parseQuantity(line.quantity);
  const priceMillis = parsePriceMillis(line.price);

  return quantity === null || priceMillis === null ? null : quantity * priceMillis;
}

export function validateTicketForm(values) {
  const errors = { lines: {} };
  const code = values.code.trim();

  if (!code) errors.code = 'Escribe el código del ticket.';
  else if (code.length > CODE_MAX_LENGTH) errors.code = `Usa como máximo ${CODE_MAX_LENGTH} caracteres.`;

  if (!isValidDate(values.date)) errors.date = 'Elige una fecha válida.';
  if (!values.supplierId) errors.supplierId = 'Elige un proveedor.';
  if (!values.landId) errors.landId = 'Elige un land.';

  if (values.lines.length === 0) errors.details = 'Agrega al menos una línea.';
  if (values.lines.length > MAX_LINES) errors.details = `Un ticket admite como máximo ${MAX_LINES} líneas.`;

  values.lines.forEach((line) => {
    const lineErrors = {};

    if (!line.productId) lineErrors.productId = 'Elige un producto.';
    if (parseQuantity(line.quantity) === null) lineErrors.quantity = 'Usa un entero entre 0 y 1,000,000.';
    if (parsePriceMillis(line.price) === null) {
      lineErrors.price = 'Usa un precio mayor que 0 y menor que 100,000, con hasta 3 decimales.';
    }

    if (Object.keys(lineErrors).length > 0) errors.lines[line.key] = lineErrors;
  });

  return errors;
}

export function countErrors(errors) {
  const headerErrors = HEADER_FIELDS.filter((field) => errors[field]).length;
  const lineErrors = Object.values(errors.lines).reduce((sum, fields) => sum + Object.keys(fields).length, 0);

  return headerErrors + lineErrors;
}

export function toTicketPayload(values) {
  return {
    code: values.code.trim(),
    date: values.date,
    supplierId: Number(values.supplierId),
    landId: Number(values.landId),
    details: values.lines.map((line) => ({
      productId: Number(line.productId),
      quantity: parseQuantity(line.quantity),
      price: line.price.trim(),
    })),
  };
}

function toSentence(message) {
  const text = message.charAt(0).toUpperCase() + message.slice(1);
  return text.endsWith('.') ? text : `${text}.`;
}

export function mapServerErrors(error, values) {
  const errors = { lines: {} };

  if (error.status === 409) {
    errors.code = toSentence(error.message);
  }

  (error.details || []).forEach(({ field, message }) => {
    const lineMatch = field.match(LINE_FIELD_PATTERN);

    if (lineMatch) {
      const line = values.lines[Number(lineMatch[1])];
      if (line) errors.lines[line.key] = { ...errors.lines[line.key], [lineMatch[2]]: toSentence(message) };
    } else if (HEADER_FIELDS.includes(field)) {
      errors[field] = toSentence(message);
    }
  });

  const message =
    countErrors(errors) > 0
      ? 'No se guardó el ticket. Revisa los campos marcados.'
      : `No se guardó el ticket. ${toSentence(error.message)}`;

  return { errors, message };
}
