import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const pwd = watch('password');

  const onSubmit = async ({ password }) => {
    setLoading(true); setError('');
    try { await authService.resetPassword({ token, password }); navigate('/login?reset=1'); }
    catch (e) { setError(e.response?.data?.message || 'Reset failed. The link may have expired.'); }
    finally { setLoading(false); }
  };

  if (!token) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center"><p className="text-error-600 mb-4">Invalid or missing reset token.</p><Link to="/forgot-password" className="btn-primary btn">Request new link</Link></div>
    </div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-2xl font-bold text-text-primary">Set new password</h1></div>
        <div className="card card-body">
          {error && <Alert type="error" message={error} className="mb-4" />}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="new-pwd" className="label label-required">New password</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="new-pwd" type="password" className={`input pl-9 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: true, minLength: { value: 8, message: 'Minimum 8 characters' } })} /></div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="conf-pwd" className="label label-required">Confirm password</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="conf-pwd" type="password" className={`input pl-9 ${errors.confirm ? 'input-error' : ''}`}
                  {...register('confirm', { validate: v => v === pwd || 'Passwords do not match' })} /></div>
              {errors.confirm && <p className="field-error">{errors.confirm.message}</p>}
            </div>
            <Button type="submit" loading={loading} fullWidth>Reset Password</Button>
          </form>
        </div>
      </div>
    </div>
  );
}