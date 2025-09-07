import React, { useState } from 'react';
import type { Todo } from '../types/todo';
import EditTodoForm from './EditTodoForm';
import ConfirmationDialog from './ConfirmationDialog'; // Import ConfirmationDialog

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State to manage confirmation dialog

  const handleSave = (id: number, newText: string) => {
    onUpdate(id, newText);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(todo.id);
    setShowConfirmDialog(false); // Hide dialog after confirming
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false); // Hide dialog on cancel
  };

  return (
    <li>
      {isEditing ? (
        <EditTodoForm todo={todo} onSave={handleSave} />
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => setShowConfirmDialog(true)}>Delete</button> {/* Show dialog on delete click */}
        </>
      )}

      {showConfirmDialog && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${todo.text}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </li>
  );
};

export default TodoItem;
