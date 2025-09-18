"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/src/lib/cn";

export type ToastVariant = "default" | "success" | "error";

export type ToastPayload = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export type ToastEntry = ToastPayload & {
  id: string;
};

type ToastContextValue = {
  push: (payload: ToastPayload) => string;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((payload: ToastPayload) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...payload }]);
    const timeout = setTimeout(() => remove(id), 4000);
    return () => {
      clearTimeout(timeout);
      remove(id);
    };
  }, [remove]);

  const value = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isMounted
        ? createPortal(
            <div className="fixed right-4 top-4 z-[9999] flex max-w-sm flex-col gap-3">
              {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => remove(toast.id)} />
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onDismiss }: { toast: ToastEntry; onDismiss: () => void }) {
  const variantClasses: Record<ToastVariant, string> = {
    default: "border border-[var(--border-default)] bg-white text-[var(--text-primary)]",
    success: "border border-green-200 bg-green-50 text-green-900",
    error: "border border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-4 py-3 shadow-md",
        variantClasses[toast.variant ?? "default"]
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex-1 space-y-1 text-left">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description ? (
          <p className="text-xs opacity-90">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="btn btn-ghost h-auto px-2 py-1 text-xs"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
