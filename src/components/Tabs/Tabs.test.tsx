import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('renders default value', () => {
    render(
      <Tabs defaultValue="t1">
        <Tabs.List>
          <Tabs.Trigger value="t1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="t2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="t1">Panel 1</Tabs.Panel>
        <Tabs.Panel value="t2">Panel 2</Tabs.Panel>
      </Tabs>
    );

    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
  });

  it('switches tabs on click', async () => {
    render(
      <Tabs defaultValue="t1">
        <Tabs.List>
          <Tabs.Trigger value="t1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="t2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="t1">Panel 1</Tabs.Panel>
        <Tabs.Panel value="t2">Panel 2</Tabs.Panel>
      </Tabs>
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  it('supports controlled state', async () => {
    const handleValueChange = vi.fn();
    render(
      <Tabs value="t1" onValueChange={handleValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="t1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="t2">Tab 2</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(handleValueChange).toHaveBeenCalledWith('t2');
  });

  it('navigates with arrow keys (horizontal)', () => {
    render(
      <Tabs defaultValue="t1">
        <Tabs.List>
          <Tabs.Trigger value="t1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="t2">Tab 2</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );

    const tablist = screen.getByRole('tablist');
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

    tab1.focus();
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tab2);
    
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(tab1);
  });
});
