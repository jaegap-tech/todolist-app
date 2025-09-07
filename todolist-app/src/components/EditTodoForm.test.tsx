import { render, screen, fireEvent } from '@testing-library/react';
import EditTodoForm from './EditTodoForm';
import { describe, it, expect, vi } from 'vitest';
import type { Todo } from '../types/todo';

describe('EditTodoForm', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Initial Todo Text',
    completed: false,
  };

  it('renders correctly with initial todo text', () => {
    render(<EditTodoForm todo={mockTodo} onSave={() => {}} />);
    expect(screen.getByDisplayValue('Initial Todo Text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('calls onSave with the updated value when submitted', () => {
    const handleSave = vi.fn();
    render(<EditTodoForm todo={mockTodo} onSave={handleSave} />);

    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: 'Updated Todo Text' } });
    fireEvent.click(button);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(mockTodo.id, 'Updated Todo Text');
  });

  it('does not call onSave if input is empty', () => {
    const handleSave = vi.fn();
    render(<EditTodoForm todo={mockTodo} onSave={handleSave} />);

    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    expect(handleSave).not.toHaveBeenCalled();
  });

  it('does not call onSave if input is only whitespace', () => {
    const handleSave = vi.fn();
    render(<EditTodoForm todo={mockTodo} onSave={handleSave} />);

    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(handleSave).not.toHaveBeenCalled();
  });
});
