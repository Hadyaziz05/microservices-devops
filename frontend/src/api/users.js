export async function loginUser(email, password) {
  const response = await fetch('https://myapp.local/api/user/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  const token = response.headers.get('x-auth-token');
  
  if (token) {
    localStorage.setItem('authToken', token);
  }
  
  if (data.user) {
    localStorage.setItem('userData', JSON.stringify(data.user));
  }
  
  return { token, message: data.message };
}

export async function signupUser(name, email, password) {
  const res = await fetch('https://myapp.local/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  const data = await res.json();
  const token = res.headers.get('x-auth-token');
  
  if (token) {
    localStorage.setItem('authToken', token);
  }
  
  if (data.user) {
    localStorage.setItem('userData', JSON.stringify(data.user));
  }
  
  return { token, message: data.message };
}

// Helper functions for auth
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function isAuthenticated() {
  return !!getAuthToken();
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('cart');
}