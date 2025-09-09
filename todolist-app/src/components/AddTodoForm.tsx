import React, { useState } from 'react';
import styled from 'styled-components';

interface AddTodoFormProps {
  onAddTodo: (text: string, dueDate: string | null, tags: string[]) => void;
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

  &:disabled {
    background-color: ${({ theme }) => theme.border}; // Use theme.border
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
  const [tagsInput, setTagsInput] = useState(''); // New state for tags input
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setHasError(true);
      setText(''); // Clear input on invalid submission
      return;
    }

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== ''); // Parse tags

    onAddTodo(trimmedText, dueDate || null, tags); // Pass tags
    setText('');
    setDueDate('');
    setTagsInput(''); // Clear tags input
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
        <VisuallyHiddenLabel htmlFor="tags-input">Tags (comma-separated)</VisuallyHiddenLabel>
        <Input
          id="tags-input"
          type="text"
          placeholder="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </InputContainer>
      {hasError && <span id="add-todo-error" style={{ color: 'red', fontSize: '0.8em' }}>Todo cannot be empty</span>} {/* Use theme.error for color */}
      <Button type="submit" aria-label="Add todo" disabled={isInputEmpty}>Add</Button>
    </Form>
  );
};

export default AddTodoForm;
