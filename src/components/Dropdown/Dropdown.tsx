import React, { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './Dropdown.module.css';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  (
    { options, value: controlledValue, defaultValue, onChange, placeholder = 'Select...', disabled = false, label, error, className },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    
    const generatedId = useId();
    const labelId = `${generatedId}-label`;
    const listboxId = `${generatedId}-listbox`;

    const handleSelect = (newValue: string, optDisabled?: boolean) => {
      if (optDisabled) return;
      if (!isControlled) setUncontrolledValue(newValue);
      onChange?.(newValue);
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    };

    const handleListboxKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next].disabled) next++;
          return next < options.length ? next : prev;
        });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next].disabled) next--;
          return next >= 0 ? next : prev;
        });
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value, options[focusedIndex].disabled);
        }
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && listboxRef.current && focusedIndex >= 0) {
        const optionEl = listboxRef.current.children[focusedIndex] as HTMLElement;
        if (optionEl) optionEl.scrollIntoView({ block: 'nearest' });
      }
    }, [isOpen, focusedIndex]);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className={`${styles.container} ${className || ''}`} ref={containerRef}>
        {label && (
          <label id={labelId} className={styles.label}>
            {label}
          </label>
        )}
        
        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? labelId : undefined}
          className={`${styles.trigger} ${error ? styles.error : ''}`}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) {
                const currentIndex = options.findIndex((opt) => opt.value === value);
                setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
              }
            }
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className={styles.triggerValue}>
            {selectedOption ? selectedOption.label : <span className={styles.placeholder}>{placeholder}</span>}
          </span>
          <span className={styles.icon}>▼</span>
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? labelId : undefined}
            className={styles.listbox}
            onKeyDown={handleListboxKeyDown}
            autoFocus // autoFocus to catch key events on the listbox container
          >
            {options.map((opt, index) => {
              const isSelected = opt.value === value;
              const isFocused = index === focusedIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  className={`${styles.option} ${isSelected ? styles.selected : ''} ${
                    isFocused ? styles.focused : ''
                  } ${opt.disabled ? styles.disabledOption : ''}`}
                  onClick={() => handleSelect(opt.value, opt.disabled)}
                  onMouseEnter={() => !opt.disabled && setFocusedIndex(index)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}

        {error && <div className={styles.errorText}>{error}</div>}
      </div>
    );
  }
);
Dropdown.displayName = 'Dropdown';
