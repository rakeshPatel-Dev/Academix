// pages/admin/ForgotPasswordModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle, Loader, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}/admins/reset-password`;

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setverificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Timer states for resend
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step management
  const [step, setStep] = useState('email'); // 'email', 'code', 'newPassword'

  // Effect for countdown timer
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Reset all states when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEmail('');
    setverificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setTimeLeft(0);
    setCanResend(true);
    setStep('email');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    const minLength = 6;

    return {
      isValid: password.length >= minLength,
      errors: {
        length: password.length >= minLength,
      }
    };
  };

  // Handle send reset code
  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/send-code`, { email });

      // Get expiry time from response (default to 5 minutes)
      const expirySeconds = response.data?.expiresIn || 300;

      setTimeLeft(expirySeconds);
      setSuccess('Reset code sent to your email!');
      toast.success('Reset code sent to your email!');

      // Move to code verification step
      setTimeout(() => {
        setStep('code');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send reset code');
      toast.error('Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/verify-code`, {
        email,
        verificationCode
      });

      setSuccess('Code verified successfully!');
      toast.success('Code verified successfully!');

      // Move to new password step
      setTimeout(() => {
        setStep('newPassword');
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid reset code');
      toast.error('Invalid reset code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend reset code
  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/send-code`, { email });

      const expirySeconds = response.data?.expiresIn || 300;
      setTimeLeft(expirySeconds);
      setSuccess('New reset code sent!');
      toast.success('New reset code sent!');
      setverificationCode(''); // Clear previous code
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend code');
      toast.error('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}`, {
        email,
        verificationCode,
        newPassword
      });

      setSuccess('Password reset successfully!');
      toast.success('Password reset successfully!');

      // Close modal after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password');
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const PasswordStrengthIndicator = () => {
    const validation = validatePassword(newPassword);
    const requirements = [
      { key: 'length', text: 'At least 8 characters', met: validation.errors.length },
    ];

    const metCount = requirements.filter(r => r.met).length;
    const strength = (metCount / requirements.length) * 100;

    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength >= 80 ? 'bg-green-500' :
                strength >= 60 ? 'bg-yellow-500' :
                  strength >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {metCount}/{requirements.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {requirements.map((req) => (
            <div key={req.key} className="flex items-center gap-1 text-xs">
              {req.met ? (
                <CheckCircle size={12} className="text-green-500" />
              ) : (
                <AlertCircle size={12} className="text-gray-300" />
              )}
              <span className={req.met ? 'text-green-600' : 'text-gray-400'}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              {step === 'email' && <Mail className="w-5 h-5 text-red-600" />}
              {step === 'code' && <KeyRound className="w-5 h-5 text-red-600" />}
              {step === 'newPassword' && <Lock className="w-5 h-5 text-red-600" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step === 'email' && 'Forgot Password'}
              {step === 'code' && 'Enter Reset Code'}
              {step === 'newPassword' && 'Set New Password'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleSendCode}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send a password reset code to this email
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Code
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Code Verification */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reset Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setverificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Verify
                    </>
                  )}
                </button>
              </div>

              {/* Resend Section with Timer */}
              <div className="text-center">
                {!canResend && timeLeft > 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Resend available in <span className="font-mono font-medium text-red-600">{formatTime(timeLeft)}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Didn't receive the code? Please wait
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading || !canResend}
                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader size={14} className="animate-spin" />
                        Resending...
                      </span>
                    ) : (
                      "Didn't receive the code? Resend"
                    )}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && <PasswordStrengthIndicator />}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle size={12} />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} />
                        Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {step === 'email' && 'Enter your email to receive a password reset code'}
            {step === 'code' && 'Check your email for the 6-digit reset code'}
            {step === 'newPassword' && 'Create a strong password for your account'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;