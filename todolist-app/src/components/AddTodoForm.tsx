import React, { useState } from 'react';
import styled from 'styled-components';

interface AddTodoFormProps {
  onAddTodo: (text: string, dueDate: string | null) => void;
}

const Form = styled.form`
  display: flex;
  flex-wrap: wrap; // Allow items to wrap
  gap: 10px;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-grow: 1; // Allow this container to grow
  gap: 10px;
  min-width: 250px; // Minimum width before wrapping
`;

const Input = styled.input<{ $hasError?: boolean }>`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid ${({ $hasError }) => ($hasError ? 'red' : '#ccc')};
  border-radius: 4px;
`;

const DateInput = styled(Input)`
  flex-grow: 0;
  min-width: 120px;
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
  const [dueDate, setDueDate] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setHasError(true);
      setText(''); // Clear input on invalid submission
      return;
    }

    onAddTodo(trimmedText, dueDate || null);
    setText('');
    setDueDate('');
    setHasError(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  const isInputEmpty = text.trim() === '';

  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <VisuallyHiddenLabel htmlFor="add-todo-input">Add new todo</VisuallyHiddenLabel>
        <Input
          id="add-todo-input"
          type="text"
          placeholder="Add a new todo"
          value={text}
          onChange={handleTextChange}
          $hasError={hasError}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? 'add-todo-error' : undefined}
        />
        <VisuallyHiddenLabel htmlFor="due-date-input">Due Date</VisuallyHiddenLabel>
        <DateInput
          id="due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </InputContainer>
      {hasError && <span id="add-todo-error" style={{ color: 'red', fontSize: '0.8em' }}>Todo cannot be empty</span>}
      <Button type="submit" aria-label="Add todo" disabled={isInputEmpty}>Add</Button>
    </Form>
  );
};

export default AddTodoForm;
