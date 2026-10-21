import { API_URL } from '../config.js';

export class ApiError extends Error {
  constructor(message, { status = 0, details = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path, query = {}) {
  const url = new URL(`${API_URL}${path}`, window.location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

export async function apiRequest(path, { method = 'GET', query, body, signal } = {}) {
  let response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('No se pudo conectar con la API. Verifica que el servidor esté en ejecución.');
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.error?.message || `La API respondió con el estado ${response.status}`, {
      status: response.status,
      details: payload?.error?.details || [],
    });
  }

  return payload;
}
