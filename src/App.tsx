import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
} from './pages';

import { DefaultLayout } from './components/shared/layout/DefaultLayout.tsx';
import 'swiper/css';
import { EmailVerifyGuard } from './components/routes/EmailVerifyGuard.tsx';
import { AuthGuard } from './components/routes/AuthGuard.tsx';
import { CommunityFormContextProvider } from './components/contexts/CommunityFormContextProvider.tsx';
import { EmailVerifyContextProvider } from './components/contexts/EmailVerifyContextProvider.tsx';
import { ToastProvider } from './hooks/useToastContext.tsx';
import { MobileEnvProvider } from './components/contexts/MobileEnvContextProvider.tsx';

function App() {
  return (
    <MobileEnvProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
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
                <Route path="/oauth/callback/apple" element={<AppleRedirectPage />} />

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
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </MobileEnvProvider>
  );
}

export default App;
