export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setStoredToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const getStoredUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('user_info');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: any | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('user_info', JSON.stringify(user));
  } else {
    localStorage.removeItem('user_info');
  }
};

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = options.token !== undefined ? options.token : getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Yêu cầu thất bại với mã lỗi ${response.status}`;
    let errorData = null;

    try {
      errorData = await response.json();
      if (errorData) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
    } catch {
      // response không phải JSON
    }

    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export const chatApi = {
  getSessions: async (guestIds?: string[]) => {
    const params = guestIds && guestIds.length > 0 ? `?guest_ids=${guestIds.join(',')}` : '';
    return api.get(`/api/chat/sessions${params}`);
  },
  getSessionDetail: async (id: string) => {
    return api.get(`/api/chat/sessions/${id}`);
  },
  createSession: async (title?: string) => {
    return api.post('/api/chat/sessions', { title });
  },
  updateSessionTitle: async (id: string, title: string) => {
    return api.patch(`/api/chat/sessions/${id}`, { title });
  },
  deleteSession: async (id: string) => {
    return api.delete(`/api/chat/sessions/${id}`);
  },
};
