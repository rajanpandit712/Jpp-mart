import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const config = {
  success: {
    icon: CheckCircle,
    classes: 'bg-success-50 border-success-200 text-success-700',
    iconClass: 'text-success-500',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-error-50 border-error-200 text-error-700',
    iconClass: 'text-error-500',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-warning-50 border-warning-200 text-warning-700',
    iconClass: 'text-warning-500',
  },
  info: {
    icon: Info,
    classes: 'bg-primary-50 border-primary-200 text-primary-700',
    iconClass: 'text-primary-500',
  },
};

/**
 * Alert – accessible status message box.
 */
export default function Alert({ type = 'info', message, onDismiss, className = '' }) {
  if (!message) return null;
  const { icon: Icon, classes, iconClass } = config[type] || config.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border text-sm ${classes} ${className}`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconClass}`} aria-hidden="true" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
