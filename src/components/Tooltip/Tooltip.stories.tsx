import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placements: Story = {
  args: {} as any,
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', padding: '4rem' }}>
      <Tooltip content="Tooltip on top" placement="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" placement="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip on left" placement="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Tooltip on right" placement="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};
