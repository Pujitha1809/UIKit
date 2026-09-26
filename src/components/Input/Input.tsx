import React, { useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isInvalid = false,
      leftAddon,
      rightAddon,
      id: externalId,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    
    const invalid = isInvalid || !!errorMessage;
    const describedBy = [
      helperText ? helperId : null,
      errorMessage ? errorId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`${styles.wrapper} ${className || ''}`}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={`${styles.inputContainer} ${invalid ? styles.invalid : ''}`}>
          {leftAddon && <span className={styles.addon}>{leftAddon}</span>}
          
          <input
            ref={ref}
            id={id}
            className={styles.input}
            aria-invalid={invalid ? 'true' : undefined}
            aria-describedby={describedBy}
            {...props}
          />
          
          {rightAddon && <span className={styles.addon}>{rightAddon}</span>}
        </div>

        {errorMessage ? (
          <div id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </div>
        ) : helperText ? (
          <div id={helperId} className={styles.helperText}>
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
