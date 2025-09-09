import { saveToLocalStorage, loadFromLocalStorage } from './localStorage';
import { vi } from 'vitest';

describe('localStorage service', () => {
  const MOCK_KEY = 'testKey';
  const MOCK_VALUE = { data: 'testData' };
  const MOCK_TODOS_KEY = 'todos';
  const MOCK_TODOS_VALUE = [
    { id: 1, text: 'Todo 1', completed: false },
    { id: 2, text: 'Todo 2', completed: true },
  ];

  // Mock localStorage
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
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
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  beforeEach(() => {
    localStorageMock.clear();
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
    localStorageMock.setItem(MOCK_TODOS_KEY, JSON.stringify([{ id: 1, text: 'Todo 1' }])); // Missing completed field
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
    const loadedValue = loadFromLocalStorage(MOCK_TODOS_KEY);
    expect(loadedValue).toEqual(MOCK_TODOS_VALUE);
  });
});
