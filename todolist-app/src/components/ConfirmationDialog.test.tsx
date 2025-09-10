import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDialog from './ConfirmationDialog';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext'; // Import ThemeProvider

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ConfirmationDialog', () => {
  it('renders correctly with message and buttons', () => {
    renderWithTheme(
      <ConfirmationDialog
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();
    renderWithTheme(
      <ConfirmationDialog
        message="Are you sure?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();
    renderWithTheme(
      <ConfirmationDialog
        message="Are you sure?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleConfirm).not.toHaveBeenCalled();
  });
});