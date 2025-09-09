import React from 'react';
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

  it('displays an error message when input is empty on submit', () => {
    render(<EditTodoForm todo={mockTodo} onSave={() => {}} />);
    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('displays an error message when input is only whitespace on submit', () => {
    render(<EditTodoForm todo={mockTodo} onSave={() => {}} />);
    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('hides the error message when user starts typing after an error', () => {
    render(<EditTodoForm todo={mockTodo} onSave={() => {}} />);
    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    // Trigger error
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);
    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();

    // Start typing
    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.queryByText('Todo cannot be empty')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
