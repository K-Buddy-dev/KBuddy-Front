import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Checkbox, TextField, PasswordField } from '@/components';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleClickForgotPassword = () => {
    navigate('/forgot');
  };
  return (
    <form>
      <TextField
        id="username"
        name="username"
        type="text"
        label="Email address or user ID"
        value={username}
        onChange={handleChangeUsername}
      />
      <PasswordField
        id="password"
        name="password"
        type="password"
        label="Password"
        value={password}
        onChange={handleChangePassword}
      />
      <div className="w-full h-8 mb-6 flex items-center justify-between">
        <Checkbox label="Remember me" />
        <span
          className="text-primary font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer"
          onClick={handleClickForgotPassword}
        >
          Forgot password?
        </span>
      </div>
      <Button className="w-full">Log in</Button>
    </form>
  );
}
