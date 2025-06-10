import { useState, useEffect } from 'react';
import {User, AuthResponse, LoginCredentials, RegisterCredentials, UserCreateSchemaForFrontend} from '../types'; // Added UserCreateSchemaForFrontend
import { apiClient } from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        apiClient.setToken(token);
        const userData = await apiClient.get<User>('/users/me');
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      apiClient.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setError(null);
      setAuthActionLoading(true);

      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${apiClient.getBaseURL()}/auth/token`, {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include', // required if your backend sets cookies
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('HTML error response:', text.slice(0, 500));
        throw new Error(`Expected JSON but got HTML. Status: ${response.status}`);
      }


      const authData: AuthResponse = await response.json();
      apiClient.setToken(authData.access_token);

      const userData = await apiClient.get<User>('/users/me');
      setUser(userData);

      return authData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown login error occurred.';
      console.error('Login error:', err);
      setError(errorMessage);
      apiClient.clearToken();
      setUser(null);
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setError(null);
      setAuthActionLoading(true);

      const userCreateData: UserCreateSchemaForFrontend = {
        email: credentials.email,
        password: credentials.password,
      };

      await apiClient.post<User>('/users/', userCreateData);

      await login({ email: credentials.email, password: credentials.password });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown registration error occurred.';
      console.error('Registration error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setAuthActionLoading(false);
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  return {
    user,
    loading,
    authActionLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    checkAuth,
  };
};