import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorage';
import { DUMMY_TODOS } from '../data/todos'; // For initial load if local storage is empty

const TODO_STORAGE_KEY = 'todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = loadFromLocalStorage<Todo[]>(TODO_STORAGE_KEY);
    return storedTodos || DUMMY_TODOS; // Load from storage or use dummy data
  });

  useEffect(() => {
    saveToLocalStorage(TODO_STORAGE_KEY, todos);
  }, [todos]);

  const addTodo = (text: string, dueDate: string | null, tags: string[]) => {
    const newTodo: Todo = {
      id: Date.now(), // Simple unique ID
      text,
      completed: false,
      dueDate,
      tags,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const updateTodo = (id: number, newText: string, newDueDate: string | null, newTags: string[]) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, dueDate: newDueDate, tags: newTags } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};