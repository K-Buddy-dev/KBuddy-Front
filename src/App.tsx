import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LoginPage, CommunityPage, KakaoRedirectPage, GoogleRedirectPage, AppleRedirectPage } from './pages';
import { DefaultLayout } from './components/layout/DefaultLayout.tsx';
import 'swiper/css';
import { SignupVerifyPage } from './pages/SignupVerifyPage.tsx';
import { SignupFormPage } from './pages/SignupFormPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<LoginPage />} />

          <Route path="/oauth/callback/kakao" element={<KakaoRedirectPage />} />
          <Route path="/oauth2/code/google" element={<GoogleRedirectPage />} />
          <Route path="/oauth/callback/apple" element={<AppleRedirectPage />} />

          <Route path="/signup/verify" element={<SignupVerifyPage />} />
          <Route path="/signup/form" element={<SignupFormPage />} />

          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
