import { apiRequest } from './client.js';

export async function getHealth(signal) {
  const { data } = await apiRequest('/health', { signal });
  return data;
}
