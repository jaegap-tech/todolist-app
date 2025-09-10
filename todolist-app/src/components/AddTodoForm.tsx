import React, { useState } from 'react';
import { clsx } from 'clsx';

interface AddTodoFormProps {
  onAddTodo: (text: string, dueDate: string | null, tags: string[]) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setHasError(true);
      setText('');
      return;
    }

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onAddTodo(trimmedText, dueDate || null, tags);
    setText('');
    setDueDate('');
    setTagsInput('');
    setHasError(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  const isInputEmpty = text.trim() === '';

  const inputClasses = clsx(
    "flex-grow p-2.5 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
    {
      "border-red-500": hasError,
      "border-gray-300 dark:border-gray-600": !hasError,
    }
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-start gap-2.5 mb-5">
      <div className="flex flex-grow gap-2.5 min-w-full sm:min-w-[400px]">
        <label htmlFor="add-todo-input" className="sr-only">Add new todo</label>
        <input
          id="add-todo-input"
          type="text"
          placeholder="Add a new todo"
          value={text}
          onChange={handleTextChange}
          className={inputClasses}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? 'add-todo-error' : undefined}
        />
        <label htmlFor="due-date-input" className="sr-only">Due Date</label>
        <input
          id="due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2.5 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <label htmlFor="tags-input" className="sr-only">Tags (comma-separated)</label>
        <input
          id="tags-input"
          type="text"
          placeholder="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="flex-grow p-2.5 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
      </div>
      <button 
        type="submit" 
        aria-label="Add todo" 
        disabled={isInputEmpty}
        className="px-4 py-2.5 bg-blue-600 text-white rounded-md cursor-pointer disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        Add
      </button>
      {hasError && <span id="add-todo-error" className="text-red-500 text-sm w-full mt-1">Todo cannot be empty</span>}
    </form>
  );
};

export default AddTodoForm;