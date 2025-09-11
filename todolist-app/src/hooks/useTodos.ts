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

  const sortTodos = (todosToSort: Todo[]): Todo[] => {
    const statusOrder: Record<'todo' | 'inProgress' | 'blocked' | 'done', number> = {
      inProgress: 1,
      todo: 2,
      blocked: 3,
      done: 4,
    };

    return [...todosToSort].sort((a, b) => {
      // Primary sort by flag
      if (a.flagged && !b.flagged) return -1;
      if (!a.flagged && b.flagged) return 1;

      // Secondary sort by status
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      if (statusComparison !== 0) {
        return statusComparison;
      }

      // Tertiary sort by dueDate
      if (a.dueDate === null && b.dueDate === null) return 0;
      if (a.dueDate === null) return 1; // Null due dates go to the end
      if (b.dueDate === null) return -1; // Null due dates go to the end

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      return dateA.getTime() - dateB.getTime();
    });
  };

  const addTodo = (text: string, dueDate: string | null, tags: string[]) => {
    const newTodo: Todo = {
      id: Date.now(), // Simple unique ID
      text,
      status: 'todo',
      dueDate,
      tags,
      flagged: false, // Add flagged property
    };
    setTodos((prevTodos) => sortTodos([...prevTodos, newTodo]));
  };

  const updateTodo = (id: number, newText: string, newDueDate: string | null, newTags: string[]) => {
    setTodos((prevTodos) =>
      sortTodos(prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, dueDate: newDueDate, tags: newTags } : todo
      ))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => sortTodos(prevTodos.filter((todo) => todo.id !== id)));
  };

  const updateTodoStatus = (id: number, status: 'todo' | 'inProgress' | 'blocked' | 'done') => {
    setTodos((prevTodos) =>
      sortTodos(prevTodos.map((todo) =>
        todo.id === id ? { ...todo, status } : todo
      ))
    );
  };

  const toggleFlag = (id: number) => {
    setTodos((prevTodos) =>
      sortTodos(
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, flagged: !todo.flagged } : todo
        )
      )
    );
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    toggleFlag,
  };
};
