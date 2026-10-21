import { apiRequest } from './client.js';

export function getTickets(query, signal) {
  return apiRequest('/tickets', { query, signal });
}

export async function getTicket(id, signal) {
  const { data } = await apiRequest(`/tickets/${encodeURIComponent(id)}`, { signal });
  return data;
}
