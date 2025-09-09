import React, { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';
import styled from 'styled-components';

interface EditTodoFormProps {
  todo: Todo;
  onSave: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void; // Callback for saving
  onCancel: () => void; // Callback for canceling edit
}

const Form = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid ${({ $hasError, theme }) => ($hasError ? theme.error : theme.border)}; // Use theme.error and theme.border
  border-radius: 4px;
  background-color: ${({ theme }) => theme.cardBackground}; // Use theme.cardBackground
  color: ${({ theme }) => theme.text}; // Use theme.text
`;

const DateInput = styled(Input)`
  flex-grow: 0;
  min-width: 120px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.primary}; // Use theme.primary
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover}; // Use theme.primaryHover
  }
`;

const VisuallyHiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const EditTodoForm: React.FC<EditTodoFormProps> = ({ todo, onSave, onCancel }) => {
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState(todo.dueDate || '');
  const [tagsInput, setTagsInput] = useState(todo.tags.join(', ')); // New state for tags input
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

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== ''); // Parse tags

    setHasError(false);
    onSave(todo.id, trimmedText, dueDate || null, tags); // Pass tags
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

  return (
    <Form onSubmit={handleSubmit}>
      <VisuallyHiddenLabel htmlFor={`edit-todo-input-${todo.id}`}>Edit todo text</VisuallyHiddenLabel>
      <Input
        ref={inputRef}
        id={`edit-todo-input-${todo.id}`}
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        $hasError={hasError}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `edit-todo-error-${todo.id}` : undefined}
      />
      <VisuallyHiddenLabel htmlFor={`edit-due-date-input-${todo.id}`}>Edit due date</VisuallyHiddenLabel>
      <DateInput
        id={`edit-due-date-input-${todo.id}`}
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <VisuallyHiddenLabel htmlFor={`edit-tags-input-${todo.id}`}>Tags (comma-separated)</VisuallyHiddenLabel>
      <Input
        id={`edit-tags-input-${todo.id}`}
        type="text"
        placeholder="Tags (comma-separated)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {hasError && <span id={`edit-todo-error-${todo.id}`} style={{ color: 'red', fontSize: '0.8em' }}>Todo cannot be empty</span>} {/* Use theme.error for color */}
      <Button type="submit" aria-label={`Save changes for todo ${todo.id}`}>Save</Button>
    </Form>
  );
};

export default EditTodoForm;