import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoItem from './TodoItem';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Todo } from '../types/todo';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mocks
vi.mock('./ConfirmationDialog', () => ({
  default: vi.fn(({ onConfirm }) => <button onClick={onConfirm}>Mock Confirm</button>),
}));
vi.mock('./EditTodoForm', () => ({
  default: vi.fn(({ todo, onSave }) => <button onClick={() => onSave(todo.id, 'Updated Text', todo.dueDate, todo.tags)}>Mock Save</button>),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test Todo',
    status: 'todo',
    dueDate: null,
    tags: [],
    flagged: false,
  };

  const mockTodoFlagged: Todo = {
    id: 2,
    text: 'Flagged Todo',
    status: 'todo',
    dueDate: null,
    tags: [],
    flagged: true,
  };

  const mockTodoWithDate: Todo = {
    id: 3,
    text: 'Test Todo with Date',
    status: 'inProgress',
    dueDate: '2025-12-31',
    tags: ['work', 'urgent'],
    flagged: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with todo text and status badge', () => {
    renderWithTheme(
      <TodoItem todo={mockTodo} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    // The badge is a button with the status label
    expect(screen.getByRole('button', { name: '할 일' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onToggleFlag when the flag icon is clicked', () => {
    const handleToggleFlag = vi.fn();
    renderWithTheme(
      <TodoItem todo={mockTodo} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={handleToggleFlag} />
    );

    const flagIcon = screen.getByTestId(`flag-icon-${mockTodo.id}`);
    fireEvent.click(flagIcon);

    expect(handleToggleFlag).toHaveBeenCalledTimes(1);
    expect(handleToggleFlag).toHaveBeenCalledWith(mockTodo.id);
  });

  it('renders the flag icon with correct styles (not flagged)', () => {
    renderWithTheme(
      <TodoItem todo={mockTodo} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    const flagIcon = screen.getByTestId(`flag-icon-${mockTodo.id}`);
    // Check for the 'not flagged' color
    expect(flagIcon.getAttribute('fill')).toBe('none');
    expect(flagIcon.classList.contains('text-gray-400')).toBe(true);
  });

  it('renders the flag icon with correct styles (flagged)', () => {
    renderWithTheme(
      <TodoItem todo={mockTodoFlagged} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    const flagIcon = screen.getByTestId(`flag-icon-${mockTodoFlagged.id}`);
    // Check for the 'flagged' color
    expect(flagIcon.getAttribute('fill')).toBe('currentColor');
    expect(flagIcon.classList.contains('text-yellow-500')).toBe(true);
  });

  it('opens and closes status popover on badge click', async () => {
    renderWithTheme(
      <TodoItem todo={mockTodo} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    const statusBadge = screen.getByRole('button', { name: '할 일' });

    // Popover should not be visible initially
    expect(screen.queryByRole('button', { name: '진행 중' })).not.toBeInTheDocument();

    // Click to open popover
    fireEvent.click(statusBadge);
    
    // Popover should now be visible with other status options
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '진행 중' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '보류' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '완료' })).toBeInTheDocument();
    });

    // Click again to close
    fireEvent.click(statusBadge);
    await waitFor(() => {
        expect(screen.queryByRole('button', { name: '진행 중' })).not.toBeInTheDocument();
    });
  });

  it('closes popover on outside click', async () => {
    renderWithTheme(
      <TodoItem todo={mockTodo} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    const statusBadge = screen.getByRole('button', { name: '할 일' });

    // Open popover
    fireEvent.click(statusBadge);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '진행 중' })).toBeInTheDocument();
    });

    // Click outside the component
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '진행 중' })).not.toBeInTheDocument();
    });
  });

  it('calls onUpdateStatus when a new status is selected from popover', async () => {
    const handleUpdateStatus = vi.fn();
    renderWithTheme(
      <TodoItem todo={mockTodo} onDelete={() => {}} onUpdateStatus={handleUpdateStatus} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    const statusBadge = screen.getByRole('button', { name: '할 일' });

    // Open popover
    fireEvent.click(statusBadge);

    // Find and click the 'inProgress' button in the popover
    const inProgressButton = await screen.findByRole('button', { name: '진행 중' });
    fireEvent.click(inProgressButton);

    // Check if the handler was called correctly
    expect(handleUpdateStatus).toHaveBeenCalledTimes(1);
    expect(handleUpdateStatus).toHaveBeenCalledWith(mockTodo.id, 'inProgress');

    // Also check if the popover closed
    await waitFor(() => {
        expect(screen.queryByRole('button', { name: '진행 중' })).not.toBeInTheDocument();
    });
  });
  
  // Keep other tests as they are still valid
  it('renders due date when it exists', () => {
    renderWithTheme(
      <TodoItem todo={mockTodoWithDate} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    expect(screen.getByText(`Due: ${mockTodoWithDate.dueDate}`)).toBeInTheDocument();
  });

  it('renders tags when they exist', () => {
    renderWithTheme(
      <TodoItem todo={mockTodoWithDate} onDelete={() => {}} onUpdateStatus={() => {}} onUpdate={() => {}} onToggleFlag={() => {}} />
    );
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });
});