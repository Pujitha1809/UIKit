import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      isLoading ? styles.loading : '',
      className,
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        aria-disabled={disabled || isLoading ? 'true' : undefined}
        aria-busy={isLoading ? 'true' : undefined}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.25" />
              <path
                strokeLinecap="round"
                strokeWidth="4"
                d="M12 2a10 10 0 0 1 10 10"
              />
            </svg>
          </span>
        )}
        <span className={styles.content} style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
