import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { DefaultLayout } from '@components/layout/DefaultLayout.tsx';
import { LoginPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
