import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, children, className, ...props }, ref) => {
    const classNames = [
      styles.badge,
      styles[variant],
      styles[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {dot && <span className={styles.dot} aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
