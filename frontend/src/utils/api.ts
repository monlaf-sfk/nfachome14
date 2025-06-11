const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from storage on initialization
    this.token = localStorage.getItem('token');
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      // Correctly use bracket notation for 'Authorization' header
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // --- START OF THE FIX ---

    // Check for a 204 No Content response.
    // This happens on a successful DELETE.
    if (response.status === 204) {
      // If there's no content, we can't call response.json().
      // We return null, cast to the generic type T, to satisfy TypeScript.
      // The calling function (e.g., deleteTodo) will receive this as a successful resolution.
      return null as T;
    }

    // --- END OF THE FIX ---

    // Now, handle potential errors for all other responses.
    if (!response.ok) {
      // Try to parse error details from the body, but guard against it being empty.
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    // For all other successful responses (like 200 OK, 201 Created), parse the JSON body.
    return response.json();
  }

  // No changes needed to the public methods below
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Note: The original had <T> here, but since DELETE returns nothing,
  // we can be more specific. Let's make it Promise<void> for clarity.
  async delete(endpoint: string): Promise<void> {
    // We cast the result to void because we don't expect a return value.
    await this.request<void>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);