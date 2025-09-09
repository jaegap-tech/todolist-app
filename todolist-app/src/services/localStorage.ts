import type { Todo } from '../types/todo';

// Type guard for Todo
function isTodo(obj: any): obj is Todo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.text === 'string' &&
    typeof obj.completed === 'boolean' &&
    'dueDate' in obj &&
    (typeof obj.dueDate === 'string' || obj.dueDate === null)
  );
}

// Type guard for an array of Todos
function isTodoArray(arr: any[]): arr is Todo[] {
  return Array.isArray(arr) && arr.every(isTodo);
}

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to local storage:', error);
    // Handle potential QuotaExceededError or other issues
  }
};

export const loadFromLocalStorage = <T>(key: string): T | undefined => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return undefined;
    }
    const parsedValue: unknown = JSON.parse(serializedValue);

    // Apply type validation based on the key or expected type
    if (key === 'todos') {
      // Data migration for older todos without dueDate
      if (Array.isArray(parsedValue)) {
        parsedValue.forEach(todo => {
          if (!('dueDate' in todo)) {
            todo.dueDate = null;
          }
        });
      }

      if (isTodoArray(parsedValue as any[])) {
        return parsedValue as T;
      } else {
        console.warn(`Validation failed for key '${key}'. Data might be corrupted or not of expected type.`);
        return undefined;
      }
    }

    // For other keys, return the parsed value without specific validation
    return parsedValue as T;

  } catch (error) {
    console.error('Error loading from local storage:', error);
    return undefined;
  }
};