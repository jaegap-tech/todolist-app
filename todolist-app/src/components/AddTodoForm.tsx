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

const Input = styled.input<{ hasError: boolean }>`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid ${({ hasError }) => (hasError ? 'red' : '#ccc')};
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

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false); // New state for error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setHasError(true); // Set error if empty
      return;
    }

    setHasError(false); // Clear error if valid
    onAddTodo(trimmedText);
    setText(''); // Clear input after successful submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) { // Clear error as user types
      setHasError(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Add a new todo"
        value={text}
        onChange={handleChange} // Use new handleChange
        hasError={hasError} // Pass hasError prop
      />
      <Button type="submit">Add</Button>
    </Form>
  );
};

export default AddTodoForm;
