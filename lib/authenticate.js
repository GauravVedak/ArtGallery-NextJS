import { jwtDecode } from 'jwt-decode';

export function setToken(token) {
  if (token) {
    localStorage.setItem('access_token', token);
  }
}

export function getToken() {
  try {
    return localStorage.getItem('access_token') || null;
  } catch {
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem('access_token');
}

export function readToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid JWT token:", err);
    removeToken();
    return null;
  }
}

export function isAuthenticated() {
  return !!readToken();
}

export async function authenticateUser(user, password) {
  console.log("Logging in:", user);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ userName: user, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();
  console.log("Login response:", res.status, data);

  if (res.status === 200 && data?.message?.token) {
    setToken(data.message.token);
    return true;
  } else {
    throw new Error(data.message || "Login failed");
  }
}

export async function registerUser(user, password, password2) {
  console.log("Registering:", user);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: user, password, password2 }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();
  console.log("Register response:", res.status, data);

  if (res.status === 200) {
    return true;
  } else {
    throw new Error(data.message || "Registration failed");
  }
}