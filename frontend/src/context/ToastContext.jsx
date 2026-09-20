import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toastSuccess = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const toastError = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const toastInfo = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, toastSuccess, toastError, toastInfo }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-600 text-white border-emerald-700',
            error: 'bg-rose-600 text-white border-rose-700',
            info: 'bg-slate-900 text-white border-slate-800',
          }[toast.type] || 'bg-slate-900 text-white';

          const IconComponent = {
            success: CheckCircle,
            error: AlertCircle,
            info: Info,
          }[toast.type] || Info;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${typeStyles}`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-lg hover:bg-white/20 transition flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
