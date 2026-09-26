import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders compound components correctly', () => {
    const { container, getByText } = render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );

    expect(getByText('Header')).toBeInTheDocument();
    expect(getByText('Body')).toBeInTheDocument();
    expect(getByText('Footer')).toBeInTheDocument();

    // Check nesting
    const cardRoot = container.firstChild as HTMLElement;
    expect(cardRoot.children.length).toBe(3);
  });

  it('applies variant class', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    expect(container.firstChild).toHaveClass(/outlined/);
  });

  it('applies hover modifier class', () => {
    const { container } = render(<Card isHoverable>Content</Card>);
    expect(container.firstChild).toHaveClass(/hoverable/);
  });
});
