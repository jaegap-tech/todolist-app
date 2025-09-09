import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodoForm from './AddTodoForm';
import { describe, it, expect, vi } from 'vitest';

describe('AddTodoForm', () => {
  it('renders correctly', () => {
    render(<AddTodoForm onAddTodo={() => {}} />);
    expect(screen.getByPlaceholderText('Add a new todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAddTodo with the input value when submitted', () => {
    const handleAddTodo = vi.fn();
    render(<AddTodoForm onAddTodo={handleAddTodo} />);

    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Test Todo' } });
    fireEvent.click(button);

    expect(handleAddTodo).toHaveBeenCalledTimes(1);
    expect(handleAddTodo).toHaveBeenCalledWith('New Test Todo');
    expect(input).toHaveValue(''); // Input should be cleared
  });

  it('does not call onAddTodo if input is empty', () => {
    const handleAddTodo = vi.fn();
    render(<AddTodoForm onAddTodo={handleAddTodo} />);

    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.click(button); // Click without typing

    expect(handleAddTodo).not.toHaveBeenCalled();
  });

  it('does not call onAddTodo if input is only whitespace', () => {
    const handleAddTodo = vi.fn();
    render(<AddTodoForm onAddTodo={handleAddTodo} />);

    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(handleAddTodo).not.toHaveBeenCalled();
    expect(input).toHaveValue(''); // Input should be cleared
  });

  it('displays an error message when input is empty on submit', () => {
    render(<AddTodoForm onAddTodo={() => {}} />);
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.click(button);

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('displays an error message when input is only whitespace on submit', () => {
    render(<AddTodoForm onAddTodo={() => {}} />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('hides the error message when user starts typing after an error', () => {
    render(<AddTodoForm onAddTodo={() => {}} />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    // Trigger error
    fireEvent.click(button);
    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();

    // Start typing
    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.queryByText('Todo cannot be empty')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
