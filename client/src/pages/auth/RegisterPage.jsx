import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const { register: registerUser, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const pwd = watch('password');

  const onSubmit = async (data) => {
    clearError();
    setLoading(true);
    const result = await registerUser({
      name:    data.name,
      email:   data.email,
      phone:   data.phone,
      password:data.password,
    }, 'customer');
    setLoading(false);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 p-2.5 rounded-2xl bg-[#0c1626] shadow-md border border-gray-800 hover:scale-105 transition-transform">
            <img src="/jpp-mart-logo.jpg" alt="JPP Mart" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-text-muted text-sm mt-1">Join millions of happy shoppers on JPP Mart</p>
        </div>

        <div className="card card-body">
          {error && <Alert type="error" message={error} onDismiss={clearError} className="mb-4" />}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label label-required">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input id="name" type="text" autoComplete="name"
                  className={`input pl-9 ${errors.name ? 'input-error' : ''}`}
                  placeholder="Your full name"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
              </div>
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label label-required">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input id="reg-email" type="email" autoComplete="email"
                  className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="label">Mobile number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input id="phone" type="tel" autoComplete="tel"
                  className={`input pl-9 ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+91 9800000000"
                  {...register('phone', {
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                  })}
                />
              </div>
              {errors.phone && <p className="field-error">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label label-required">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input id="reg-password" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                  className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Min 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase, and a number',
                    },
                  })}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label label-required">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input id="confirmPassword" type={showConf ? 'text' : 'password'} autoComplete="new-password"
                  className={`input pl-9 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: v => v === pwd || 'Passwords do not match',
                  })}
                />
                <button type="button" onClick={() => setShowConf(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  aria-label={showConf ? 'Hide confirmation' : 'Show confirmation'}>
                  {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" className="mt-0.5 rounded border-surface-border text-primary-600"
                {...register('terms', { required: 'You must agree to the terms' })}
              />
              <label htmlFor="terms" className="text-xs text-text-secondary">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="field-error -mt-2">{errors.terms.message}</p>}

            <Button type="submit" loading={loading} fullWidth size="lg" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </div>
          <div className="border-t border-surface-border mt-4 pt-4 text-center text-xs">
            <Link to="/seller/register" className="text-text-secondary hover:text-primary-600">
              Register as a Seller instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
