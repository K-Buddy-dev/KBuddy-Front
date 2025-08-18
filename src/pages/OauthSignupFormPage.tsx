import { Button, SelectBox, TextField, Topbar } from '@/components/shared';
import { RadioButtonGroup } from '@/components/shared/radio/RadioButtonGroup';
import { BIRTH_DAY_OPTIONS, BIRTH_MONTH_OPTIONS, BIRTH_YEAR_OPTIONS, NATIONALITIES } from '@/constants';
import { useOauthRegister, useSocialSignupForm, useUserIdDuplicateCheck } from '@/hooks';
import { Label } from '@/components/shared/label/Label';
import { useSocialStore } from '@/store';
import { SignupFormData } from '@/types';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const OauthSignupFormPage = () => {
  const { email, oAuthUid, oAuthCategory, socialStoreReset, firstName, lastName } = useSocialStore();

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetFrom,
  } = useSocialSignupForm(email, oAuthUid, oAuthCategory);
  const { oauthRegister, isLoading } = useOauthRegister();
  const { checkUserIdDuplicate, error: userIdError } = useUserIdDuplicateCheck();
  const handleClickBackButton = () => {
    navigate('/');
  };

  const onSubmit = async (data: SignupFormData) => {
    const sumbitData = {
      ...data,
      email: email,
      firstName: firstName || '',
      lastName: lastName || '',
      oAuthUid: String(oAuthUid),
      oAuthCategory: oAuthCategory,
    };
    await oauthRegister(sumbitData);
    socialStoreReset();
    navigate('/');
  };

  useEffect(() => {
    if (!email || !oAuthUid || !oAuthCategory) {
      navigate('/');
    }
    resetFrom({
      firstName,
      lastName,
      email: 'ross1222@naver.com',
      userId: '',
      birthDate: { year: '', month: '', day: '' },
      country: null,
      gender: null,
      oAuthUid: 1,
      oAuthCategory: 'KAKAO',
    });
  }, [email, oAuthUid, oAuthCategory, socialStoreReset]);

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
                <Label htmlFor={'birthDate'} label={'Birth date'} />
                <div className="w-full flex justify-between">
                  <SelectBox
                    label={'Year'}
                    value={field.value?.year ?? ''}
                    options={BIRTH_YEAR_OPTIONS}
                    onChange={(value) => field.onChange({ ...field.value, year: value || '' })}
                  />
                  <SelectBox
                    label={'Month'}
                    value={field.value?.month ?? ''}
                    options={BIRTH_MONTH_OPTIONS}
                    onChange={(value) => field.onChange({ ...field.value, month: value || '' })}
                  />
                  <SelectBox
                    label={'Day'}
                    value={field.value?.day ?? ''}
                    options={BIRTH_DAY_OPTIONS}
                    onChange={(value) => field.onChange({ ...field.value, day: value || '' })}
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
                  { label: 'Male', value: 'M' },
                  { label: 'Female', value: 'F' },
                ]}
                value={field.value ?? null}
                onChange={(val) => field.onChange(val || null)}
                error={errors.gender?.message}
              />
            )}
          />
          <Button
            variant="solid"
            color="primary"
            type="submit"
            className="w-full"
            disabled={isLoading || !isValid || !!userIdError}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </>
  );
};
