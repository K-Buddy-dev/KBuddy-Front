import { Meta, StoryObj } from '@storybook/react';
import { PasswordField } from './PasswordField';
import { useForm } from 'react-hook-form';
import { LoginFormData } from '@/types';

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

export const Default: Story = {
  render: (args) => {
    const { register, control } = useForm<LoginFormData>();

    return <PasswordField {...args} id="password" register={register('password')} control={control} />;
  },
};

export const WithError: Story = {
  render: (args) => {
    const { register, control } = useForm<LoginFormData>();

    return (
      <PasswordField
        {...args}
        id="password"
        register={register('password')}
        control={control}
        error="Password is too weak"
      />
    );
  },
};

export const WithValidation: Story = {
  render: (args) => {
    const { register, control } = useForm<LoginFormData>();

    return (
      <PasswordField {...args} id="password" register={register('password')} control={control} showValidation={true} />
    );
  },
};
