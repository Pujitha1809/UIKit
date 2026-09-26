import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button';

const meta = {
  title: 'Components/Toast',
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Default Toast', description: 'This is a default notification.' })}>
        Default
      </Button>
      <Button variant="primary" onClick={() => toast({ title: 'Success!', description: 'Your changes have been saved.', variant: 'success' })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Warning', description: 'Your session is about to expire.', variant: 'warning' })}>
        Warning
      </Button>
      <Button variant="danger" onClick={() => toast({ title: 'Error', description: 'Failed to save changes.', variant: 'danger' })}>
        Danger
      </Button>
    </div>
  );
};

export const Demo: Story = {
  render: () => <ToastDemo />,
};
