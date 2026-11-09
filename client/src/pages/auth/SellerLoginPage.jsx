import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Store } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

export default function SellerLoginPage() {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    clearError(); setLoading(true);
    const result = await login(data, 'seller');
    setLoading(false);
    if (result.success) navigate('/seller/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 p-2.5 rounded-2xl bg-[#0c1626] shadow-md border border-gray-800 hover:scale-105 transition-transform">
            <img src="/jpp-mart-logo.jpg" alt="JPP Mart" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Seller Portal</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to your JPP Mart seller account</p>
        </div>
        <div className="card card-body">
          {error && <Alert type="error" message={error} onDismiss={clearError} className="mb-4" />}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="sel-email" className="label label-required">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="sel-email" type="email" className={`input pl-9 ${errors.email ? 'input-error' : ''}`} placeholder="seller@example.com"
                  {...register('email', { required: 'Email required' })} /></div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="sel-pwd" className="label label-required">Password</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input id="sel-pwd" type={showPwd?'text':'password'} className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: 'Password required' })} />
                <button type="button" onClick={()=>setShowPwd(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary" aria-label={showPwd?'Hide':'Show'}>
                  {showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>
            <Button type="submit" loading={loading} fullWidth variant="teal">Sign In as Seller</Button>
          </form>
          <div className="mt-4 text-center text-sm text-text-muted">New seller? <Link to="/seller/register" className="text-teal-700 font-semibold hover:text-teal-800">Register your store</Link></div>
          <div className="border-t border-surface-border mt-4 pt-4 text-center text-xs"><Link to="/login" className="text-text-secondary hover:text-primary-600">Customer login →</Link></div>
        </div>
      </div>
    </div>
  );
}