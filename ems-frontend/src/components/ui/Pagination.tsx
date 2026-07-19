import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalItems: number;
  pageSize: number;
}) {
  if (totalPages <= 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = () => {
    const arr: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
      return arr;
    }
    arr.push(1);
    if (page > 3) arr.push('...');
    const startP = Math.max(2, page - 1);
    const endP = Math.min(totalPages - 1, page + 1);
    for (let i = startP; i <= endP; i++) arr.push(i);
    if (page < totalPages - 2) arr.push('...');
    arr.push(totalPages);
    return arr;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3">
      <p className="text-xs text-secondary">
        Showing <span className="font-medium text-primary">{start}–{end}</span> of{' '}
        <span className="font-medium text-primary">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg p-2 text-secondary hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent focus-ring"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages().map((p, i) =>
          typeof p === 'number' ? (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={cn(
                'h-8 min-w-8 rounded-lg px-2 text-xs font-medium focus-ring',
                p === page ? 'bg-accent-500 text-white' : 'text-secondary hover:bg-surface-2'
              )}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-xs text-tertiary">
              {p}
            </span>
          )
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-lg p-2 text-secondary hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent focus-ring"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
