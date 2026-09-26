import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    expect(container.firstChild).toHaveClass(/success/);
  });

  it('conditionally renders a dot', () => {
    const { container } = render(<Badge dot>Active</Badge>);
    // find the dot by its aria-hidden attribute or class name
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });

  it('does not render dot when dot prop is false', () => {
    const { container } = render(<Badge>Active</Badge>);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).not.toBeInTheDocument();
  });
});
