import React, { useState } from 'react';
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

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
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

const EditTodoForm: React.FC<EditTodoFormProps> = ({ todo, onSave }) => {
  const [text, setText] = useState(todo.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim(); // Trim the text
    if (!trimmedText) return; // Don't save empty todos

    console.log('Updated Todo:', todo.id, trimmedText);
    onSave(todo.id, trimmedText);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit">Save</Button>
    </Form>
  );
};

export default EditTodoForm;
