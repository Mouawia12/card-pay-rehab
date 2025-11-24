import axios, { AxiosError, type Method } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set. Please add it to your .env file.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = "خطأ من الخادم";
    if (error.response) {
      const data: any = error.response.data;
      message = data?.message || `${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      message = "تعذر الاتصال بالخادم، تحقق من تشغيل الباكند والمنفذ";
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

interface FetchOptions {
  token?: string | null;
  method?: Method;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  business_id?: number | null;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = options.token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
  const response = await api.request<T>({
    url: path,
    method: options.method ?? "GET",
    params: options.params,
    data: options.data,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  return response.data as T;
}

export async function loginApi(email: string, password: string) {
  console.info("[loginApi] calling /auth/login", API_BASE_URL);
  const result = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    data: { email, password },
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", result.token);
    localStorage.setItem("auth_user", JSON.stringify(result.user));
  }

  return result;
}

export async function logoutApi() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }
}

export async function fetchCards() {
  return apiFetch<{ data: any[] }>("/cards");
}

export async function fetchCustomers() {
  return apiFetch<{ data: any[] }>("/customers");
}

export interface AdminSummary {
  totals: {
    businesses: number;
    users: number;
    cards: number;
    customers: number;
    transactions: number;
    revenue: number;
  };
  users_by_role: Record<string, number>;
  transactions_by_day: Array<{ day: string; total: number; amount: number }>;
  latest_transactions: any[];
  latest_businesses: any[];
  latest_customers: any[];
}

export async function fetchAdminSummary() {
  return apiFetch<{ data: AdminSummary }>("/admin/summary");
}
