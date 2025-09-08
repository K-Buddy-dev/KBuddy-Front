import { Button, Label, PasswordField, RadioButtonGroup, SelectBox, TextField, Topbar } from '@/components/shared';
import { Spinner } from '@/components/shared/spinner';
import { BIRTH_DAY_OPTIONS, BIRTH_MONTH_OPTIONS, BIRTH_YEAR_OPTIONS, NATIONALITIES } from '@/constants';
import { useEmailVerifyStateContext, useSignup, useSignupForm, useUserIdDuplicateCheck } from '@/hooks';
import { SignupFormData } from '@/types';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function SignupFormPage() {
  const { email } = useEmailVerifyStateContext();
  const [agree, setAgree] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useSignupForm(email);
  const { signup, isLoading } = useSignup();
  const { checkUserIdDuplicate, error: userIdError } = useUserIdDuplicateCheck();
  const handleClickBackButton = () => {
    navigate('/');
  };

  const isSubmitDisabled = isLoading || !isValid || !!userIdError || !agree;

  const onUserIdBlur = (field: any) => {
    return async (e: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur();
      const userId = e.target.value;

      if (!userId) return;

      try {
        await checkUserIdDuplicate(userId);
        errors.userId = undefined;
      } catch (error: any) {
        errors.userId = error.message;
      }
    };
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      <div className="mt-[72px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <TextField id="firstName" label="First name" {...field} required error={errors.firstName?.message} />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextField id="lastName" label="Last name" {...field} required error={errors.lastName?.message} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField id="email" label="Email" disabled={true} {...field} required error={errors.email?.message} />
            )}
          />
          <Controller
            control={control}
            name="userId"
            render={({ field }) => (
              <TextField
                id="userId"
                label="User ID"
                {...field}
                error={errors.userId?.message || userIdError}
                onBlur={onUserIdBlur(field)}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <div className="w-full flex flex-col items-start mb-4">
                <Label htmlFor={'birthDate'} label={'Birth date'} />
                <div className="w-full flex justify-between">
                  <SelectBox
                    label={'Year'}
                    value={field.value.year}
                    options={BIRTH_YEAR_OPTIONS}
                    onChange={(value) => field.onChange({ ...field.value, year: value })}
                  />
                  <SelectBox
                    label={'Month'}
                    value={field.value.month}
                    options={BIRTH_MONTH_OPTIONS}
                    onChange={(value) => field.onChange({ ...field.value, month: value })}
                  />
                  <SelectBox
                    label={'Day'}
                    value={field.value.day}
                    options={BIRTH_DAY_OPTIONS}
                    onChange={(value) => field.onChange({ ...field.value, day: value })}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <div className="w-full flex flex-col items-start mb-4">
                <Label htmlFor={'country'} label={'Nationality'} />
                <SelectBox
                  size="large"
                  label={'Select your nationality'}
                  value={field.value ?? null}
                  options={NATIONALITIES}
                  onChange={(val) => field.onChange(val || null)}
                />
                {errors.country && <span>{errors.country.message}</span>}
              </div>
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RadioButtonGroup
                id="gender"
                label="Gender"
                options={[
                  { label: 'Prefer not to say', value: '' },
                  { label: 'Male', value: 'M' },
                  { label: 'Female', value: 'F' },
                ]}
                value={field.value ?? null}
                onChange={(val) => field.onChange(val || null)}
                error={errors.gender?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordField
                id="password"
                label="Password"
                {...field}
                error={errors.password?.message}
                showValidation={true}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                {...field}
                error={errors.confirmPassword?.message}
                showValidation={true}
                required
              />
            )}
          />
          <div className="flex flex-col items-start justify-center w-full mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
                className="w-5 h-5 border-gray-300 rounded focus:ring-primary-500"
                id="agreeTerms"
              />
              <label htmlFor="agreeTerms" className="text-primary-600 break-words max-w-prose ">
                I consent to the{' '}
                <a
                  href="https://pages.flycricket.io/wallpaper-106/privacy.html#google_vignette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  Terms and Conditions of Use
                </a>
              </label>
            </div>
            {!agree && <span className="text-red-500 text-sm">Please agree to the terms and conditions</span>}
          </div>
          <Button variant="solid" color="primary" type="submit" className="w-full" disabled={isSubmitDisabled}>
            {isLoading ? <Spinner color="primary" size="sm" /> : 'Create account'}
          </Button>
        </form>
      </div>
    </>
  );
}
