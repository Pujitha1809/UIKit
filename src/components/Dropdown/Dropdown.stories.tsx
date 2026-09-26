import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian', disabled: true },
  { label: 'Elderberry', value: 'elderberry' },
];

export const Default: Story = {
  args: {
    options,
    placeholder: 'Select a fruit...',
    style: { width: '250px' }
  } as any,
};

export const WithLabel: Story = {
  args: {
    label: 'Favorite Fruit',
    options,
    placeholder: 'Select a fruit...',
    style: { width: '250px' }
  } as any,
};

export const WithError: Story = {
  args: {
    label: 'Favorite Fruit',
    options,
    error: 'Please select a fruit',
    style: { width: '250px' }
  } as any,
};
