import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EmailVerifyActionContext, EmailVerifyStateContext } from '@/hooks/useEmailVerifyContext';
import { ToastProvider } from '@/hooks/useToastContext';
import render from '@/utils/test/render';
import { LoginPage } from './LoginPage';

//Accordion이 ResizeObserver를 사용하는데 jsdom에는 구현이 없다.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

vi.mock('@/services', () => ({
  authService: {
    login: vi.fn(),
    emailVerify: vi.fn(),
    sendCode: vi.fn(),
  },
}));

/**
 * 로그인은 더 이상 진입점이 아니라 거쳐 가는 화면이므로 닫을 수 있어야 한다.
 * 닫기가 동작하지 않으면 게스트가 로그인 화면에 갇힌다.
 */
it('closes the login screen and returns to home', async () => {
  const { user } = await render(
    <ToastProvider>
      <EmailVerifyStateContext.Provider value={{ email: '', error: '', isLoading: false, isVerify: false }}>
        <EmailVerifyActionContext.Provider value={{ setEmail: vi.fn(), emailVerify: vi.fn() }}>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<div>Home</div>} />
            </Routes>
          </MemoryRouter>
        </EmailVerifyActionContext.Provider>
      </EmailVerifyStateContext.Provider>
    </ToastProvider>
  );

  const [cancelButton] = screen.getAllByRole('button');
  await user.click(cancelButton);

  expect(await screen.findByText('Home')).toBeInTheDocument();
});
