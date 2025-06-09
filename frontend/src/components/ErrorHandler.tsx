import React, { useEffect, useState } from "react";

interface ErrorHandlerProps {
  message: string | null;
  type: "error" | "success" | "warning" | "info";
  clearMessage: () => void;
  autoHide?: boolean;
  duration?: number;
  position?: "top" | "bottom";
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  message,
  type,
  clearMessage,
  autoHide = true,
  duration = 5000,
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setProgress(100);

      if (autoHide) {
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev - 100 / (duration / 100);
            return newProgress <= 0 ? 0 : newProgress;
          });
        }, 100);

        const hideTimeout = setTimeout(() => {
          setIsVisible(false);
          setTimeout(clearMessage, 300);
        }, duration);

        return () => {
          clearInterval(progressInterval);
          clearTimeout(hideTimeout);
        };
      }
    } else {
      setIsVisible(false);
    }
  }, [message, autoHide, duration, clearMessage]);

  if (!message) return null;

  const getAlertConfig = () => {
    switch (type) {
      case "error":
        return {
          className: "alert-danger",
          icon: "bi-exclamation-triangle-fill",
          title: "Error",
        };
      case "success":
        return {
          className: "alert-success",
          icon: "bi-check-circle-fill",
          title: "Success",
        };
      case "warning":
        return {
          className: "alert-warning",
          icon: "bi-exclamation-triangle-fill",
          title: "Warning",
        };
      case "info":
        return {
          className: "alert-info",
          icon: "bi-info-circle-fill",
          title: "Info",
        };
      default:
        return {
          className: "alert-primary",
          icon: "bi-info-circle-fill",
          title: "Notice",
        };
    }
  };

  const config = getAlertConfig();
  const positionClass = position === "top" ? "fixed-top" : "fixed-bottom";

  return (
    <div
      className={`alert ${config.className} alert-dismissible fade ${
        isVisible ? "show" : ""
      } ${position === "top" || position === "bottom" ? positionClass : ""}`}
      role="alert"
      style={{
        transition: "all 0.3s ease-in-out",
        zIndex: 1050,
        margin: position === "top" || position === "bottom" ? "1rem" : "0",
        position:
          position === "top" || position === "bottom" ? "fixed" : "relative",
        top: position === "top" ? "1rem" : "auto",
        bottom: position === "bottom" ? "1rem" : "auto",
        left: position === "top" || position === "bottom" ? "1rem" : "auto",
        right: position === "top" || position === "bottom" ? "1rem" : "auto",
      }}
    >
      <div className="d-flex align-items-start">
        <i
          className={`bi ${config.icon} me-2 flex-shrink-0`}
          style={{ fontSize: "1.2rem" }}
        ></i>
        <div className="flex-grow-1">
          <div className="fw-bold mb-1">{config.title}</div>
          <div>{message}</div>
        </div>
        <button
          type="button"
          className="btn-close ms-2"
          onClick={() => {
            setIsVisible(false);
            setTimeout(clearMessage, 300);
          }}
          aria-label="Close"
        ></button>
      </div>

      {autoHide && (
        <div
          className="progress mt-2"
          style={{ height: "3px", backgroundColor: "rgba(255,255,255,0.3)" }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${progress}%`,
              transition: "width 0.1s linear",
              backgroundColor:
                type === "error"
                  ? "#dc3545"
                  : type === "success"
                  ? "#198754"
                  : type === "warning"
                  ? "#fd7e14"
                  : "#0d6efd",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ErrorHandler;
