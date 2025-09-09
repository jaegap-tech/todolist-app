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
  default: vi.fn(({ todo, onSave, onCancel }) => (
    <form data-testid="mock-edit-todo-form" onKeyDown={(e) => {if(e.key === 'Escape') onCancel()}}>
      <input type="text" value={todo.text} onChange={() => {}} />
      <input type="date" value={todo.dueDate || ''} onChange={() => {}} />
      <input type="text" value={todo.tags.join(', ')} onChange={() => {}} />
      <button onClick={() => onSave(todo.id, 'Updated Text', todo.dueDate, todo.tags)}>Mock Save</button>
    </form>
  )),
}));

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
    dueDate: null,
    tags: [],
  };

  const mockTodoWithDate: Todo = {
    id: 2,
    text: 'Test Todo with Date',
    completed: false,
    dueDate: '2025-12-31',
    tags: ['work', 'urgent'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('renders due date when it exists', () => {
    render(
      <TodoItem
        todo={mockTodoWithDate}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.getByText(`Due: ${mockTodoWithDate.dueDate}`)).toBeInTheDocument();
  });

  it('does not render due date when it does not exist', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.queryByText(/due:/i)).not.toBeInTheDocument();
  });

  it('renders tags when they exist', () => {
    render(
      <TodoItem
        todo={mockTodoWithDate}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('does not render tags when they do not exist', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onDelete={() => {}}
        onToggle={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.queryByText(/work/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/urgent/i)).not.toBeInTheDocument();
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
    expect(screen.getByTestId('mock-edit-todo-form')).toBeInTheDocument();
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
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
    expect(screen.getByTestId('mock-confirmation-dialog')).toBeInTheDocument();
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

    await waitFor(() => {
      expect(screen.getByTestId('mock-confirmation-dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mock Confirm'));

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onUpdate with the correct values when edit is saved', async () => {
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

    await waitFor(() => {
      expect(screen.getByTestId('mock-edit-todo-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mock Save'));

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate).toHaveBeenCalledWith(mockTodo.id, 'Updated Text', mockTodo.dueDate, mockTodo.tags);
  });
});