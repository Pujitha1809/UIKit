import React from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showPrevNext?: boolean;
}

const DOTS = '...';

const usePagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}) => {
  return React.useMemo(() => {
    // Total page numbers to show: siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    
    return [];
  }, [currentPage, totalPages, siblingCount]);
};

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showPrevNext = true,
      className,
      ...props
    },
    ref
  ) => {
    const paginationRange = usePagination({ currentPage, totalPages, siblingCount });

    if (currentPage === 0 || paginationRange.length < 2) {
      return null;
    }

    const onNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination Navigation"
        className={`${styles.container} ${className || ''}`}
        {...props}
      >
        <ul className={styles.list}>
          {showPrevNext && (
            <li>
              <button
                type="button"
                className={styles.button}
                disabled={currentPage === 1}
                onClick={onPrevious}
                aria-label="Go to previous page"
              >
                Prev
              </button>
            </li>
          )}

          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <li key={`dots-${index}`} className={styles.dots} aria-hidden="true">
                  &#8230;
                </li>
              );
            }

            return (
              <li key={pageNumber}>
                <button
                  type="button"
                  className={`${styles.button} ${pageNumber === currentPage ? styles.active : ''}`}
                  onClick={() => onPageChange(pageNumber as number)}
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                  aria-label={`Go to page ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}

          {showPrevNext && (
            <li>
              <button
                type="button"
                className={styles.button}
                disabled={currentPage === totalPages}
                onClick={onNext}
                aria-label="Go to next page"
              >
                Next
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';
