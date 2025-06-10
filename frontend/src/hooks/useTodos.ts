import { useState, useEffect } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';
import { apiClient } from '../utils/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
  try {
      setError(null);
      setLoading(true);
      const todosData = await apiClient.get<Todo[]>('/tasks/'); // Corrected
      setTodos(todosData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData: CreateTodoRequest) => {
    try {
      setError(null);
      const newTodo = await apiClient.post<Todo>('/tasks/', todoData);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: UpdateTodoRequest) => {
    try {
      setError(null);
      const updatedTodo = await apiClient.put<Todo>(`/tasks/${id}`, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await apiClient.delete(`/tasks/${id}`);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      throw err;
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    return updateTodo(id, { completed });
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    refetch: fetchTodos,
  };
};