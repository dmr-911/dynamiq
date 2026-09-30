import { cn } from '../../utils/cn';
import React from 'react';

type FlexTableRowProps = {
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  border?: boolean;
  className?: string;
  onClick?: () => void;
};

const FlexTableRow = ({
  className,
  rounded,
  border = true,
  children,
  onClick
}: FlexTableRowProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        `${border && 'border'} " flex w-full flex-col overflow-x-auto border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 md:flex-row md:justify-between ${
          rounded == 'sm'
            ? `rounded-md`
            : rounded == 'md'
              ? 'rounded-lg'
              : rounded == 'lg'
                ? 'rounded-xl'
                : ''
        } `,
        className && className
      )}
    >
      {children}
    </div>
  );
};

export default FlexTableRow;
