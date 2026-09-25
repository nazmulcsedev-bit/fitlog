"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-center gap-3 rounded-md border border-line bg-panel2 px-4 py-3 text-sm text-white shadow-lg animate-[fadein_.2s_ease-out]"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
            <span className="flex-1 font-body">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-muted hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
