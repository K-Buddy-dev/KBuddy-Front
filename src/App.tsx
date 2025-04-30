import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  LoginPage,
  KakaoRedirectPage,
  GoogleRedirectPage,
  AppleRedirectPage,
  OauthSignupFormPage,
  TempPage,
  ProfilePage,
  EditProfilePage,
} from './pages';
import { DefaultLayout } from './components/shared/layout/DefaultLayout.tsx';
import 'swiper/css';
import { SignupVerifyPage } from './pages/SignupVerifyPage.tsx';
import { SignupFormPage } from './pages/SignupFormPage.tsx';
import { EmailVerifyGuard } from './components/routes/EmailVerifyGuard.tsx';
import { EmailVerifyContextProvider } from './components/contexts/EmailVerifyContextProvider.tsx';
import { AuthGuard } from './components/routes/AuthGuard.tsx';
import CommunityPostPage from './pages/CommunityPostPage.tsx';
import { CommunityPage } from './pages/CommunityPage.tsx';
import { CommunityFormContextProvider } from './components/contexts/CommunityFormContextProvider.tsx';

function App() {
  return (
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
            </Route>
            <Route path="/home" element={<TempPage />} />
            <Route path="/service" element={<TempPage />} />
            <Route path="/message" element={<TempPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
