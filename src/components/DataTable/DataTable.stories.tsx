import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Badge } from '../Badge';

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Offline';
}

const data: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'Editor', status: 'Offline' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Active' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active' },
];

export const Default: Story = {
  args: {
    data,
    columns: [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      { key: 'role', header: 'Role', sortable: true },
      { 
        key: 'status', 
        header: 'Status',
        render: (row: any) => (
          <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
            {row.status}
          </Badge>
        )
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: Default.args?.columns as any,
    emptyMessage: 'No users found.',
  },
};
