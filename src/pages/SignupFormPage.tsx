import { Button, PasswordField, TextField, Topbar } from '@/components';
import { RadioButtonGroup } from '@/components/radio/RadioButtonGroup';
import { Select } from '@/components/select/Select';
import { Label } from '@/label/Label';
import { useSignupStore } from '@/store';
import { signupSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password: string;
  confirmPassword: string;
  birthDate: { year: string; month: string; day: string };
  nationality: string;
  gender: string;
}

export function SignupFormPage() {
  const { email } = useSignupStore();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: email,
      userId: '',
      password: '',
      confirmPassword: '',
      birthDate: { year: '', month: '', day: '' },
      nationality: '',
      gender: '',
    },
  });

  const handleClickBackButton = () => {
    navigate('/');
  };

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
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
            render={({ field }) => <TextField id="userId" label="User ID" {...field} error={errors.userId?.message} />}
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
                    options={Array.from({ length: 100 }, (_, i) => ({
                      label: `${2025 - i}`,
                      value: `${2025 - i}`,
                    }))}
                    onChange={(e) => field.onChange({ ...field.value, year: e.target.value })}
                    className="border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4"
                  />
                  <Select
                    name="birthMonth"
                    value={field.value.month}
                    options={Array.from({ length: 12 }, (_, i) => ({
                      label: `${i + 1}`,
                      value: `${i + 1}`,
                    }))}
                    onChange={(e) => field.onChange({ ...field.value, month: e.target.value })}
                    className="border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4"
                  />
                  <Select
                    name="birthDay"
                    value={field.value.day}
                    options={Array.from({ length: 31 }, (_, i) => ({
                      label: `${i + 1}`,
                      value: `${i + 1}`,
                    }))}
                    onChange={(e) => field.onChange({ ...field.value, day: e.target.value })}
                    className="border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4"
                  />
                </div>
              </div>
            )}
          />
          <Controller
            control={control}
            name="nationality"
            render={({ field }) => (
              <div className="w-full flex flex-col items-start mb-4">
                <Label id={'nationality'} label={'Nationality'} />
                <Select
                  name="nationality"
                  size="large"
                  value={field.value}
                  options={[
                    { label: 'Select your nationality', value: '' },
                    { label: 'South Korea', value: 'KR' },
                    { label: 'United States', value: 'US' },
                    { label: 'Japan', value: 'JP' },
                    { label: 'China', value: 'CN' },
                    { label: 'United Kingdom', value: 'GB' },
                    { label: 'Germany', value: 'DE' },
                    { label: 'France', value: 'FR' },
                    { label: 'India', value: 'IN' },
                    { label: 'Brazil', value: 'BR' },
                    { label: 'Australia', value: 'AU' },
                    { label: 'Canada', value: 'CA' },
                    { label: 'Italy', value: 'IT' },
                    { label: 'Mexico', value: 'MX' },
                    { label: 'Russia', value: 'RU' },
                    { label: 'Spain', value: 'ES' },
                    { label: 'Netherlands', value: 'NL' },
                    { label: 'Sweden', value: 'SE' },
                    { label: 'Switzerland', value: 'CH' },
                    { label: 'Turkey', value: 'TR' },
                  ]}
                  onChange={field.onChange}
                />
                {errors.nationality && <span>{errors.nationality.message}</span>}
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
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
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
          <Button variant="solid" color="primary" className="w-full">
            Create account
          </Button>
        </form>
      </div>
    </>
  );
}
