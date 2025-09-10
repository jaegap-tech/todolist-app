import React, { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types/todo';
import EditTodoForm from './EditTodoForm';
import ConfirmationDialog from './ConfirmationDialog';
import styled from 'styled-components';
import { tagColors } from '../styles/themes';

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
  onUpdateStatus: (id: number, status: 'todo' | 'inProgress' | 'blocked' | 'done') => void;
  onUpdate: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void;
}

const ListItem = styled.li`
  display: flex;
  align-items: center; /* Changed back to center */
  padding: 15px 10px;
  position: relative;
`;

const statusMap: Record<'todo' | 'inProgress' | 'blocked' | 'done', { label: string; color: string }> = {
  todo: { label: '할 일', color: '#6b7280' },
  inProgress: { label: '진행 중', color: '#3b82f6' },
  blocked: { label: '보류', color: '#f97316' },
  done: { label: '완료', color: '#16a34a' },
};

const StatusContainer = styled.div`
  position: relative;
  margin-right: 15px;
`;

const StatusBadge = styled.button<{ $statusColor: string }>`
  padding: 4px 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 500;
  width: 80px;
  text-align: center;
  color: white;
  background-color: ${({ $statusColor }) => $statusColor};
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }
`;

const StatusPopover = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 5px;
  z-index: 10;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px; /* Add min-width */
`;

const PopoverItem = styled.button`
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  width: 100%;
  font-size: 0.9em;
  white-space: nowrap; /* Prevent text wrapping */

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const TodoTextContainer = styled.div`
  flex-grow: 1;
  text-align: left;
`;

const TodoText = styled.span<{ $status: 'todo' | 'inProgress' | 'blocked' | 'done' }>`
  text-decoration: ${({ $status }) => ($status === 'done' ? 'line-through' : 'none')};
  color: ${({ $status, theme }) => ($status === 'done' ? theme.completedText : theme.text)};
  opacity: ${({ $status }) => ($status === 'done' ? 0.6 : 1)};
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
  margin-left: auto;
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

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onUpdateStatus, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = (id: number, newText: string, newDueDate: string | null, newTags: string[]) => {
    onUpdate(id, newText, newDueDate, newTags);
    setIsEditing(false);
  };

  const handleStatusSelect = (status: 'todo' | 'inProgress' | 'blocked' | 'done') => {
    onUpdateStatus(todo.id, status);
    setIsPopoverOpen(false);
  };

  return (
    <ListItem>
      {isEditing ? (
        <EditTodoForm todo={todo} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <StatusContainer ref={popoverRef}>
            <StatusBadge
              $statusColor={statusMap[todo.status].color}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              {statusMap[todo.status].label}
            </StatusBadge>
            {isPopoverOpen && (
              <StatusPopover>
                {Object.keys(statusMap).map((statusKey) => {
                  const status = statusKey as keyof typeof statusMap;
                  if (status === todo.status) return null; // Don't show current status in popover
                  return (
                    <PopoverItem
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {statusMap[status].label}
                    </PopoverItem>
                  );
                })}
              </StatusPopover>
            )}
          </StatusContainer>
          <TodoTextContainer>
            <TodoText $status={todo.status}>
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
            <Button onClick={() => setIsEditing(true)} aria-label={`Edit \"${todo.text}\"`}>Edit</Button>
            <Button className="delete-button" onClick={() => setShowConfirmDialog(true)} aria-label={`Delete \"${todo.text}\"`}>Delete</Button>
          </ButtonGroup>
        </>
      )}

      {showConfirmDialog && (
        <ConfirmationDialog
          message={`Are you sure you want to delete \"${todo.text}\"?`}
          onConfirm={() => { onDelete(todo.id); setShowConfirmDialog(false); }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </ListItem>
  );
};

export default TodoItem;
