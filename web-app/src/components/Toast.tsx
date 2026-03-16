import { FC, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: string;
  onClose: () => void;
}

const Toast: FC<ToastProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>

      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
