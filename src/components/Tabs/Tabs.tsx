import React, { createContext, useContext, useId, useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './Tabs.module.css';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within Tabs');
  return context;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** The controlled value of the active tab */
  value?: string;
  /** The uncontrolled default active tab */
  defaultValue?: string;
  /** Callback fired when the active tab changes */
  onValueChange?: (value: string) => void;
  /** The visual and interaction orientation of the tabs */
  orientation?: 'horizontal' | 'vertical';
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value: controlledValue, defaultValue, onValueChange, orientation = 'horizontal', children, className, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    
    const handleValueChange = (newValue: string) => {
      if (!isControlled) setUncontrolledValue(newValue);
      onValueChange?.(newValue);
    };

    const baseId = useId();

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange, orientation, baseId }}>
        <div 
          ref={ref} 
          className={`${styles.tabs} ${styles[orientation]} ${className || ''}`} 
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
TabsRoot.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => {
    const { orientation } = useTabsContext();
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const list = listRef.current;
      if (!list) return;

      const triggers = Array.from(list.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLElement[];
      const currentIndex = triggers.findIndex(t => t === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      const isHorizontal = orientation === 'horizontal';

      if (e.key === (isHorizontal ? 'ArrowRight' : 'ArrowDown')) {
        nextIndex = (currentIndex + 1) % triggers.length;
        e.preventDefault();
      } else if (e.key === (isHorizontal ? 'ArrowLeft' : 'ArrowUp')) {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIndex = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIndex = triggers.length - 1;
        e.preventDefault();
      }

      if (nextIndex !== currentIndex) {
        triggers[nextIndex].focus();
      }
    };

    return (
      <div
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="tablist"
        aria-orientation={orientation}
        className={`${styles.list} ${className || ''}`}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'Tabs.List';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value: tabValue, children, className, ...props }, ref) => {
    const { value, onValueChange, baseId } = useTabsContext();
    const isSelected = value === tabValue;
    const triggerId = `${baseId}-trigger-${tabValue}`;
    const panelId = `${baseId}-panel-${tabValue}`;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        id={triggerId}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        className={`${styles.trigger} ${className || ''}`}
        onClick={() => onValueChange(tabValue)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'Tabs.Trigger';

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value: panelValue, children, className, ...props }, ref) => {
    const { value, baseId } = useTabsContext();
    const isSelected = value === panelValue;
    const triggerId = `${baseId}-trigger-${panelValue}`;
    const panelId = `${baseId}-panel-${panelValue}`;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={`${styles.panel} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsPanel.displayName = 'Tabs.Panel';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
});
