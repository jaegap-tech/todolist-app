import React, { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';
import { clsx } from 'clsx';

interface EditTodoFormProps {
  todo: Todo;
  onSave: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void;
  onCancel: () => void;
}

const EditTodoForm: React.FC<EditTodoFormProps> = ({ todo, onSave, onCancel }) => {
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState(todo.dueDate || '');
  const [tagsInput, setTagsInput] = useState(todo.tags.join(', '));
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setHasError(true);
      return;
    }

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setHasError(false);
    onSave(todo.id, trimmedText, dueDate || null, tags);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const inputClasses = clsx(
    "flex-grow p-2.5 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
    {
      "border-red-500": hasError,
      "border-gray-300 dark:border-gray-600": !hasError,
    }
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2.5 w-full">
      <label htmlFor={`edit-todo-input-${todo.id}`} className="sr-only">Edit todo text</label>
      <input
        ref={inputRef}
        id={`edit-todo-input-${todo.id}`}
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={inputClasses}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `edit-todo-error-${todo.id}` : undefined}
      />
      <label htmlFor={`edit-due-date-input-${todo.id}`} className="sr-only">Edit due date</label>
      <input
        id={`edit-due-date-input-${todo.id}`}
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        onKeyDown={handleKeyDown}
        className="p-2.5 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
      />
      <label htmlFor={`edit-tags-input-${todo.id}`} className="sr-only">Tags (comma-separated)</label>
      <input
        id={`edit-tags-input-${todo.id}`}
        type="text"
        placeholder="Tags (comma-separated)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow p-2.5 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
      />
      <button type="submit" aria-label={`Save changes for todo ${todo.id}`} className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
      {hasError && <span id={`edit-todo-error-${todo.id}`} className="text-red-500 text-sm w-full mt-1">Todo cannot be empty</span>}
    </form>
  );
};

export default EditTodoForm;
