import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorage';
import { DUMMY_TODOS } from '../data/todos';
import { vi } from 'vitest';

// Mock localStorage functions
vi.mock('../services/localStorage', () => ({
  loadFromLocalStorage: vi.fn(),
  saveToLocalStorage: vi.fn(),
}));

// Mock DUMMY_TODOS to control initial state
vi.mock('../data/todos', () => ({
  DUMMY_TODOS: [{ id: 99, text: 'Dummy Todo', completed: false }],
}));

describe('useTodos', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (loadFromLocalStorage as vi.Mock).mockClear();
    (saveToLocalStorage as vi.Mock).mockClear();
  });

  it('loads todos from local storage on initial render', () => {
    const storedData = [{ id: 1, text: 'Stored Todo', completed: false }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(storedData);

    const { result } = renderHook(() => useTodos());

    expect(loadFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual(storedData);
  });

  it('uses dummy todos if local storage is empty', () => {
    (loadFromLocalStorage as vi.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useTodos());

    expect(loadFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual(DUMMY_TODOS);
  });

  it('adds a new todo', () => {
    (loadFromLocalStorage as vi.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('New Todo');
    });

    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].text).toBe('New Todo');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('updates an existing todo', () => {
    const initialTodos = [{ id: 1, text: 'Original Todo', completed: false }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(initialTodos);
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateTodo(1, 'Updated Todo');
    });

    expect(result.current.todos[0].text).toBe('Updated Todo');
  });

  it('deletes a todo', () => {
    const initialTodos = [{ id: 1, text: 'Todo to delete', completed: false }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(initialTodos);
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.deleteTodo(1);
    });

    expect(result.current.todos.length).toBe(0);
  });

  it('toggles todo completed status', () => {
    const initialTodos = [{ id: 1, text: 'Toggle Todo', completed: false }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(initialTodos);
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.toggleTodo(1);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo(1);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('saves todos to local storage when todos change', () => {
    (loadFromLocalStorage as vi.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useTodos());

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1); // Initial save

    act(() => {
      result.current.addTodo('Another Todo');
    });

    expect(saveToLocalStorage).toHaveBeenCalledTimes(2); // After adding todo
    expect(saveToLocalStorage).toHaveBeenCalledWith('todos', result.current.todos);
  });
});
