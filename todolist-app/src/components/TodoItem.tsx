import React, { useState } from 'react';
import type { Todo } from '../types/todo';
import EditTodoForm from './EditTodoForm';
import ConfirmationDialog from './ConfirmationDialog';
import styled from 'styled-components';
import { tagColors } from '../styles/themes'; // Import tagColors

// Helper function to get a consistent color for a tag
const getTagColor = (tag: string) => {
  const colors = Object.values(tagColors);
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void;
}

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 15px 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  transform: scale(1.2);
`;

const TodoTextContainer = styled.div`
  flex-grow: 1;
  text-align: left;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  color: ${({ $completed, theme }) => ($completed ? theme.completedText : theme.text)};
`;

const DueDate = styled.span`
  display: block;
  font-size: 0.8em;
  color: ${({ theme }) => theme.secondaryText};
  margin-top: 4px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const Tag = styled.span<{ $tagColor: string }>`
  background-color: ${({ $tagColor }) => $tagColor};
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7em;
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
    background-color: ${({ theme }) => theme.primaryHover};
  }

  &.delete-button {
    background-color: ${({ theme }) => theme.danger};
    &:hover {
      background-color: ${({ theme }) => theme.dangerHover};
    }
  }
`;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSave = (id: number, newText: string, newDueDate: string | null, newTags: string[]) => {
    onUpdate(id, newText, newDueDate, newTags);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
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
        <EditTodoForm todo={todo} onSave={handleSave} onCancel={handleCancelEdit} />
      ) : (
        <>
          <Checkbox
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <TodoTextContainer>
            <TodoText $completed={todo.completed}>
              {todo.text}
            </TodoText>
            {todo.dueDate && <DueDate>Due: {todo.dueDate}</DueDate>}
            {todo.tags && todo.tags.length > 0 && (
              <TagContainer>
                {todo.tags.map((tag, index) => (
                  <Tag key={index} $tagColor={getTagColor(tag)}>{tag}</Tag>
                ))}
              </TagContainer>
            )}
          </TodoTextContainer>
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
