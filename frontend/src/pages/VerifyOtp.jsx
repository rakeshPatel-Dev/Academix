// pages/VerifyOtp.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle, ArrowLeft, CheckCircle, Loader, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, login, register, loading } = useAuth();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const state = location.state || {};
  const mode = state.mode;
  const email = state.email || '';
  const password = state.password || '';
  const registrationData = state.registrationData || null;

  const isMissingState = useMemo(() => {
    if (!mode || !email) {
      return true;
    }

    if (mode === 'login' && !password) {
      return true;
    }

    if (mode === 'register' && !registrationData) {
      return true;
    }

    return false;
  }, [mode, email, password, registrationData]);

  useEffect(() => {
    if (isMissingState) {
      toast.error('Please start the login or registration flow again.');
    }
  }, [isMissingState]);

  const runInitialRequestAgain = async () => {
    setLocalError('');

    if (mode === 'login') {
      const result = await login(email, password);

      if (!result?.success || !result.requiresOtp) {
        throw new Error(result?.error || 'Unable to resend the code');
      }

      toast.success(result.message || 'A new OTP has been sent.');
      return;
    }

    if (mode === 'register') {
      const result = await register({ ...registrationData, pendingToken: '' });

      if (!result?.success || !result.requiresOtp) {
        throw new Error(result?.error || 'Unable to resend the code');
      }

      toast.success(result.message || 'A new OTP has been sent.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setLocalError('Enter the 6-digit OTP sent to your email.');
      return;
    }

    setIsSubmitting(true);
    setLocalError('');

    try {
      const verificationResult = await verifyOtp(email, otp);

      if (!verificationResult?.success) {
        throw new Error(verificationResult?.error || 'OTP verification failed');
      }

      const pendingToken = verificationResult.pendingToken;

      if (!pendingToken) {
        throw new Error('Verification succeeded, but no pending token was returned.');
      }

      let authResult;

      if (mode === 'login') {
        authResult = await login(email, password, pendingToken);
      } else {
        authResult = await register({ ...registrationData, pendingToken });
      }

      if (!authResult?.success) {
        throw new Error(authResult?.error || 'Unable to complete sign in.');
      }

      toast.success(mode === 'login' ? 'Login successful.' : 'Registration successful.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'OTP verification failed';
      setLocalError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsSubmitting(true);
    setLocalError('');

    try {
      await runInitialRequestAgain();
    } catch (error) {
      const message = error.message || 'Failed to resend OTP';
      setLocalError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMissingState) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-linear-to-br from-slate-50 via-white to-cyan-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 shadow-xl">
            <Shield className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Verify your OTP</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg tracking-[0.35em] text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting || loading}
              />
            </div>

            {localError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{localError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading || otp.length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-3 font-medium text-white shadow-lg transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
              <span>{isSubmitting ? 'Verifying...' : 'Verify OTP'}</span>
            </button>

            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => navigate(mode === 'register' ? '/register' : '/login', { replace: true })}
                className="inline-flex items-center gap-2 font-medium text-gray-600 transition hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={isSubmitting || loading}
                className="inline-flex items-center gap-2 font-medium text-blue-600 transition hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" />
                Resend code
              </button>
            </div>

            <p className="text-center text-xs text-gray-500">
              If you close this page, you can restart the process from the{' '}
              <Link to={mode === 'register' ? '/register' : '/login'} className="font-medium text-blue-600 hover:text-blue-500">
                sign in form
              </Link>
              .
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;