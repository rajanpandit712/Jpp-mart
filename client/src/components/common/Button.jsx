import { Loader2 } from 'lucide-react';

/**
 * Button – design-system button with loading state, variants, and sizes.
 */
export default function Button({
  children,
  variant = 'primary',   // 'primary' | 'secondary' | 'navy' | 'teal' | 'ghost' | 'danger' | 'outline'
  size    = 'md',        // 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  const variantMap = {
    primary:  'btn-primary',
    secondary:'btn-secondary',
    navy:     'btn-navy',
    teal:     'btn-teal',
    ghost:    'btn-ghost',
    danger:   'btn-danger',
    outline:  'btn bg-transparent text-primary-600 border-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500',
  };

  const sizeMap = {
    xs:   'text-xs px-2.5 py-1.5 gap-1',
    sm:   'text-sm px-3 py-2 gap-1.5',
    md:   'text-sm px-4 py-2.5 gap-2',
    lg:   'text-base px-6 py-3 gap-2',
    xl:   'text-lg px-8 py-4 gap-2.5',
    icon: 'p-2.5',
  };

  const variantCls = variantMap[variant] || variantMap.primary;
  const sizeCls    = sizeMap[size]    || sizeMap.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg border
        transition-all duration-150 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none select-none
        ${variantCls}
        ${sizeCls}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
      ) : null}

      {children && (
        <span className={size === 'icon' ? 'sr-only' : ''}>{children}</span>
      )}

      {!loading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
}
