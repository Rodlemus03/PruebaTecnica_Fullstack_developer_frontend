import { apiRequest } from './client.js';

export async function getCatalogs(signal) {
  const [suppliers, lands, products] = await Promise.all([
    apiRequest('/suppliers', { signal }),
    apiRequest('/lands', { signal }),
    apiRequest('/products', { signal }),
  ]);

  return {
    suppliers: suppliers.data,
    lands: lands.data,
    products: products.data,
  };
}
