const ADMIN_API_KEY = 'estatein-admin-secret-2024';

export const getAdminHeaders = (apiKey?: string) => {
  const key = (apiKey || localStorage.getItem('estatein_admin_api_key') || ADMIN_API_KEY).trim();
  return {
    'Content-Type': 'application/json',
    'x-admin-api-key': key,
    'Accept': 'application/json'
  };
};

export const api = {
  get: async (url: string, apiKey?: string) => {
    const headers = getAdminHeaders(apiKey);
    console.log(`[API] GET ${url}`, headers);
    const res = await fetch(url, { headers });
    return res;
  },
  post: async (url: string, data: any, apiKey?: string) => {
    const headers = getAdminHeaders(apiKey);
    console.log(`[API] POST ${url}`, headers);
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return res;
  },
  put: async (url: string, data: any, apiKey?: string) => {
    const headers = getAdminHeaders(apiKey);
    console.log(`[API] PUT ${url}`, headers);
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return res;
  },
  delete: async (url: string, apiKey?: string) => {
    const headers = getAdminHeaders(apiKey);
    console.log(`[API] DELETE ${url}`, headers);
    const res = await fetch(url, {
      method: 'DELETE',
      headers
    });
    return res;
  }
};
