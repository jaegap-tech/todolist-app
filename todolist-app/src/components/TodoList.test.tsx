import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from './TodoList';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Todo } from '../types/todo';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock TodoItem to simplify testing TodoList
vi.mock('./TodoItem', () => ({
  default: ({ todo }: { todo: Todo }) => (
    <li data-testid="mock-todo-item">
      <span>{todo.text}</span>
      <span>{todo.status}</span>
    </li>
  ),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: 1, text: 'Todo 1', status: 'todo', dueDate: null, tags: [] },
    { id: 2, text: 'Todo 2', status: 'done', dueDate: '2025-12-31', tags: ['work'] },
    { id: 3, text: 'Todo 3', status: 'inProgress', dueDate: null, tags: [] },
    { id: 4, text: 'Todo 4', status: 'blocked', dueDate: null, tags: [] },
  ];

  const mockOnDelete = vi.fn();
  const mockOnUpdateStatus = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the list of todos', () => {
    renderWithTheme(
      <TodoList
        todos={mockTodos}
        onDelete={mockOnDelete}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdate={mockOnUpdate}
      />
    );
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Todo 3')).toBeInTheDocument();
    expect(screen.getByText('Todo 4')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-todo-item').length).toBe(4);
  });

  it('renders empty state message when there are no todos', () => {
    renderWithTheme(
      <TodoList
        todos={[]}
        onDelete={mockOnDelete}
        onUpdateStatus={mockOnUpdateStatus}
        onUpdate={mockOnUpdate}
      />
    );
    expect(screen.getByText('할 일을 추가해보세요')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-todo-item')).not.toBeInTheDocument();
  });
});
