import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";

const ToastContext = createContext(null);

const toastIcons = {
  success: "bi-check-circle-fill",
  danger: "bi-x-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill"
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const sequence = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3500) => {
      if (!message) {
        return;
      }

      const id = ++sequence.current;
      const normalizedType = [
        "success",
        "danger",
        "warning",
        "info"
      ].includes(type)
        ? type
        : "info";

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type: normalizedType
        }
      ]);

      window.setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      showToast,
      success: (message, duration) =>
        showToast(message, "success", duration),
      error: (message, duration) =>
        showToast(message, "danger", duration),
      warning: (message, duration) =>
        showToast(message, "warning", duration),
      info: (message, duration) =>
        showToast(message, "info", duration)
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="skillforge-toast-stack"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`skillforge-toast toast-${toast.type}`}
            role="status"
          >
            <span className="skillforge-toast-icon">
              <i
                className={`bi ${toastIcons[toast.type]}`}
              ></i>
            </span>

            <p className="skillforge-toast-message mb-0">
              {toast.message}
            </p>

            <button
              type="button"
              className="skillforge-toast-close"
              aria-label="Close notification"
              onClick={() => dismissToast(toast.id)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}
