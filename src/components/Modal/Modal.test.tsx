import { render, screen, fireEvent } from '@testing-library/react';

import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <Modal.Header />
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders portal when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <Modal.Header />
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    // the overlay is the parent of the dialog
    const overlay = screen.getByRole('dialog').parentElement!;
    fireEvent.mouseDown(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('locks and unlocks body scroll', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
