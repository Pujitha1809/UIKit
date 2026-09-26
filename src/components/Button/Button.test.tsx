import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when isLoading', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} isLoading>Click me</Button>);
    const button = screen.getByRole('button'); // name is hidden visually but maybe accessible
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sets aria-busy when isLoading', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('applies variant class', () => {
    const { container } = render(<Button variant="danger">Click me</Button>);
    expect(container.firstChild).toHaveClass(/danger/);
  });
});
