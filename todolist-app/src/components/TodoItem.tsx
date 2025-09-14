import React, { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types/todo';
import EditTodoForm from './EditTodoForm';
import ConfirmationDialog from './ConfirmationDialog';
import { clsx } from 'clsx'; // A utility for constructing className strings conditionally

const statusMap: Record<'todo' | 'inProgress' | 'blocked' | 'done', { label: string; className: string }> = {
  todo: { label: '할 일', className: 'bg-gray-500' },
  inProgress: { label: '진행 중', className: 'bg-blue-500' },
  blocked: { label: '보류', className: 'bg-orange-500' },
  done: { label: '완료', className: 'bg-green-600' },
};

const tagColorClasses = [
  'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 
  'bg-teal-500', 'bg-cyan-500', 'bg-rose-500'
];

const getTagColorClass = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % tagColorClasses.length);
  return tagColorClasses[index];
};

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: 'todo' | 'inProgress' | 'blocked' | 'done') => void;
  onUpdate: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void;
  onToggleFlag: (id: number) => void; // Add this line
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onUpdateStatus, onUpdate, onToggleFlag }) => {
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

  const todoTextClasses = clsx(
    'break-all',
    {
      'line-through text-gray-500 dark:text-gray-400 opacity-60': todo.status === 'done',
      'text-gray-800 dark:text-gray-100': todo.status !== 'done',
    }
  );

  const starIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("h-6 w-6 cursor-pointer transition-colors duration-200", {
        'text-yellow-500 hover:text-yellow-600': todo.flagged,
        'text-gray-400 hover:text-gray-500': !todo.flagged,
      })}
      fill={todo.flagged ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={todo.flagged ? 0 : 2}
      onClick={() => onToggleFlag(todo.id)}
      data-testid={`star-icon-${todo.id}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.654.052.918.924.448 1.405l-4.118 3.986a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.03a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.118-3.986c-.47-.481-.206-1.353.448-1.405l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );

  return (
    <li className="flex items-center p-2.5">
      {isEditing ? (
        <EditTodoForm todo={todo} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <div className="relative mr-4" ref={popoverRef}>
            <button
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className={clsx(
                "px-3 py-1 text-sm font-medium text-white rounded-full w-20 text-center transition-transform transform hover:scale-105",
                statusMap[todo.status].className
              )}
            >
              {statusMap[todo.status].label}
            </button>
            {isPopoverOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 z-10 min-w-[110px]">
                {Object.keys(statusMap).map((statusKey) => {
                  const status = statusKey as keyof typeof statusMap;
                  if (status === todo.status) return null;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                      className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {statusMap[status].label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex-grow text-left">
            <p className={todoTextClasses}>
              {todo.text}
            </p>
            {todo.dueDate && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due: {todo.dueDate}</p>}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {todo.tags.map((tag, index) => (
                  <span key={index} className={clsx("px-2 py-0.5 text-xs text-white rounded-full", getTagColorClass(tag))}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {starIcon}
            <button onClick={() => setIsEditing(true)} aria-label={`Edit "${todo.text}"`} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Edit</button>
            <button onClick={() => setShowConfirmDialog(true)} aria-label={`Delete "${todo.text}"`} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div>
        </>
      )}
      {showConfirmDialog && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${todo.text}"?`}
          onConfirm={() => { onDelete(todo.id); setShowConfirmDialog(false); }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </li>
  );
};

export default TodoItem;