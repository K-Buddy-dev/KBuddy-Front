import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/LoginPage.tsx';
import { DefaultLayout } from './components/layout/DefaultLayout.tsx';
import { Community } from './containers/community/index.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/community" element={<Community />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
