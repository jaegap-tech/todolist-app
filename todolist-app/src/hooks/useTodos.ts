import { useState, useEffect, useMemo } from 'react';
import type { Todo } from '../types/todo';
import { getTodos, createTodo, updateTodoApi, deleteTodoApi } from '../services/todoApi';

export const useTodos = () => {
  const [internalTodos, setInternalTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTodos();
        setInternalTodos(todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const sortedTodos = useMemo(() => {
    const statusOrder: Record<'todo' | 'inProgress' | 'blocked' | 'done', number> = {
      inProgress: 1,
      todo: 2,
      blocked: 3,
      done: 4,
    };

    return [...internalTodos].sort((a, b) => {
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
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      return dateA.getTime() - dateB.getTime();
    });
  }, [internalTodos]);

  const addTodo = async (text: string, dueDate: string | null, tags: string[]) => {
    try {
      const newTodo = await createTodo({
        text,
        status: 'todo',
        dueDate,
        tags,
        flagged: false,
      });
      setInternalTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id: number, newText: string, newDueDate: string | null, newTags: string[]) => {
    try {
      const todoToUpdate = internalTodos.find((todo) => todo.id === id);
      if (todoToUpdate) {
        const updated = await updateTodoApi({ ...todoToUpdate, text: newText, dueDate: newDueDate, tags: newTags });
        setInternalTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? updated : todo))
        );
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await deleteTodoApi(id);
      setInternalTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodoStatus = async (id: number, status: 'todo' | 'inProgress' | 'blocked' | 'done') => {
    try {
      const todoToUpdate = internalTodos.find((todo) => todo.id === id);
      if (todoToUpdate) {
        const updated = await updateTodoApi({ ...todoToUpdate, status });
        setInternalTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? updated : todo))
        );
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const toggleFlag = async (id: number) => {
    try {
      const todoToUpdate = internalTodos.find((todo) => todo.id === id);
      if (todoToUpdate) {
        const updated = await updateTodoApi({ ...todoToUpdate, flagged: !todoToUpdate.flagged });
        setInternalTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? updated : todo))
        );
      }
    } catch (error) {
      console.error('Error toggling todo flag:', error);
    }
  };

  return {
    todos: sortedTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    toggleFlag,
  };
};
