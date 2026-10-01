export interface User {
  id: number;
  name: string;
  email: string;
  role: "reader" | "admin";
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  rating: number;
  category: string;
  imageUrl: string;
  totalCopies: number;
  availableCopies: number;
  available: boolean;
}

export interface Loan {
  id: number;
  bookId: number;
  title: string;
  author: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: string;
  overdue: boolean;
  userName?: string;
  userEmail?: string;
}

const TOKEN_KEY = "bibliohub_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensagem || `Erro HTTP ${response.status}`);
  return data as T;
}
