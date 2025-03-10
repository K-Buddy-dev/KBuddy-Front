import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import {
  LoginPage,
  CommunityPage,
  KakaoRedirectPage,
  GoogleRedirectPage,
  AppleRedirectPage,
  OauthSignupFormPage,
} from './pages';
import { DefaultLayout } from './components/shared/layout/DefaultLayout.tsx';
import 'swiper/css';
import { SignupVerifyPage } from './pages/SignupVerifyPage.tsx';
import { SignupFormPage } from './pages/SignupFormPage.tsx';
import { EmailVerifyContextProvider } from './store';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route
            element={
              <EmailVerifyContextProvider>
                <Outlet />
              </EmailVerifyContextProvider>
            }
          >
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup/verify" element={<SignupVerifyPage />} />
            <Route path="/signup/form" element={<SignupFormPage />} />
          </Route>

          <Route path="/oauth/callback/kakao" element={<KakaoRedirectPage />} />
          <Route path="/oauth2/code/google" element={<GoogleRedirectPage />} />
          <Route path="/oauth/callback/apple" element={<AppleRedirectPage />} />

          <Route path="/oauth/signup/form" element={<OauthSignupFormPage />} />

          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
