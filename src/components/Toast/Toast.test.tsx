import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from './Toast';

const TestComponent = () => {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Test Toast', duration: 1000 })}>
      Show Toast
    </button>
  );
};

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-live', 'polite');
  });

  it('auto-dismisses toast after duration', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });

  it('dismisses toast on close button click', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    const closeBtn = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });
});
