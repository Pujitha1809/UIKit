import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'flat'] },
    isHoverable: { control: 'boolean' },
    children: { control: false },
    style: { control: false },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    style: { width: '300px' },
    children: (
      <>
        <Card.Header>Card Title</Card.Header>
        <Card.Body>This is the body of the card. It contains some content.</Card.Body>
        <Card.Footer>Footer content</Card.Footer>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    ...Default.args,
    variant: 'outlined',
  },
};

export const Flat: Story = {
  args: {
    ...Default.args,
    variant: 'flat',
  },
};

export const Hoverable: Story = {
  args: {
    ...Default.args,
    isHoverable: true,
  },
};
