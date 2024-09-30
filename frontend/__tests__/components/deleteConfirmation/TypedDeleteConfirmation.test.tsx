import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypedDeleteConfirmation from '@/components/DeleteConfirmation/TypedDeleteConfirmation';

// Mock the UI components
jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }: any) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
}));

describe('TypedDeleteConfirmation', () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    itemName: 'Test Item',
    itemType: 'Organization',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<TypedDeleteConfirmation {...defaultProps} />);

    expect(screen.getByText('Delete Organization')).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('delete Test Item')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<TypedDeleteConfirmation {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Delete Organization')).not.toBeInTheDocument();
  });

  it('disables Delete button when input is incorrect', async () => {
    render(<TypedDeleteConfirmation {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText('delete Test Item'), 'incorrect input');
    expect(deleteButton).toBeDisabled();
  });

  it('enables Delete button when input is correct', async () => {
    render(<TypedDeleteConfirmation {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText('delete Test Item'), 'delete Test Item');
    expect(deleteButton).toBeEnabled();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<TypedDeleteConfirmation {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm when Delete button is clicked with correct input', async () => {
    render(<TypedDeleteConfirmation {...defaultProps} />);

    await userEvent.type(screen.getByPlaceholderText('delete Test Item'), 'delete Test Item');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('is case-insensitive for input matching', async () => {
    render(<TypedDeleteConfirmation {...defaultProps} />);

    await userEvent.type(screen.getByPlaceholderText('delete Test Item'), 'DELETE TEST ITEM');
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
  });

  it('resets input when closed and reopened', () => {
    const { rerender } = render(<TypedDeleteConfirmation {...defaultProps} />);

    const input = screen.getByPlaceholderText('delete Test Item');
    fireEvent.change(input, { target: { value: 'delete Test Item' } });
    expect(input).toHaveValue('delete Test Item');

    rerender(<TypedDeleteConfirmation {...defaultProps} isOpen={false} />);
    rerender(<TypedDeleteConfirmation {...defaultProps} isOpen={true} />);

   
  });
});