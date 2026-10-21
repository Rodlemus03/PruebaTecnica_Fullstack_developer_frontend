import { apiRequest } from './client.js';

export function getTickets(query, signal) {
  return apiRequest('/tickets', { query, signal });
}

export async function getTicket(id, signal) {
  const { data } = await apiRequest(`/tickets/${encodeURIComponent(id)}`, { signal });
  return data;
}

export async function createTicket(payload) {
  const { data } = await apiRequest('/tickets', { method: 'POST', body: payload });
  return data;
}

export async function updateTicket(id, payload) {
  const { data } = await apiRequest(`/tickets/${encodeURIComponent(id)}`, { method: 'PUT', body: payload });
  return data;
}

export function deleteTicket(id) {
  return apiRequest(`/tickets/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
