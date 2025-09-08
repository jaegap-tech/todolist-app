import React, { useState } from 'react';
import styled from 'styled-components';

interface AddTodoFormProps {
  onAddTodo: (text: string) => void;
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

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    setText('');

    if (!trimmedText) {
      setHasError(true);
      return;
    }

    setHasError(false);
    onAddTodo(trimmedText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <VisuallyHiddenLabel htmlFor="add-todo-input">Add new todo</VisuallyHiddenLabel>
      <Input
        id="add-todo-input"
        type="text"
        placeholder="Add a new todo"
        value={text}
        onChange={handleChange}
        $hasError={hasError}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? 'add-todo-error' : undefined}
      />
      {hasError && <span id="add-todo-error" style={{ color: 'red', fontSize: '0.8em' }}>Todo cannot be empty</span>}
      <Button type="submit" aria-label="Add todo">Add</Button>
    </Form>
  );
};

export default AddTodoForm;
