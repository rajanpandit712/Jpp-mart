/**
 * Badge – small status/label pill.
 */
export default function Badge({ children, variant = 'gray', className = '' }) {
  const map = {
    primary: 'bg-primary-50  text-primary-700  border-primary-200',
    success: 'bg-success-50  text-success-700  border-success-200',
    warning: 'bg-warning-50  text-warning-700  border-warning-200',
    error:   'bg-error-50    text-error-700    border-error-200',
    teal:    'bg-teal-50     text-teal-700     border-teal-200',
    navy:    'bg-navy-50     text-navy-700     border-navy-200',
    gray:    'bg-surface-bg  text-text-secondary border-surface-border',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${map[variant] || map.gray} ${className}`}>
      {children}
    </span>
  );
}
