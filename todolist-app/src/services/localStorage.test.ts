import { saveToLocalStorage, loadFromLocalStorage } from './localStorage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Todo } from '../types/todo';

describe('localStorage service', () => {
  const MOCK_KEY = 'testKey';
  const MOCK_VALUE = { data: 'testData' };
  const MOCK_TODOS_KEY = 'todos';
  const MOCK_TODOS_VALUE: Todo[] = [
    { id: 1, text: 'Todo 1', status: 'todo', dueDate: null, tags: [], flagged: false },
    { id: 2, text: 'Todo 2', status: 'done', dueDate: '2025-12-31', tags: ['work', 'urgent'], flagged: false },
  ];

  // Mock localStorage
  interface LocalStorageMock {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
  }
  let localStorageMock: LocalStorageMock;

  beforeEach(() => {
    let store: { [key: string]: string } = {};
    localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  // saveToLocalStorage tests
  it('should save data to local storage', () => {
    saveToLocalStorage(MOCK_KEY, MOCK_VALUE);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(MOCK_KEY, JSON.stringify(MOCK_VALUE));
  });

  it('should handle errors when saving to local storage', () => {
    vi.spyOn(localStorageMock, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    saveToLocalStorage(MOCK_KEY, MOCK_VALUE);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving to local storage:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  // loadFromLocalStorage tests
  it('should load data from local storage', () => {
    localStorageMock.setItem(MOCK_KEY, JSON.stringify(MOCK_VALUE));
    const loadedValue = loadFromLocalStorage(MOCK_KEY);
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(MOCK_KEY);
    expect(loadedValue).toEqual(MOCK_VALUE);
  });

  it('should return undefined if key does not exist', () => {
    const loadedValue = loadFromLocalStorage(MOCK_KEY);
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
    expect(loadedValue).toBeUndefined();
  });

  it('should return undefined and log error if data is invalid JSON', () => {
    localStorageMock.setItem(MOCK_KEY, 'invalid json');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const loadedValue = loadFromLocalStorage(MOCK_KEY);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading from local storage:', expect.any(Error));
    expect(loadedValue).toBeUndefined();
    consoleErrorSpy.mockRestore();
  });

  it('should return undefined and log warning if todos data is corrupted', () => {
    localStorageMock.setItem(MOCK_TODOS_KEY, JSON.stringify([{ id: 1, text: 'Todo 1' }])); // Missing status, dueDate, and tags fields
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const loadedValue = loadFromLocalStorage(MOCK_TODOS_KEY);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Validation failed for key '${MOCK_TODOS_KEY}'. Data might be corrupted or not of expected type.`
    );
    expect(loadedValue).toBeUndefined();
    consoleWarnSpy.mockRestore();
  });

  it('should load todos data correctly with validation', () => {
    localStorageMock.setItem(MOCK_TODOS_KEY, JSON.stringify(MOCK_TODOS_VALUE));
    const loadedValue = loadFromLocalStorage<Todo[]>(MOCK_TODOS_KEY);
    expect(loadedValue).toEqual(MOCK_TODOS_VALUE);
  });

  it('should migrate old data by adding dueDate and tags', () => {
    const oldData = [
      { id: 1, text: 'Old Todo 1', completed: false },
    ];
    localStorageMock.setItem(MOCK_TODOS_KEY, JSON.stringify(oldData));

    const loadedValue = loadFromLocalStorage<Todo[]>(MOCK_TODOS_KEY);
    expect(loadedValue).toBeDefined();
    expect(loadedValue![0].dueDate).toBe(null);
    expect(loadedValue![0].tags).toEqual([]);
  });

  it('should migrate old data from completed to status', () => {
    const oldData = [
      { id: 1, text: 'Old Todo 1', completed: false, dueDate: null, tags: [] },
      { id: 2, text: 'Old Todo 2', completed: true, dueDate: null, tags: [] },
    ];
    localStorageMock.setItem(MOCK_TODOS_KEY, JSON.stringify(oldData));

    const loadedValue = loadFromLocalStorage<Todo[]>(MOCK_TODOS_KEY);
    expect(loadedValue).toBeDefined();
    expect(loadedValue![0].status).toBe('todo');
    expect(loadedValue![1].status).toBe('done');
    expect(loadedValue![0]).not.toHaveProperty('completed');
  });

  it('should save and load theme preference', () => {
    const themeKey = 'themePreference';
    const themeValue = 'dark';

    saveToLocalStorage(themeKey, themeValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(themeKey, JSON.stringify(themeValue));

    const loadedTheme = loadFromLocalStorage(themeKey);
    expect(loadedTheme).toBe(themeValue);
  });
});