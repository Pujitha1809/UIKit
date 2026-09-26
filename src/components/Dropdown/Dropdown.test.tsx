import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from './Dropdown';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', disabled: true },
];

describe('Dropdown', () => {
  it('renders correctly', () => {
    render(<Dropdown options={options} placeholder="Select..." />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('toggles visibility on click', async () => {
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole('button');
    
    // Open
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Close
    await userEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects option on click', async () => {
    const handleChange = vi.fn();
    render(<Dropdown options={options} onChange={handleChange} />);
    
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('option', { name: 'Option 2' }));
    
    expect(handleChange).toHaveBeenCalledWith('2');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Closes after selection
  });

  it('handles keyboard navigation', async () => {
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole('button');
    
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    
    fireEvent.keyDown(listbox, { key: 'ArrowDown' }); // Focus option 1
    fireEvent.keyDown(listbox, { key: 'ArrowDown' }); // Focus option 2
    
    fireEvent.keyDown(listbox, { key: 'Enter' }); // Select option 2
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
  
  it('closes on escape', async () => {
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    
    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
