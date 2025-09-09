import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from './TodoList';
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
  default: vi.fn(({ todo, onSave, onCancel }) => (
    <form data-testid="mock-edit-todo-form" onKeyDown={(e) => {if(e.key === 'Escape') onCancel()}}>
      <input type="text" value={todo.text} onChange={() => {}} />
      <button onClick={() => onSave(todo.id, 'Updated Text')}>Mock Save</button>
    </form>
  )),
}));

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: 1, text: 'Todo 1', completed: false },
    { id: 2, text: 'Todo 2', completed: true },
    { id: 3, text: 'Todo 3', completed: false },
  ];

  const mockOnDelete = vi.fn();
  const mockOnToggle = vi.fn();
  const mockOnUpdate = vi.fn();

  it('renders the list of todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
      />
    );
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Todo 3')).toBeInTheDocument();
  });

  it('renders empty state message when there are no todos', () => {
    render(
      <TodoList
        todos={[]}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
      />
    );
    expect(screen.getByText('할 일을 추가해보세요')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('sorts completed todos to the bottom', () => {
    render(
      <TodoList
        todos={mockTodos}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
      />
    );
    const items = screen.getAllByRole('listitem');
    // Expect Todo 1 and Todo 3 (incomplete) to be before Todo 2 (completed)
    expect(items[0]).toHaveTextContent('Todo 1');
    expect(items[1]).toHaveTextContent('Todo 3');
    expect(items[2]).toHaveTextContent('Todo 2');
  });

  it('calls onDelete with the correct id when delete is confirmed', async () => {
    render(
      <TodoList
        todos={mockTodos}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]); // Click delete for Todo 1

    // Wait for the confirmation dialog to appear
    await waitFor(() => {
      expect(screen.getByTestId('mock-confirmation-dialog')).toBeInTheDocument();
    });

    // Click the confirm button in the dialog
    fireEvent.click(screen.getByText('Mock Confirm'));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodos[0].id); // Check if called with Todo 1's ID
  });

  it('calls onUpdate with the correct id and new text when edit is saved', async () => {
    render(
      <TodoList
        todos={mockTodos}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]); // Click edit for Todo 1

    // Wait for the edit form to appear
    await waitFor(() => {
      expect(screen.getByTestId('mock-edit-todo-form')).toBeInTheDocument();
    });

    // Click the save button in the form
    fireEvent.click(screen.getByText('Mock Save'));

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith(mockTodos[0].id, 'Updated Text'); // Check if called with Todo 1's ID and new text
  });

  it('passes correct props to TodoItem', () => {
    render(
      <TodoList
        todos={mockTodos}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
      />
    );
    const todo1Item = screen.getByText('Todo 1');
    const todo1Checkbox = todo1Item.previousSibling as HTMLInputElement; // Get the checkbox
    const todo1DeleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    const todo1EditButton = screen.getAllByRole('button', { name: /edit/i })[0];

    fireEvent.click(todo1Checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(1);

    fireEvent.click(todo1DeleteButton);
    // Confirmation dialog will appear, so onDelete is not called directly yet
    // This test only checks if the prop is passed, not the full delete flow

    fireEvent.click(todo1EditButton);
    // Edit form appears, so onUpdate is not called directly yet
  });
});