import { adminClient } from '@/api/axiosConfig';
import { adminService } from '@/services/adminService';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function AdminAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // If no access token, try to refresh from refresh token (cookie)
        if (!adminClient.defaults.headers.common['Authorization']) {
          const response = await adminService.refreshAccessToken();
          const { accessToken } = response.data;

          if (accessToken) {
            adminClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          // Access token already exists
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminAuth();
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-medium">
        <div className="inline-block w-8 h-8 border-4 border-border-brand-default border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render admin routes
  return <Outlet />;
}
