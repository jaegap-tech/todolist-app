import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorage';
import { DUMMY_TODOS } from '../data/todos';
import { vi } from 'vitest';
import type { Todo } from '../types/todo';

// Mock localStorage functions
vi.mock('../services/localStorage', () => ({
  loadFromLocalStorage: vi.fn(),
  saveToLocalStorage: vi.fn(),
}));

// Mock DUMMY_TODOS to control initial state
vi.mock('../data/todos', () => ({
  DUMMY_TODOS: [{ id: 99, text: 'Dummy Todo', status: 'todo', dueDate: null, tags: [] }],
}));

describe('useTodos', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (loadFromLocalStorage as vi.Mock).mockClear();
    (saveToLocalStorage as vi.Mock).mockClear();
  });

  it('loads todos from local storage on initial render', () => {
    const storedData: Todo[] = [{ id: 1, text: 'Stored Todo', status: 'todo', dueDate: null, tags: [] }];
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

  it('adds a new todo with a due date and tags', () => {
    (loadFromLocalStorage as vi.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useTodos());
    const dueDate = '2025-12-31';
    const tags = ['work', 'urgent'];

    act(() => {
      result.current.addTodo('New Todo', dueDate, tags);
    });

    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].text).toBe('New Todo');
    expect(result.current.todos[0].status).toBe('todo');
    expect(result.current.todos[0].dueDate).toBe(dueDate);
    expect(result.current.todos[0].tags).toEqual(tags);
  });

  it('updates an existing todo with a new due date and tags', () => {
    const initialTodos: Todo[] = [{ id: 1, text: 'Original Todo', status: 'todo', dueDate: null, tags: [] }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(initialTodos);
    const { result } = renderHook(() => useTodos());
    const newDueDate = '2026-01-15';
    const newTags = ['personal'];

    act(() => {
      result.current.updateTodo(1, 'Updated Todo', newDueDate, newTags);
    });

    expect(result.current.todos[0].text).toBe('Updated Todo');
    expect(result.current.todos[0].dueDate).toBe(newDueDate);
    expect(result.current.todos[0].tags).toEqual(newTags);
  });

  it('deletes a todo', () => {
    const initialTodos: Todo[] = [{ id: 1, text: 'Todo to delete', status: 'todo', dueDate: null, tags: [] }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(initialTodos);
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.deleteTodo(1);
    });

    expect(result.current.todos.length).toBe(0);
  });

  it('updates a todo status', () => {
    const initialTodos: Todo[] = [{ id: 1, text: 'Status Todo', status: 'todo', dueDate: null, tags: [] }];
    (loadFromLocalStorage as vi.Mock).mockReturnValue(initialTodos);
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateTodoStatus(1, 'inProgress');
    });

    expect(result.current.todos[0].status).toBe('inProgress');

    act(() => {
      result.current.updateTodoStatus(1, 'done');
    });

    expect(result.current.todos[0].status).toBe('done');
  });

  it('saves todos to local storage when todos change', () => {
    (loadFromLocalStorage as vi.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useTodos());

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1); // Initial save

    act(() => {
      result.current.addTodo('Another Todo', null, []);
    });

    expect(saveToLocalStorage).toHaveBeenCalledTimes(2); // After adding todo
    expect(saveToLocalStorage).toHaveBeenCalledWith('todos', result.current.todos);
  });
});