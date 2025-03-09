import { Button, PasswordField, SelectBox, TextField, Topbar } from '@/components/shared';
import { RadioButtonGroup } from '@/components/shared/radio/RadioButtonGroup';
import { BIRTH_DAY_OPTIONS, BIRTH_MONTH_OPTIONS, BIRTH_YEAR_OPTIONS, NATIONALITIES } from '@/constants';
import { useSignup, useSignupForm, useUserIdDuplicateCheck } from '@/hooks';
import { Label } from '@/components/shared/label/Label';
import { useSignupStore } from '@/store';
import { SignupFormData } from '@/types';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function SignupFormPage() {
  const { email } = useSignupStore();
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

  const isSubmitDisabled = isLoading || !isValid || !!userIdError;

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
      navigate('/');
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
              <TextField id="firstName" label="First name" {...field} error={errors.firstName?.message} />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextField id="lastName" label="Last name" {...field} error={errors.lastName?.message} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField id="email" label="Email" disabled={true} {...field} error={errors.email?.message} />
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
              />
            )}
          />
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <div className="w-full flex flex-col items-start mb-4">
                <Label id={'birthDate'} label={'Birth date'} />
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
                <Label id={'country'} label={'Nationality'} />
                <SelectBox
                  size="large"
                  label={'Select your nationality'}
                  value={field.value}
                  options={NATIONALITIES}
                  onChange={field.onChange}
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
                  { label: 'Male', value: 'M' },
                  { label: 'Female', value: 'F' },
                ]}
                value={field.value}
                onChange={field.onChange}
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
              />
            )}
          />
          <Button variant="solid" color="primary" className="w-full" disabled={isSubmitDisabled}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </>
  );
}
