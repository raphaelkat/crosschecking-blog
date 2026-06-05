import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const TOAST_DURATION = 3000; // 3 seconds

/**
 * useToast Hook
 * Manage toast notifications in the application
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration = TOAST_DURATION) => {
      const id = Date.now().toString();
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "success", duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "error", duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "info", duration),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "warning", duration),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}
