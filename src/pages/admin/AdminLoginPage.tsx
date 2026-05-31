import { Button, PasswordField, TextField } from '@/components/shared';
import { Logo } from '@/components/shared/icon';
import { adminClient } from '@/api/axiosConfig';
import { adminService } from '@/services/adminService';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/shared/spinner';

interface AdminLoginFormData {
  id: string;
  password: string;
}

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    defaultValues: {
      id: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Admin login
      const response = await adminService.login(data);
      const { accessToken } = response.data;

      if (accessToken) {
        adminClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }

      // Navigate to admin dashboard
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('로그인에 실패했습니다. 관리자 ID와 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-medium flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo className="text-text-brand-default" />
          </div>
          <h1 className="text-headline-100-heavy text-text-default mb-2">관리자 로그인</h1>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-default p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-bg-danger-weak border border-border-danger-default rounded-lg">
                <p className="text-body-200-medium text-text-danger-default">{error}</p>
              </div>
            )}

            {/* Admin ID Field */}
            <Controller
              control={control}
              name="id"
              rules={{
                required: '관리자 ID를 입력해주세요.',
              }}
              render={({ field }) => (
                <TextField id="adminId" label="관리자 ID" placeholder="admin" error={errors.id?.message} {...field} />
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: '비밀번호를 입력해주세요.',
              }}
              render={({ field }) => (
                <PasswordField
                  id="password"
                  label="비밀번호"
                  placeholder="비밀번호를 입력하세요"
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />

            {/* Submit Button */}
            <Button type="submit" variant="solid" color="primary" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? <Spinner color="primary" size="sm" /> : '로그인'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-body-200-medium text-text-weak">관리자 계정이 없으신가요? 시스템 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
};
