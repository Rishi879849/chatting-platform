const API_BASE_URL = 'http://localhost:5000/api/v1';

let cachedAccessToken = null;

export function setAccessToken(token) {
  cachedAccessToken = token;
}

export function getAccessToken() {
  return cachedAccessToken;
}

/**
 * Robust fetch wrapper with automatic JWT token refresh on 401 Unauthorized.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (cachedAccessToken) {
    headers['Authorization'] = `Bearer ${cachedAccessToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly session cookies
  };

  try {
    let response = await fetch(url, config);

    // Auto Refresh on Token Expiry (OWASP A07)
    if (response.status === 401 && !options._retry) {
      options._retry = true;
      const refreshSuccess = await refreshAccessToken();
      if (refreshSuccess) {
        headers['Authorization'] = `Bearer ${cachedAccessToken}`;
        response = await fetch(url, { ...config, headers });
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || `HTTP ${response.status} - Request Failed`);
      error.status = response.status;
      error.code = data.code;
      error.details = data.details;
      throw error;
    }

    return data;
  } catch (err) {
    // If backend server is starting or network fails, propagate structured error
    console.warn(`[API CLIENT WARNING] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
}

/**
 * Attempts silent token refresh via HttpOnly refresh cookie.
 */
async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        return true;
      }
    }
  } catch (err) {
    console.error('Silent session refresh failed:', err.message);
  }
  return false;
}
