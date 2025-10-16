import OTPInputComponent from '@/components/OTPInputComponent';
import Spinner from '@/components/Spinner';
import { useSendVerificationEmail } from '@/hooks/useSendVerificationEmail';
import { useValidateSignUpCode } from '@/hooks/useValidateSignUpCode';
import { useLocation, useNavigate } from 'react-router-dom';

export const EmailValidationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: sendVerificationEmail, isPending } =
    useSendVerificationEmail();

  const { mutate: verifyEmailCode, isPending: verifyPending } =
    useValidateSignUpCode();


  if (location.state === null) {
    navigate('/');
    return;
  }
  const { password, confirmPassword, email, name, captcha } = location.state;
  async function handleVerify(otpValue: string) {
    verifyEmailCode({
      password,
      confirmPassword,
      email,
      name,
      captcha,
      validationCode: otpValue,
    });
  }

  function handleResendEmail(e: React.FormEvent) {
    e.preventDefault();

    sendVerificationEmail({ password, confirmPassword, email, name, captcha });
    if (isPending || verifyPending) return <Spinner open />;
  }
  return (
    <div className="">
      <OTPInputComponent
        onVerify={handleVerify}
        onResendEmail={handleResendEmail}
      />
    </div>
  );
};
