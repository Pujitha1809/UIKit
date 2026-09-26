import React, { createContext, useContext, useState, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './Accordion.module.css';

interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string[];
  onValueChange: (value: string) => void;
  collapsible: boolean;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);
const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within Accordion');
  return context;
};

interface AccordionItemContextValue {
  value: string;
}
const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);
const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('Accordion sub-components must be used within Accordion.Item');
  return context;
};

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      value: controlledValue,
      defaultValue,
      onValueChange,
      collapsible = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => {
      if (defaultValue) return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      return [];
    });

    const isControlled = controlledValue !== undefined;
    const value = isControlled
      ? (Array.isArray(controlledValue) ? controlledValue : (controlledValue ? [controlledValue] : []))
      : uncontrolledValue;

    const handleValueChange = (itemValue: string) => {
      let newValue: string[];
      if (type === 'single') {
        if (value.includes(itemValue)) {
          newValue = collapsible ? [] : value;
        } else {
          newValue = [itemValue];
        }
      } else {
        if (value.includes(itemValue)) {
          newValue = value.filter((v) => v !== itemValue);
        } else {
          newValue = [...value, itemValue];
        }
      }

      if (!isControlled) setUncontrolledValue(newValue);
      
      if (onValueChange) {
        if (type === 'single') onValueChange(newValue[0] || '');
        else onValueChange(newValue);
      }
    };

    const baseId = useId();
    const rootRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (!rootRef.current) return;
      const headers = Array.from(rootRef.current.querySelectorAll('[data-accordion-header]')) as HTMLElement[];
      const currentIndex = headers.findIndex((h) => h === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % headers.length;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + headers.length) % headers.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIndex = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIndex = headers.length - 1;
        e.preventDefault();
      }

      if (nextIndex !== currentIndex) {
        headers[nextIndex].focus();
      }
    };

    return (
      <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange, collapsible, baseId }}>
        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={`${styles.accordion} ${className || ''}`}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
AccordionRoot.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={{ value }}>
        <div ref={ref} className={`${styles.item} ${className || ''}`} {...props}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'Accordion.Item';

export interface AccordionHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const AccordionHeader = React.forwardRef<HTMLButtonElement, AccordionHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { value: selectedValues, onValueChange, baseId } = useAccordionContext();
    const { value } = useAccordionItemContext();
    
    const isExpanded = selectedValues.includes(value);
    const headerId = `${baseId}-header-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    return (
      <h3 className={styles.headerContainer}>
        <button
          ref={ref}
          id={headerId}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          data-accordion-header
          className={`${styles.header} ${className || ''}`}
          onClick={() => onValueChange(value)}
          {...props}
        >
          {children}
          <span className={styles.icon} aria-hidden="true" data-expanded={isExpanded}>
            ▼
          </span>
        </button>
      </h3>
    );
  }
);
AccordionHeader.displayName = 'Accordion.Header';

export interface AccordionPanelProps extends React.HTMLAttributes<HTMLDivElement> {}
const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ children, className, ...props }, ref) => {
    const { value: selectedValues, baseId } = useAccordionContext();
    const { value } = useAccordionItemContext();
    
    const isExpanded = selectedValues.includes(value);
    const headerId = `${baseId}-header-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    return (
      <div
        ref={ref}
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        data-state={isExpanded ? 'open' : 'closed'}
        className={`${styles.panelWrapper} ${className || ''}`}
        {...props}
      >
        <div className={styles.panelContent}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionPanel.displayName = 'Accordion.Panel';

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Panel: AccordionPanel,
});
