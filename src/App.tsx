import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LoginPage, CommunityPage, KakaoRedirectPage, GoogleRedirectPage, AppleRedirectPage } from './pages';
import { DefaultLayout } from './components/layout/DefaultLayout.tsx';
import './App.css';
import 'swiper/css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/oauth/callback/kakao" element={<KakaoRedirectPage />} />
          <Route path="/oauth2/code/google" element={<GoogleRedirectPage />} />
          <Route path="/oauth/callback/apple" element={<AppleRedirectPage />} />

          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
