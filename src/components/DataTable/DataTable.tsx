import React, { useState, useMemo } from 'react';
import styles from './DataTable.module.css';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  stickyHeader?: boolean;
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDirection = 'ascending' | 'descending' | 'none';

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  stickyHeader = false,
  emptyMessage = 'No data available.',
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | string | null; direction: SortDirection }>({
    key: null,
    direction: 'none',
  });

  const handleSort = (columnKey: keyof T | string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'ascending') direction = 'descending';
      else if (sortConfig.direction === 'descending') direction = 'none';
    }
    setSortConfig({ key: direction === 'none' ? null : columnKey, direction });
  };

  const sortedData = useMemo(() => {
    if (sortConfig.direction === 'none' || !sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key as keyof T];
      const valB = b[sortConfig.key as keyof T];
      
      if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className={`${styles.container} ${stickyHeader ? styles.sticky : ''} ${className || ''}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => {
              const isSorted = sortConfig.key === col.key;
              const ariaSort = isSorted ? sortConfig.direction : 'none';

              return (
                <th
                  key={String(col.key) + idx}
                  style={{ width: col.width }}
                  aria-sort={col.sortable ? ariaSort : undefined}
                  className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={styles.thContent}>
                    {col.header}
                    {col.sortable && (
                      <span className={styles.sortIcon} aria-hidden="true">
                        {isSorted && sortConfig.direction === 'ascending' ? '▲' : ''}
                        {isSorted && sortConfig.direction === 'descending' ? '▼' : ''}
                        {!isSorted || sortConfig.direction === 'none' ? '↕' : ''}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${styles.tr} ${onRowClick ? styles.clickable : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={styles.td}>
                    {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
