import type { Todo } from '../types/todo';

// Type guard for Todo
function isTodo(obj: unknown): obj is Todo {
  // Data migration from `completed` to `status`
  if (typeof obj === 'object' && obj !== null && 'completed' in obj) {
    const todoObj = obj as Record<string, unknown>; // Cast to a record to access properties
    if (typeof todoObj.completed === 'boolean') {
      todoObj.status = todoObj.completed ? 'done' : 'todo';
      delete todoObj.completed;
    }
  }

  const validStatus = ['todo', 'inProgress', 'blocked', 'done'];

  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const todo = obj as Record<string, unknown>; // Cast to a record to access properties

  return (
    'id' in todo && typeof todo.id === 'number' &&
    'text' in todo && typeof todo.text === 'string' &&
    'status' in todo && typeof todo.status === 'string' && validStatus.includes(todo.status) &&
    'dueDate' in todo && (typeof todo.dueDate === 'string' || todo.dueDate === null) &&
    'tags' in todo && Array.isArray(todo.tags) && todo.tags.every((tag: unknown) => typeof tag === 'string')
  );
}

// Type guard for an array of Todos
function isTodoArray(arr: unknown[]): arr is Todo[] {
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
      // Data migration for older todos without dueDate and tags
      if (Array.isArray(parsedValue)) {
        parsedValue.forEach(todo => {
          if (!('dueDate' in todo)) {
            todo.dueDate = null;
          }
          if (!('tags' in todo)) {
            todo.tags = []; // Default to empty array
          }
        });
      }

      if (isTodoArray(parsedValue as unknown[])) {
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
