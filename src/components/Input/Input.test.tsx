import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly with label', () => {
    render(<Input label="Username" id="username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('allows user typing', async () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name');
    await userEvent.type(input, 'John Doe');
    expect(input).toHaveValue('John Doe');
  });

  it('shows helper text and links via aria-describedby', () => {
    render(<Input label="Email" helperText="Help text" />);
    const input = screen.getByLabelText('Email');
    const helper = screen.getByText('Help text');
    
    expect(helper).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  it('shows error message and sets aria-invalid', () => {
    render(<Input label="Email" errorMessage="Invalid email" />);
    const input = screen.getByLabelText('Email');
    const error = screen.getByRole('alert');
    
    expect(error).toHaveTextContent('Invalid email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('renders addons', () => {
    render(<Input leftAddon="https://" rightAddon=".com" />);
    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
  });
});
