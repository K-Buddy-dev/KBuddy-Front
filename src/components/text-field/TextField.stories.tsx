import { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';
import { useState } from 'react';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text', defaultValue: 'text' },
    label: { control: 'text', defaultValue: 'Label' },
    placeholder: { control: 'text', defaultValue: 'Enter text...' },
    error: { control: 'text', defaultValue: '' },
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} id="default" name="default" />;
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id="error"
        name="error"
        error="This is an error"
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id="disabled"
        name="disabled"
        disabled
      />
    );
  },
};

export const WithPlaceholder: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id="placeholder"
        name="placeholder"
        placeholder="Type something..."
      />
    );
  },
};
