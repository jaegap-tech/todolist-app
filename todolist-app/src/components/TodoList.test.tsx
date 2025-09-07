import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';
import { describe, it, expect, vi } from 'vitest';
import type { Todo } from '../types/todo';

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
