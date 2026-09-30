import { cn } from '../../utils/cn';
import React from 'react';

type FlexTableHeadingProps = {
  type?: 'grow' | 'shrink' | 'stable';
  children: React.ReactNode;
  className?: string;
  border?:boolean;
};

const FlexTableHeading = ({ type, children, className,border=true }: FlexTableHeadingProps) => {
  return (
    <div
      className={cn(
        `text-muted-400 px-2 py-2 text-xs font-medium uppercase
        ${
          type == 'grow'
            ? `md:grow`
            : type == 'shrink'
              ? 'md:shrink'
              : type == 'stable'
                ? 'sm:w-[90px] md:line-clamp-2 md:w-[110px] md:shrink-0'
                : ''
        }
    `,
        className && className,
        border && 'border-r border-muted-200 dark:border-muted-700 last:border-r-0 last:mr-1'
      )}
    >
      {children}
    </div>
  );
};

export default FlexTableHeading;
