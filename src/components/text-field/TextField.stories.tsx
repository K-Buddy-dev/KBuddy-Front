import { Meta, StoryFn } from '@storybook/react';
import { TextField } from './TextField';
import { useState } from 'react';

export default {
  title: 'Components/Input',
  component: TextField,
  argTypes: {
    value: { control: 'text' },
    error: { control: 'text' },
  },
} as Meta<typeof TextField>;

export const Default: StoryFn<typeof TextField> = (args) => {
  const [text, setText] = useState('');

  return <TextField {...args} value={text} onChange={(e) => setText(e.target.value)} />;
};
