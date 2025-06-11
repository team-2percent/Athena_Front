import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/common/Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    children: {
      control: 'text'
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '버튼',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary', 
    children: '버튼',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '버튼',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: '버튼',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: '버튼',
  },
};

export const Large: Story = {
  args: {
    size: 'lg', 
    children: '버튼',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: '버튼',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '버튼',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '버튼',
    size: 'md',
  },
};

export const GhostPrimary: Story = {
  args: {
    variant: 'ghost-primary',
    children: '버튼',
    size: 'md',
  },
};

export const GhostDanger: Story = {
  args: {
    variant: 'ghost-danger',
    children: '버튼',
    size: 'md',
  },
};