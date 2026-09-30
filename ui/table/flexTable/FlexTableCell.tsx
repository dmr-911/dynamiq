import { cn } from '../../utils/cn';
import React from 'react';

type TableCellProps = {
  type?: 'grow' | 'shrink' | 'stable';
  light?: boolean;
  clamp?: false | 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  label?: string;
  className?: string;
  border?: boolean;
};

const clampMap = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6'
};

const FlexTableCell = ({
  type = 'stable',
  light,
  clamp = 1,
  children,
  label,
  className,
  border = true
}: TableCellProps) => {
  return (
    <div
      className={cn(
        `font-alt flex items-center justify-between px-2 py-2 text-sm before:block before:font-sans before:text-xs before:font-medium before:uppercase before:text-muted-400 before:content-[attr(data-content)] md:before:hidden ${
          type === 'grow'
            ? 'md:grow'
            : type === 'shrink'
              ? 'md:shrink'
              : type === 'stable'
                ? 'md:w-[110px] md:shrink-0'
                : type === 'stable' && clamp && clampMap[clamp]
        } `,
        // ${light ? 'text-muted-500 dark:text-white' : 'text-muted-800 dark:text-white'}
        className && className,
        border && 'border-muted-200 last:border-r-0 dark:border-muted-700 md:border-r'
      )}
      data-content={label}
    >
      {children}
    </div>
  );
};

export default FlexTableCell;
