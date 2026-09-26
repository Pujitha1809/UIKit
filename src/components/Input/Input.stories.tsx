import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    isInvalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    helperText: 'We will never share your email.',
    type: 'email',
    placeholder: 'john@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    errorMessage: 'Password must be at least 8 characters.',
    type: 'password',
    defaultValue: '123',
  },
};

export const WithAddons: Story = {
  args: {
    label: 'Website',
    leftAddon: 'https://',
    rightAddon: '.com',
    placeholder: 'example',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    defaultValue: 'Cannot edit this',
  },
};
