import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem';
import { describe, it, expect, vi } from 'vitest';
import type { Todo } from '../types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
  };

  it('renders correctly with todo text and checkbox', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('applies line-through style when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.getByText('Test Todo')).toHaveStyle('text-decoration: line-through');
  });

  it('calls onToggle when checkbox is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={handleToggle}
        onUpdate={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('shows EditTodoForm when Edit button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // Edit form input
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument(); // Edit form save button
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument(); // Original text should be hidden
  });

  it('shows ConfirmationDialog when Delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.getByText(`Are you sure you want to delete "${mockTodo.text}"?`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});