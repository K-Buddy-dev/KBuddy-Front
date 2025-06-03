import { Button, InfoMessage, TextField, Toast, Topbar } from '@/components/shared';
import { Spinner } from '@/components/shared/spinner';
import { useEmailVerifyStateContext, useToast, useVerifyCode, useVerifyCodeForm } from '@/hooks';
import { authService } from '@/services';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

export function SignupVerifyPage() {
  const location = useLocation();
  const { email } = useEmailVerifyStateContext();
  const { toast, showToast, hideToast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useVerifyCodeForm();

  const { verifyCode, error, isLoading } = useVerifyCode();
  const navigate = useNavigate();

  // 새로운 페이지로 이동했을 때 코드 전송 메시지 표시
  useEffect(() => {
    const isFromEmailVerify = location.state?.from === '/signup';
    if (isFromEmailVerify) {
      showToast({
        message: 'Confirmation code resent.',
        type: 'success',
        duration: 3000,
      });
    }
  }, [location, showToast]);

  const handleClickBackButton = () => {
    navigate('/');
  };

  const reSendCode = () => {
    authService.sendCode({ email });
    showToast({
      message: 'Confirmation code resent.',
      type: 'success',
      duration: 3000,
    });
  };

  const onSubmit = async (data: { code: string }) => {
    try {
      await verifyCode({ email, code: data.code });
      navigate('/signup/form');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />}
      <form className="mt-[72px] flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
        <InfoMessage
          title="Enter the confirmation code"
          description={`Confirmation sent. To continue, check your email & enter the 6-digit code we sent to ${email}`}
        />
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <TextField id="code" type="text" label="Confirmation code" error={error} {...field} maxLength={6} />
          )}
        />
        <Button variant="solid" color="primary" type="submit" className="w-full mt-[184px]" disabled={!isValid}>
          {isLoading ? <Spinner color="primary" size="sm" /> : 'Next'}
        </Button>
        <span
          className="text-text-brand-default text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer mt-[13px]"
          onClick={reSendCode}
        >
          I didn't get the code
        </span>
      </form>
    </>
  );
}
