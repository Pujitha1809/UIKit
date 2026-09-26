import React, { useState, useRef, useEffect, useId, cloneElement } from 'react';
import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  children: ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, placement = 'top', delay = 200, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [currentPlacement, setCurrentPlacement] = useState<TooltipPlacement>(placement);
  
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipId = useId();

  const handleShow = () => {
    clearTimeout(hideTimeout.current);
    showTimeout.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleHide = () => {
    clearTimeout(showTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setIsVisible(false);
    }, 50); // slight delay to prevent flicker if moving mouse directly to tooltip
  };

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      const offset = 8;
      let top = 0;
      let left = 0;
      let actualPlacement = placement;

      // Smart collision detection (basic)
      if (placement === 'top' && triggerRect.top - tooltipRect.height - offset < 0) {
        actualPlacement = 'bottom';
      } else if (placement === 'bottom' && triggerRect.bottom + tooltipRect.height + offset > window.innerHeight) {
        actualPlacement = 'top';
      } else if (placement === 'left' && triggerRect.left - tooltipRect.width - offset < 0) {
        actualPlacement = 'right';
      } else if (placement === 'right' && triggerRect.right + tooltipRect.width + offset > window.innerWidth) {
        actualPlacement = 'left';
      }

      switch (actualPlacement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - offset;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + offset;
          break;
      }

      setCoords({ top, left });
      setCurrentPlacement(actualPlacement);
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, placement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        clearTimeout(showTimeout.current);
      }
    };
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const trigger = cloneElement(children as any, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    onMouseEnter: (e: any) => {
      handleShow();
      (children as any).props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: any) => {
      handleHide();
      (children as any).props.onMouseLeave?.(e);
    },
    onFocus: (e: any) => {
      handleShow();
      (children as any).props.onFocus?.(e);
    },
    onBlur: (e: any) => {
      handleHide();
      (children as any).props.onBlur?.(e);
    },
    'aria-describedby': isVisible ? tooltipId : undefined,
  });

  return (
    <>
      {trigger}
      {isVisible && typeof document !== 'undefined' && createPortal(
        <div
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          className={`${styles.tooltip} ${styles[currentPlacement]}`}
          style={{ top: coords.top, left: coords.left }}
        >
          {content}
          <div className={styles.arrow} />
        </div>,
        document.body
      )}
    </>
  );
};
