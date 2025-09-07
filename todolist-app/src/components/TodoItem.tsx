import React, { useState } from 'react';
import type { Todo } from '../types/todo';
import EditTodoForm from './EditTodoForm';
import ConfirmationDialog from './ConfirmationDialog';
import styled from 'styled-components';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
}

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  transform: scale(1.2);
`;

const TodoText = styled.span<{ completed: boolean }>`
  flex-grow: 1;
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  color: ${({ completed }) => (completed ? '#888' : '#333')};
`;

const ButtonGroup = styled.div`
  margin-left: auto; /* Pushes buttons to the right */
  display: flex;
  gap: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #007bff;
  }

  &.delete-button {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
`;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSave = (id: number, newText: string) => {
    onUpdate(id, newText);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(todo.id);
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <ListItem>
      {isEditing ? (
        <EditTodoForm todo={todo} onSave={handleSave} />
      ) : (
        <>
          <Checkbox
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <TodoText completed={todo.completed}>
            {todo.text}
          </TodoText>
          <ButtonGroup>
            <Button onClick={() => setIsEditing(true)} aria-label={`Edit "${todo.text}"`}>Edit</Button>
            <Button className="delete-button" onClick={() => setShowConfirmDialog(true)} aria-label={`Delete "${todo.text}"`}>Delete</Button>
          </ButtonGroup>
        </>
      )}

      {showConfirmDialog && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${todo.text}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </ListItem>
  );
};

export default TodoItem;