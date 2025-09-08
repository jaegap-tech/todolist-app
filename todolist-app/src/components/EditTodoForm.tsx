import React, { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';
import styled from 'styled-components';

interface EditTodoFormProps {
  todo: Todo;
  onSave: (id: number, newText: string) => void; // Callback for saving
}

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input<{ $hasError: boolean }>`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid ${({ $hasError }) => ($hasError ? 'red' : '#ccc')};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
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

const EditTodoForm: React.FC<EditTodoFormProps> = ({ todo, onSave }) => {
  const [text, setText] = useState(todo.text);
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

    setHasError(false);
    console.log('Updated Todo:', todo.id, trimmedText);
    onSave(todo.id, trimmedText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
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
        $hasError={hasError}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `edit-todo-error-${todo.id}` : undefined}
      />
      {hasError && <span id={`edit-todo-error-${todo.id}`} style={{ color: 'red', fontSize: '0.8em' }}>Todo cannot be empty</span>}
      <Button type="submit" aria-label={`Save changes for todo ${todo.id}`}>Save</Button>
    </Form>
  );
};

export default EditTodoForm;
