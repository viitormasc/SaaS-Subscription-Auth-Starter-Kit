import React, { useState, useEffect, useRef } from 'react';

interface OTPInputProps {
  onVerify: (otp: string) => Promise<void>;
  onResendEmail?: (e: React.FormEvent) => void;
  error?: string | null;
  clearError?: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  onVerify,
  onResendEmail,
  error,
  clearError,
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [countdown, setCountdown] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && clearError) {
      const hasInput = otp.some((digit) => digit !== '');
      if (hasInput) {
        clearError();
      }
    }
  }, [otp, error, clearError]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Clear error when user types
    if (error && clearError) {
      clearError();
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Clear error on backspace or delete
    if ((e.key === 'Backspace' || e.key === 'Delete') && error && clearError) {
      clearError();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      // Clear error on paste
      if (error && clearError) {
        clearError();
      }

      const newOtp = [...otp];
      pasteData.split('').forEach((char, index) => {
        if (index < 4) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);

      // Focus the next empty input or last input
      const focusIndex = Math.min(pasteData.length, 3);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 4) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onVerify(otpValue);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = (e: React.FormEvent) => {
    if (countdown > 0) return;

    setCountdown(60);
    // Clear any existing errors when resending
    if (error && clearError) {
      clearError();
    }
    if (onResendEmail) onResendEmail(e);
  };

  const isOtpComplete = otp.join('').length === 4;

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-card rounded-xl border border-border shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Enter Verification Code
        </h2>
        <p className="text-muted-foreground">
          We've sent a 4-digit code to your email
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Inputs */}
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                (inputRefs.current[index] = el)
                return undefined
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-14 h-14 text-center text-lg font-semibold bg-input border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-ring transition-all duration-200 text-foreground ${error ? 'border-destructive' : 'border-border'
                } ${error ? 'focus:border-destructive' : 'focus:border-primary'}`}
              disabled={isSubmitting}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center">
            <p className="text-destructive text-sm font-medium animate-in fade-in duration-200">
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isOtpComplete || isSubmitting}
          className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify Code'
          )}
        </button>

        {/* Resend Email Section */}
        <div className="text-center pt-4 border-t border-border">
          {countdown > 0 ? (
            <p className="text-muted-foreground">
              You can send another email in{' '}
              <span className="font-semibold text-foreground">
                {countdown} second{countdown !== 1 ? 's' : ''}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendEmail}
              className="text-primary hover:text-primary/90 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
            >
              Send another code
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OTPInput;
