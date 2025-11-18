const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set. Please add it to your .env file.");
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = options.token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "فشل الاتصال بالخادم");
  }

  // Some endpoints may return empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export async function loginApi(email: string, password: string) {
  const result = await apiFetch<{ user: any; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", result.token);
  }

  return result;
}

export async function fetchCards() {
  return apiFetch<{ data: any[] }>("/cards");
}

export async function fetchCustomers() {
  return apiFetch<{ data: any[] }>("/customers");
}
