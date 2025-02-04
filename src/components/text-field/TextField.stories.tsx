import { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', defaultValue: 'Label' },
    placeholder: { control: 'text', defaultValue: 'Enter text...' },
    error: { control: 'text', defaultValue: '' },
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

const StoryTemplate = (args: any) => {
  const { control, register, setValue } = useForm({
    defaultValues: { fieldValue: '' },
  });

  return (
    <TextField
      {...args}
      id="storybook-textfield"
      label="Text Field"
      control={control}
      register={register('fieldValue')}
      setValue={setValue}
    />
  );
};

export const Default: Story = {
  render: (args) => <StoryTemplate {...args} />,
};

export const WithError: Story = {
  render: (args) => <StoryTemplate {...args} error="This is an error" />,
};

export const Disabled: Story = {
  render: (args) => <StoryTemplate {...args} disabled />,
};

export const WithPlaceholder: Story = {
  render: (args) => <StoryTemplate {...args} placeholder="Type something..." />,
};
