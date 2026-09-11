import { Button, SelectBox, TextField, Topbar } from '@/components/shared';
import { RadioButtonGroup } from '@/components/shared/radio/RadioButtonGroup';
import { Spinner } from '@/components/shared/spinner';
import { BIRTH_DAY_OPTIONS, BIRTH_MONTH_OPTIONS, BIRTH_YEAR_OPTIONS, NATIONALITIES } from '@/constants';
import { useOauthRegister, useSocialSignupForm, useUserIdDuplicateCheck } from '@/hooks';
import { Label } from '@/components/shared/label/Label';
import { useSocialStore } from '@/store';
import { SignupFormData } from '@/types';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const OauthSignupFormPage = () => {
  const { email, oAuthUid, oAuthCategory, socialStoreReset, firstName, lastName } = useSocialStore();
  const [agree, setAgree] = useState<boolean>(false);
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
    navigate('/login');
  };

  const onSubmit = async (data: SignupFormData) => {
    const sumbitData = {
      ...data,
      email: email,
      oAuthUid: String(oAuthUid),
      oAuthCategory: oAuthCategory,
    };
    await oauthRegister(sumbitData);
    socialStoreReset();
    navigate('/home');
  };

  useEffect(() => {
    if (!email || !oAuthUid || !oAuthCategory) {
      navigate('/login');
    }
    resetFrom({
      firstName,
      lastName,
      email,
      userId: '',
      birthDate: { year: '', month: '', day: '' },
      country: null,
      gender: null,
      oAuthUid,
      oAuthCategory,
    });
  }, [email, oAuthUid, oAuthCategory, socialStoreReset]);

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      <div className="mt-[72px] px-4 pb-28">
        <p className="mb-6 text-sm text-text-weak">
          Almost done. Confirm your details to finish creating your account.
        </p>
        <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
          <SignupSection title="Personal information">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
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
            </div>
            <Controller
              control={control}
              name="birthDate"
              render={({ field }) => (
                <div className="w-full flex flex-col items-start">
                  <Label htmlFor={'birthDate'} label={'Birth date'} />
                  <div className="grid w-full grid-cols-3 gap-2">
                    <SelectBox
                      className="w-full"
                      label={'Year'}
                      value={field.value.year}
                      options={BIRTH_YEAR_OPTIONS}
                      onChange={(value) => field.onChange({ ...field.value, year: value })}
                    />
                    <SelectBox
                      className="w-full"
                      label={'Month'}
                      value={field.value.month}
                      options={BIRTH_MONTH_OPTIONS}
                      onChange={(value) => field.onChange({ ...field.value, month: value })}
                    />
                    <SelectBox
                      className="w-full"
                      label={'Day'}
                      value={field.value.day}
                      options={BIRTH_DAY_OPTIONS}
                      onChange={(value) => field.onChange({ ...field.value, day: value })}
                    />
                  </div>
                </div>
              )}
            />
          </SignupSection>

          <SignupSection title="Account details">
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
          </SignupSection>

          <SignupSection title="Preferences">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <div className="w-full flex flex-col items-start">
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
          </SignupSection>

          <TermsAgreement checked={agree} onChange={setAgree} />
          <div className="sticky bottom-0 -mx-4 border-t border-border-default bg-white px-4 py-3">
            <Button
              variant="solid"
              color="primary"
              type="submit"
              className="w-full"
              disabled={isLoading || !isValid || !!userIdError || !agree}
            >
              {isLoading ? <Spinner color="primary" size="sm" /> : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

function SignupSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-5">
      <h2 className="mb-4 text-base font-semibold text-text-default">{title}</h2>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  );
}

function TermsAgreement({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="border-t border-border-default pt-5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 focus:ring-primary-500"
          id="agreeTerms"
        />
        <label htmlFor="agreeTerms" className="text-sm leading-5 text-text-default">
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
    </div>
  );
}
