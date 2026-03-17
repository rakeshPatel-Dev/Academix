// pages/admin/VerifyEmailModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_API_ENDPOINT;

const VerifyEmailModal = ({ isOpen, onClose, user, onVerificationSuccess }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('send'); // 'send' or 'verify'

  // Timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [expiryTime, setExpiryTime] = useState(null); // Store expiry time from backend

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

  // Reset timer when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(0);
      setCanResend(true);
      setExpiryTime(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle send verification
  const handleSendVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/admins/send-code`, { email });

      // Get expiry time from response (assuming backend returns expiry in seconds)
      // You can adjust this based on your backend response structure
      const expirySeconds = response.data?.expiresIn || 600; // Default to 10 minutes (300 seconds) if not provided

      setExpiryTime(expirySeconds);
      setTimeLeft(expirySeconds);
      setSuccess('Verification code sent to your email!');
      toast.success('Verification code sent to your email!');
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send verification code');
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/admins/verify-code`, {
        email,
        verificationCode
      });

      setSuccess('Email verified successfully!');
      toast.success('Email verified successfully!');

      // Call the success callback after a short delay
      setTimeout(() => {
        onVerificationSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid verification code');
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/admins/send-code`, { email });

      // Get new expiry time from response
      const expirySeconds = response.data?.expiresIn || 300;

      setExpiryTime(expirySeconds);
      setTimeLeft(expirySeconds);
      setSuccess('New verification code sent!');
      toast.success('New verification code sent!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend verification code');
      toast.error('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('send');
    setVerificationCode('');
    setError('');
    setSuccess('');
    setTimeLeft(0);
    setCanResend(true);
    setExpiryTime(null);
    onClose();
  };

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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Mail className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step === "send"
                ? "Verify Email Address"
                : "Enter Verification Code"}
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
          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {step === 'send' ? (
            <form onSubmit={handleSendVerification}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send a verification code to this email address
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
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          ) : (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('send');
                    setTimeLeft(0);
                    setCanResend(true);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      Resend available in <span className="font-mono font-medium text-yellow-600">{formatTime(timeLeft)}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Didn't receive the code? Please wait for the timer to expire
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading || !canResend}
                    className="text-sm text-yellow-600 hover:text-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Verification helps us ensure the security of your account and enables you to receive important notifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;