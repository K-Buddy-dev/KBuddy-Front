import { useEmailVerifyStateContext } from '@/hooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface EmailVerifyGuardProps {
  guardType: 'verifyEmail' | 'requireVerified';
}

export const EmailVerifyGuard = ({ guardType }: EmailVerifyGuardProps) => {
  const { email, isVerify } = useEmailVerifyStateContext();
  const location = useLocation();

  if (guardType === 'verifyEmail' && !email) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (guardType === 'requireVerified' && !isVerify) {
    return <Navigate to="/signup/verify" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
