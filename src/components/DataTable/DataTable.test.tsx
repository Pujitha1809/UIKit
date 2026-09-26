import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  const data = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
  ];
  
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age', sortable: true },
  ];

  it('renders headers and data correctly', () => {
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(<DataTable data={[]} columns={columns} emptyMessage="No data!" />);
    expect(screen.getByText('No data!')).toBeInTheDocument();
  });

  it('sorts columns on header click', async () => {
    render(<DataTable data={data} columns={columns} />);
    const nameHeader = screen.getByText('Name');
    
    // Sort asc
    await userEvent.click(nameHeader);
    let rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Alice');
    expect(rows[2]).toHaveTextContent('Bob');
    
    // Sort desc
    await userEvent.click(nameHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Bob');
    expect(rows[2]).toHaveTextContent('Alice');

    // Sort none
    await userEvent.click(nameHeader);
    rows = screen.getAllByRole('row');
    // Original order
    expect(rows[1]).toHaveTextContent('Alice');
    expect(rows[2]).toHaveTextContent('Bob');
  });

  it('triggers onRowClick', async () => {
    const handleRowClick = vi.fn();
    render(<DataTable data={data} columns={columns} onRowClick={handleRowClick} />);
    
    await userEvent.click(screen.getByText('Alice'));
    expect(handleRowClick).toHaveBeenCalledWith(data[0]);
  });
});
