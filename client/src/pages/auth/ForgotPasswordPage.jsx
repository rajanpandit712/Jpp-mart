import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true); setError('');
    try { await authService.forgotPassword(email); setSent(true); }
    catch (e) { setError(e.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 p-2.5 rounded-2xl bg-[#0c1626] shadow-md border border-gray-800 hover:scale-105 transition-transform">
            <img src="/jpp-mart-logo.jpg" alt="JPP Mart" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Forgot password?</h1>
          <p className="text-text-muted text-sm mt-1">Enter your email and we'll send a reset link.</p>
        </div>
        <div className="card card-body">
          {sent ? (
            <Alert type="success" message="Reset link sent! Check your inbox (and spam folder)." />
          ) : (
            <>
              {error && <Alert type="error" message={error} className="mb-4" />}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="fp-email" className="label label-required">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input id="fp-email" type="email" className={`input pl-9 ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com"
                      {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } })} />
                  </div>
                  {errors.email && <p className="field-error">{errors.email.message}</p>}
                </div>
                <Button type="submit" loading={loading} fullWidth>Send Reset Link</Button>
              </form>
            </>
          )}
          <div className="mt-4 text-center text-sm"><Link to="/login" className="text-primary-600 hover:text-primary-700">← Back to login</Link></div>
        </div>
      </div>
    </div>
  );
}