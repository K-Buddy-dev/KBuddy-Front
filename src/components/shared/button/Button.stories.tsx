import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'link'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'solid',
    color: 'primary',
    size: 'large',
    disabled: false,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button variant="solid" color="primary">
        Solid Primary
      </Button>
      <Button variant="solid" color="secondary">
        Solid Secondary
      </Button>
      <Button variant="outline" color="primary">
        Outline Primary
      </Button>
      <Button variant="outline" color="secondary">
        Outline Secondary
      </Button>
      <Button variant="link" color="primary">
        Link Primary
      </Button>
      <Button variant="link" color="secondary">
        Link Secondary
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button size="small" variant="solid" color="primary">
        Small Button
      </Button>
      <Button size="medium" variant="solid" color="primary">
        Medium Button
      </Button>
      <Button size="large" variant="solid" color="primary">
        Large Button
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button variant="solid" color="primary" disabled>
        Disabled Solid
      </Button>
      <Button variant="outline" color="secondary" disabled>
        Disabled Outline
      </Button>
      <Button variant="link" color="primary" disabled>
        Disabled Link
      </Button>
    </div>
  ),
};
