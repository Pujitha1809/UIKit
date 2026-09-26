import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as any,
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
      />
    );
  },
};

export const LotsOfPages: Story = {
  args: {} as any,
  render: () => {
    const [page, setPage] = useState(50);
    return (
      <Pagination
        currentPage={page}
        totalPages={100}
        onPageChange={setPage}
      />
    );
  },
};
