import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders correctly', () => {
    render(
      <Accordion>
        <Accordion.Item value="1">
          <Accordion.Header>Header 1</Accordion.Header>
          <Accordion.Panel><div>Content 1</div></Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    expect(screen.getByText('Header 1')).toBeInTheDocument();
  });

  it('single mode: expanding one collapses another', async () => {
    render(
      <Accordion type="single" defaultValue="1">
        <Accordion.Item value="1">
          <Accordion.Header>Header 1</Accordion.Header>
          <Accordion.Panel><div data-testid="p1">Content 1</div></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="2">
          <Accordion.Header>Header 2</Accordion.Header>
          <Accordion.Panel><div data-testid="p2">Content 2</div></Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );

    const btn1 = screen.getByRole('button', { name: /Header 1/i });
    const btn2 = screen.getByRole('button', { name: /Header 2/i });

    expect(btn1).toHaveAttribute('aria-expanded', 'true');
    expect(btn2).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(btn2);

    expect(btn1).toHaveAttribute('aria-expanded', 'false');
    expect(btn2).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode: allows multiple expanded', async () => {
    render(
      <Accordion type="multiple">
        <Accordion.Item value="1">
          <Accordion.Header>Header 1</Accordion.Header>
          <Accordion.Panel><div>Content 1</div></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="2">
          <Accordion.Header>Header 2</Accordion.Header>
          <Accordion.Panel><div>Content 2</div></Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );

    const btn1 = screen.getByRole('button', { name: /Header 1/i });
    const btn2 = screen.getByRole('button', { name: /Header 2/i });

    await userEvent.click(btn1);
    await userEvent.click(btn2);

    expect(btn1).toHaveAttribute('aria-expanded', 'true');
    expect(btn2).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles keyboard navigation', () => {
    render(
      <Accordion>
        <Accordion.Item value="1">
          <Accordion.Header>Header 1</Accordion.Header>
          <Accordion.Panel><div>Content 1</div></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="2">
          <Accordion.Header>Header 2</Accordion.Header>
          <Accordion.Panel><div>Content 2</div></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="3">
          <Accordion.Header>Header 3</Accordion.Header>
          <Accordion.Panel><div>Content 3</div></Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );

    const btn1 = screen.getByRole('button', { name: /Header 1/i });
    const btn2 = screen.getByRole('button', { name: /Header 2/i });
    const btn3 = screen.getByRole('button', { name: /Header 3/i });

    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    fireEvent.keyDown(btn1, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(btn2);

    fireEvent.keyDown(btn2, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(btn1);

    fireEvent.keyDown(btn1, { key: 'End' });
    expect(document.activeElement).toBe(btn3);

    fireEvent.keyDown(btn3, { key: 'Home' });
    expect(document.activeElement).toBe(btn1);
  });
});
