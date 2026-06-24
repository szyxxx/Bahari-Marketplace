export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000';

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // In Astro client-side, we might use localStorage.
  // In SSR, we might need to pass the token explicitly.
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('bahari_token') || '';
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error || response.statusText,
      data
    );
  }

  return data;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, body: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  patch: (endpoint: string, body: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
