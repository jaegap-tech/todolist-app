import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodoForm from './AddTodoForm';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext'; // Import ThemeProvider

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AddTodoForm', () => {
  it('renders correctly', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    expect(screen.getByPlaceholderText('Add a new todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tags (comma-separated)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAddTodo with the input value, due date, and tags when submitted', () => {
    const handleAddTodo = vi.fn();
    renderWithTheme(<AddTodoForm onAddTodo={handleAddTodo} />);

    const input = screen.getByPlaceholderText('Add a new todo');
    const dateInput = screen.getByLabelText('Due Date');
    const tagsInput = screen.getByPlaceholderText('Tags (comma-separated)');
    const button = screen.getByRole('button', { name: /add/i });
    const dueDate = '2025-12-31';
    const tags = 'work, personal';

    fireEvent.change(input, { target: { value: 'New Test Todo' } });
    fireEvent.change(dateInput, { target: { value: dueDate } });
    fireEvent.change(tagsInput, { target: { value: tags } });
    fireEvent.click(button);

    expect(handleAddTodo).toHaveBeenCalledTimes(1);
    expect(handleAddTodo).toHaveBeenCalledWith('New Test Todo', dueDate, ['work', 'personal']);
    expect(input).toHaveValue(''); // Input should be cleared
    expect(dateInput).toHaveValue(''); // Date input should be cleared
    expect(tagsInput).toHaveValue(''); // Tags input should be cleared
  });

  it('calls onAddTodo with null for due date and empty array for tags if not provided', () => {
    const handleAddTodo = vi.fn();
    renderWithTheme(<AddTodoForm onAddTodo={handleAddTodo} />);

    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Another Test Todo' } });
    fireEvent.click(button);

    expect(handleAddTodo).toHaveBeenCalledTimes(1);
    expect(handleAddTodo).toHaveBeenCalledWith('Another Test Todo', null, []);
  });

  it('does not call onAddTodo if input is empty', () => {
    const handleAddTodo = vi.fn();
    renderWithTheme(<AddTodoForm onAddTodo={handleAddTodo} />);

    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.click(button); // Click without typing

    expect(handleAddTodo).not.toHaveBeenCalled();
  });

  it('does not call onAddTodo if input is only whitespace', () => {
    const handleAddTodo = vi.fn();
    renderWithTheme(<AddTodoForm onAddTodo={handleAddTodo} />);

    const input = screen.getByPlaceholderText('Add a new todo');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '   ' } });
    if (form) {
        fireEvent.submit(form);
    }

    expect(handleAddTodo).not.toHaveBeenCalled();
    expect(input).toHaveValue(''); // Input should be cleared
  });

  it('displays an error message when input is empty on submit', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    const button = screen.getByRole('button', { name: /add/i });

    // The button is disabled, so we need to submit the form directly
    const form = button.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('displays an error message when input is only whitespace on submit', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '   ' } });

    // The button is disabled, so we need to submit the form directly
    const form = button.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByPlaceholderText('Add a new todo')).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('hides the error message when user starts typing after an error', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    // Trigger error by submitting the form
    const form = button.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();

    // Start typing
    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.queryByText('Todo cannot be empty')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('button is disabled if input is empty', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeDisabled();
  });

  it('button is enabled when input has text', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    expect(button).toBeEnabled();
  });

  it('button is disabled if input has only whitespace', () => {
    renderWithTheme(<AddTodoForm onAddTodo={() => {}} />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '   ' } });
    expect(button).toBeDisabled();
  });
});