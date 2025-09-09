import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoItem from './TodoItem';
import { describe, it, expect, vi } from 'vitest';
import type { Todo } from '../types/todo';

// Mock ConfirmationDialog to control its behavior
vi.mock('./ConfirmationDialog', () => ({
  default: vi.fn(({ message, onConfirm, onCancel }) => (
    <div data-testid="mock-confirmation-dialog">
      <p>{message}</p>
      <button onClick={onConfirm}>Mock Confirm</button>
      <button onClick={onCancel}>Mock Cancel</button>
    </div>
  )),
}));

// Mock EditTodoForm to control its behavior
vi.mock('./EditTodoForm', () => ({
  default: vi.fn(({ todo, onSave }) => (
    <form data-testid="mock-edit-todo-form">
      <input type="text" value={todo.text} onChange={() => {}} />
      <button onClick={() => onSave(todo.id, 'Updated Text')}>Mock Save</button>
    </form>
  )),
}));

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

  it('calls onDelete with the correct id when delete is confirmed', async () => {
    const handleDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={handleDelete}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    // Wait for the confirmation dialog to appear
    await waitFor(() => {
      expect(screen.getByTestId('mock-confirmation-dialog')).toBeInTheDocument();
    });

    // Click the confirm button in the dialog
    fireEvent.click(screen.getByText('Mock Confirm'));

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onUpdate with the correct id and new text when edit is saved', async () => {
    const handleUpdate = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={handleUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Wait for the edit form to appear
    await waitFor(() => {
      expect(screen.getByTestId('mock-edit-todo-form')).toBeInTheDocument();
    });

    // Click the save button in the form
    fireEvent.click(screen.getByText('Mock Save'));

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate).toHaveBeenCalledWith(mockTodo.id, 'Updated Text');
  });
});