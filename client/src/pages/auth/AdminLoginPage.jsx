import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

export default function AdminLoginPage() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@jppmarket.com',
      password: 'AdminPassword123!',
    },
  });

  const onSubmit = async (data) => {
    clearError(); setLoading(true);
    const result = await login(data, 'admin');
    setLoading(false);
    if (result.success) navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3 hover:scale-105 transition-transform">
            <img src="/jpp-mart-logo.jpg" alt="JPP Mart" className="h-12 w-auto object-contain mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-blue-300 text-sm mt-1">Restricted to authorized personnel</p>
        </div>
        <div className="card card-body">
          {error && <Alert type="error" message={error} onDismiss={clearError} className="mb-4" />}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="adm-email" className="label label-required">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="adm-email" type="email" className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
                  {...register('email', { required: 'Email required' })} /></div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="adm-pwd" className="label label-required">Password</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="adm-pwd" type={showPwd?'text':'password'} className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: 'Password required' })} />
                <button type="button" onClick={()=>setShowPwd(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary" aria-label={showPwd?'Hide':'Show'}>
                  {showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div>
            </div>
            <Button id="admin-submit-btn" type="submit" loading={loading} fullWidth variant="navy">Sign In to Admin</Button>
          </form>
          <div className="mt-4 text-center text-xs text-text-muted"><Link to="/" className="text-text-secondary hover:text-primary-600">← Back to store</Link></div>
        </div>
      </div>
    </div>
  );
}