import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditTodoForm from './EditTodoForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Todo } from '../types/todo';
import { ThemeProvider } from '../contexts/ThemeContext'; // Import ThemeProvider

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('EditTodoForm', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Initial Todo Text',
    status: 'todo', // Updated
    dueDate: null,
    tags: [],
  };

  const mockTodoWithDate: Todo = {
    id: 2,
    text: 'Todo With Date',
    status: 'todo', // Updated
    dueDate: '2025-12-31',
    tags: ['work', 'personal'],
  };

  it('renders correctly with initial todo text and no due date or tags', () => {
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByDisplayValue('Initial Todo Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit due date')).toHaveValue('');
    expect(screen.getByPlaceholderText('Tags (comma-separated)')).toHaveValue('');
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders correctly with initial todo text, a due date, and tags', () => {
    renderWithTheme(<EditTodoForm todo={mockTodoWithDate} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByDisplayValue('Todo With Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit due date')).toHaveValue('2025-12-31');
    expect(screen.getByPlaceholderText('Tags (comma-separated)')).toHaveValue('work, personal');
  });

  it('calls onSave with the updated values when submitted', () => {
    const handleSave = vi.fn();
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={handleSave} onCancel={() => {}} />);

    const input = screen.getByDisplayValue('Initial Todo Text');
    const dateInput = screen.getByLabelText('Edit due date');
    const tagsInput = screen.getByPlaceholderText('Tags (comma-separated)');
    const button = screen.getByRole('button', { name: /save/i });
    const newDueDate = '2026-01-01';
    const newTags = 'home, urgent';

    fireEvent.change(input, { target: { value: 'Updated Todo Text' } });
    fireEvent.change(dateInput, { target: { value: newDueDate } });
    fireEvent.change(tagsInput, { target: { value: newTags } });
    fireEvent.click(button);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(mockTodo.id, 'Updated Todo Text', newDueDate, ['home', 'urgent']);
  });

  it('does not call onSave if input is empty', () => {
    const handleSave = vi.fn();
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={handleSave} onCancel={() => {}} />);

    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    expect(handleSave).not.toHaveBeenCalled();
  });

  it('does not call onSave if input is only whitespace', () => {
    const handleSave = vi.fn();
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={handleSave} onCancel={() => {}} />);

    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(handleSave).not.toHaveBeenCalled();
  });

  it('displays an error message when input is empty on submit', () => {
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />);
    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('displays an error message when input is only whitespace on submit', () => {
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />);
    const input = screen.getByDisplayValue('Initial Todo Text');
    const button = screen.getByRole('button', { name: /save/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(screen.getByText('Todo cannot be empty')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Todo cannot be empty');
  });

  it('hides the error message when user starts typing after an error', () => {
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />);
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

  it('calls onCancel when Escape key is pressed', () => {
    const handleSave = vi.fn();
    const handleCancel = vi.fn();
    renderWithTheme(<EditTodoForm todo={mockTodo} onSave={handleSave} onCancel={handleCancel} />);

    const input = screen.getByDisplayValue('Initial Todo Text');

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleSave).not.toHaveBeenCalled();
  });
});
