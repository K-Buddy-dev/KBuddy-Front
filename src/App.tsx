import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LoginPage,
  KakaoRedirectPage,
  GoogleRedirectPage,
  AppleRedirectPage,
  OauthSignupFormPage,
  TempPage,
  CommunityDetailPage,
  ProfilePage,
  EditProfilePage,
  SettingPage,
  HomePage,
  CommunityPage,
  CommunityPostPage,
  SignupVerifyPage,
  SignupFormPage,
  CommunityEditPage,
  TypeCategoryPage,
  TitleImageDescriptionPage,
  CommunityCompletePage,
  AdminDashboardPage,
  UserManagementPage,
  AdminLoginPage,
  ReportsManagementPage,
} from './pages';

import { DefaultLayout } from './components/shared/layout/DefaultLayout.tsx';
import 'swiper/css';
import { EmailVerifyGuard } from './components/routes/EmailVerifyGuard.tsx';
import { AuthGuard } from './components/routes/AuthGuard.tsx';
import { AdminAuthGuard } from './components/routes/AdminAuthGuard.tsx';
import { CommunityFormContextProvider } from './components/contexts/CommunityFormContextProvider.tsx';
import { EmailVerifyContextProvider } from './components/contexts/EmailVerifyContextProvider.tsx';
import { ToastProvider } from './hooks/useToastContext.tsx';
import { MobileEnvProvider } from './components/contexts/MobileEnvContextProvider.tsx';
import { APP_PUSH_TYPE, getAppRoute } from './constants/enum.ts';
import { BlockUserPage } from './pages/BlockUserPage.tsx';

// AppRoutes component - inside BrowserRouter context
function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('🚀 ~ handleMessage ~ data:', data);

        if (data.type === APP_PUSH_TYPE.PUSH_NOTIFICATION) {
          const { postID, postPart } = data;
          const targetUrl = getAppRoute(postPart, postID);
          navigate(targetUrl);
        }
      } catch (err) {
        console.error('Invalid message data:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* Admin Login Route - Public */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Routes - Protected with AdminAuthGuard */}
      <Route element={<AdminAuthGuard />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/reports" element={<ReportsManagementPage />} />
      </Route>

      <Route element={<DefaultLayout />}>
        <Route element={<AuthGuard />}>
          <Route element={<EmailVerifyContextProvider />}>
            <Route path="/" element={<LoginPage />} />
            <Route element={<EmailVerifyGuard guardType="verifyEmail" />}>
              <Route path="/signup/verify" element={<SignupVerifyPage />} />
            </Route>
            <Route element={<EmailVerifyGuard guardType="requireVerified" />}>
              <Route path="/signup/form" element={<SignupFormPage />} />
            </Route>
          </Route>

          <Route path="/oauth/callback/kakao" element={<KakaoRedirectPage />} />
          <Route path="/oauth2/code/google" element={<GoogleRedirectPage />} />
          <Route path="/oauth/apple-redirect" element={<AppleRedirectPage />} />

          <Route path="/oauth/signup/form" element={<OauthSignupFormPage />} />

          <Route path="/community" element={<CommunityPage />} />
          <Route element={<CommunityFormContextProvider />}>
            <Route path="/community/post" element={<CommunityPostPage />} />
            <Route path="/community/post/type-category" element={<TypeCategoryPage />} />
            <Route path="/community/post/title-image-description" element={<TitleImageDescriptionPage />} />
            <Route path="/community/post/complete" element={<CommunityCompletePage />} />
            <Route path="/community/edit" element={<CommunityEditPage />} />
            <Route path="/community/detail/:id" element={<CommunityDetailPage />} />
          </Route>

          <Route path="/home" element={<HomePage />} />
          <Route path="/service" element={<TempPage />} />
          <Route path="/message" element={<TempPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/block-user" element={<BlockUserPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <MobileEnvProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </MobileEnvProvider>
  );
}

export default App;
