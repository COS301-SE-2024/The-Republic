import React from 'react';
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompactDropdown from '@/components/Dropdown/CompactDropdown';

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({
        user: { id: "user-id" },
        session: "session-token",
        error: null,
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

const mockOptions = {
  group: 'Test Group',
  items: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
};

describe('CompactDropdown', () => {
  it('renders correctly', () => {
    const onChange = jest.fn();
    render(<CompactDropdown options={mockOptions} value="" onChange={onChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays the selected option', () => {
    const onChange = jest.fn();
    render(<CompactDropdown options={mockOptions} value="option1" onChange={onChange} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');
  });

//   it('calls onChange when an option is selected', () => {
//     const onChange = jest.fn();
//     render(<CompactDropdown options={mockOptions} value="" onChange={onChange} />);
//     fireEvent.click(screen.getByRole('combobox'));
//     fireEvent.click(screen.getByText('Option 2'));
//     expect(onChange).toHaveBeenCalledWith('option2');
//   });

  it('displays placeholder when no option is selected', () => {
    const onChange = jest.fn();
    render(<CompactDropdown options={mockOptions} value="" onChange={onChange} placeholder="Select..." />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select...');
  });

  it('disables the dropdown when disabled prop is true', () => {
    const onChange = jest.fn();
    render(<CompactDropdown options={mockOptions} value="" onChange={onChange} disabled={true} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});