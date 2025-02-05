import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LoginPage, CommunityPage } from './pages';
import { DefaultLayout } from './components/layout/DefaultLayout.tsx';
import './App.css';
import 'swiper/css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
