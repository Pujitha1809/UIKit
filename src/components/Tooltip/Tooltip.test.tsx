import { render, screen, act, fireEvent } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('displays on hover after delay', () => {
    render(
      <Tooltip content="Hello tooltip">
        <button>Trigger</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Trigger');
    fireEvent.mouseEnter(trigger);
    
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Hello tooltip')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-describedby');
  });

  it('displays on focus and hides on blur', () => {
    render(
      <Tooltip content="Focus tooltip">
        <button>Trigger</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Trigger');
    fireEvent.focus(trigger);
    
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    
    fireEvent.blur(trigger);
    act(() => { vi.advanceTimersByTime(100); });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('dismisses on Escape key', () => {
    render(
      <Tooltip content="Esc tooltip">
        <button>Trigger</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Trigger');
    fireEvent.focus(trigger);
    act(() => { vi.advanceTimersByTime(250); });
    
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
