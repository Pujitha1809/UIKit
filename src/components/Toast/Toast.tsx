import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let toastCount = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id || `toast-${++toastCount}`;
    setToasts((prev) => [...prev, { ...options, id, duration: options.duration ?? 4000 }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className={styles.viewport} role="region" aria-live="polite">
          {toasts.map((t) => (
            <ToastItem key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

interface ToastItemProps extends ToastOptions {
  id: string;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ title, description, variant = 'default', duration = 4000, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startRef = useRef<number>(Date.now());
  const remainingRef = useRef<number>(duration);

  const startTimer = useCallback(() => {
    if (duration === Infinity) return;
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, remainingRef.current);
  }, [duration, onDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      remainingRef.current -= Date.now() - startRef.current;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  useEffect(() => {
    if (isPaused) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isPaused, clearTimer, startTimer]);

  return (
    <div
      className={`${styles.toast} ${styles[variant]}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onDismiss}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};
