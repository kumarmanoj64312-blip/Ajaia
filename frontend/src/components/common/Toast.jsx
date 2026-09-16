import { createContext, useCallback, useContext, useState } from 'react';
import { IconCheck, IconAlert } from './icons.jsx';

const ToastContext = createContext(null);

let idCounter = 0;

const VARIANT_STYLES = {
  info: { wrap: 'bg-slate-900 text-white', icon: null },
  success: { wrap: 'bg-emerald-600 text-white', icon: IconCheck },
  error: { wrap: 'bg-red-600 text-white', icon: IconAlert },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, variant = 'info') => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const style = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              role="alert"
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium shadow-lg ${style.wrap}`}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
