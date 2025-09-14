import axios from 'axios';
import type { Todo } from '../types/todo';

const API_BASE_URL = 'http://localhost:3001/api'; // Backend server URL

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${API_BASE_URL}/todos`);
  return response.data;
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await axios.post(`${API_BASE_URL}/todos`, todo);
  return response.data;
};

export const updateTodoApi = async (todo: Todo): Promise<Todo> => {
  const response = await axios.put(`${API_BASE_URL}/todos/${todo.id}`, todo);
  return response.data;
};

export const deleteTodoApi = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/todos/${id}`);
};
