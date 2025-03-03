import { Button, PasswordField, TextField, Topbar } from '@/components';
import { RadioButtonGroup } from '@/components/radio/RadioButtonGroup';
import { Select } from '@/components/select/Select';
import { BIRTH_DAY_OPTIONS, BIRTH_MONTH_OPTIONS, BIRTH_YEAR_OPTIONS, NATIONALITIES } from '@/constants';
import { useSignup, useSignupForm, useUserIdDuplicateCheck } from '@/hooks';
import { Label } from '@/label/Label';
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

  const onSubmit = async (data: SignupFormData) => {
    await signup(data);
    navigate('/');
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
                onBlur={(e) => {
                  field.onBlur();
                  checkUserIdDuplicate(e.target.value);
                }}
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
                  <Select
                    name="birthYear"
                    value={field.value.year}
                    options={BIRTH_YEAR_OPTIONS}
                    onChange={(e) => field.onChange({ ...field.value, year: e.target.value })}
                    className="border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4"
                  />
                  <Select
                    name="birthMonth"
                    value={field.value.month}
                    options={BIRTH_MONTH_OPTIONS}
                    onChange={(e) => field.onChange({ ...field.value, month: e.target.value })}
                    className="border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4"
                  />
                  <Select
                    name="birthDay"
                    value={field.value.day}
                    options={BIRTH_DAY_OPTIONS}
                    onChange={(e) => field.onChange({ ...field.value, day: e.target.value })}
                    className="border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4"
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
                <Select
                  name="country"
                  size="large"
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
          <Button variant="solid" color="primary" className="w-full" disabled={isLoading || !isValid || !!userIdError}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </>
  );
}
