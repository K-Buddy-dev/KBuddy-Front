import { Meta, StoryObj } from '@storybook/react';
import { PasswordField } from './PasswordField';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const meta: Meta<typeof PasswordField> = {
  title: 'Components/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', defaultValue: 'Password' },
    placeholder: { control: 'text', defaultValue: 'Enter your password' },
    error: { control: 'text', defaultValue: '' },
    showValidation: { control: 'boolean', defaultValue: false },
  },
};

export default meta;

type Story = StoryObj<typeof PasswordField>;

const DefaultComponent: React.FC<any> = (args) => {
  const { control } = useForm({
    defaultValues: { password: '' },
  });

  return (
    <Controller control={control} name="password" render={({ field }) => <PasswordField {...args} {...field} />} />
  );
};

export const Default: Story = {
  render: (args) => <DefaultComponent {...args} />,
};

const WithErrorComponent: React.FC<any> = (args) => {
  const [password, setPassword] = useState('');

  return (
    <PasswordField
      {...args}
      id="password"
      name="password"
      error="Password is too weak"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
};

export const WithError: Story = {
  render: (args) => <WithErrorComponent {...args} />,
};

const WithValidationComponent: React.FC<any> = (args) => {
  const [password, setPassword] = useState('');

  return (
    <PasswordField
      {...args}
      id="password"
      name="password"
      showValidation={true}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
};

export const WithValidation: Story = {
  render: (args) => <WithValidationComponent {...args} />,
};
