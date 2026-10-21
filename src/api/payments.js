import { apiRequest } from './client.js';

export async function getPaymentWeeks(signal) {
  const { data } = await apiRequest('/payments/weeks', { signal });
  return data;
}

export async function getWeeklyPayments({ year, week }, signal) {
  const { data } = await apiRequest('/payments/weekly', { query: { year, week }, signal });
  return data;
}
