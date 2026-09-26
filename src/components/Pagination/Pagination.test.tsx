import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders correctly', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles prev and next buttons', async () => {
    const handleChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={10} onPageChange={handleChange} />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
    expect(handleChange).toHaveBeenCalledWith(1);
    
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('disables prev on first page and next on last page', () => {
    const { rerender } = render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    
    rerender(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('sets aria-current on active page', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    const activePage = screen.getByRole('button', { name: 'Go to page 5' });
    expect(activePage).toHaveAttribute('aria-current', 'page');
  });

  it('renders ellipses correctly', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    const dots = screen.getAllByText('…');
    expect(dots.length).toBeGreaterThan(0);
  });
});
