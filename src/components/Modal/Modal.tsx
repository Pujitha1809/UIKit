import React, { useEffect, useRef, useId } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
}

const getFocusableElements = (element: HTMLElement) => {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};

const ModalRoot: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const headerId = useId();

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Focus first element or the modal itself
      if (modalRef.current) {
        const focusable = getFocusableElements(modalRef.current);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && closeOnEsc) {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusable = getFocusableElements(modalRef.current);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? headerId : undefined}
        tabIndex={-1}
        className={styles.modal}
        onKeyDown={handleKeyDown}
      >
        <ModalContext.Provider value={{ headerId, title, onClose }}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>,
    document.body
  );
};

interface ModalContextValue {
  headerId: string;
  title?: string;
  onClose: () => void;
}
const ModalContext = React.createContext<ModalContextValue | undefined>(undefined);

const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const ctx = React.useContext(ModalContext);
  return (
    <div className={`${styles.header} ${className || ''}`} {...props}>
      <h2 id={ctx?.headerId} className={styles.title}>
        {ctx?.title || children}
      </h2>
      <button type="button" className={styles.closeButton} onClick={ctx?.onClose} aria-label="Close modal">
        &times;
      </button>
    </div>
  );
};

const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`${styles.body} ${className || ''}`} {...props}>
    {children}
  </div>
);

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`${styles.footer} ${className || ''}`} {...props}>
    {children}
  </div>
);

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
