import { useLocation } from 'react-router-dom';
import OTPInputComponent from '@/components/OTPInputComponent';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import { useSendRecoveryPasswordEmail } from '@/hooks/useSendRecoveryEmail';
import { useValidateRecoveryCode } from '@/hooks/useValidateRecoveryCode';
import { useResendRecoveryEmail } from '@/hooks/useResendRecoveryEmail';

export const RecoveryEmailPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const { mutate: sendRecoveryEmail, isPending } =
  //   useSendRecoveryPasswordEmail();

  const { mutate: verifyEmailCode, isPending: verifyPending } =
    useValidateRecoveryCode();

  const { mutate: reSendValidationEmail, isPending: emailPending } =
    useResendRecoveryEmail();

  if (location.state === null) {
    navigate('/');
    alert('no location');
    return;
  }
  const { email, captcha, id } = location.state;

  async function handleVerify(otpValue: string) {
    verifyEmailCode({
      email,
      validationCode: otpValue,
    });
  }
  async function handleResendEmail(e: React.FormEvent) {
    e.preventDefault();

    reSendValidationEmail({ email, captcha, id });
  }

  if (emailPending || verifyPending) return <Spinner open />;
  return (
    <div className="">
      <OTPInputComponent
        onVerify={handleVerify}
        onResendEmail={handleResendEmail}
      />
    </div>
  );
};
