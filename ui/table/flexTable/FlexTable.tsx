import React from 'react';

type FlexTableProps = {
  header?: React.ReactNode;
  body: React.ReactNode;
  rowgap?: 'none' | 'sm' | 'md' | 'lg';
};

const FlexTable = ({ header, body, rowgap }: FlexTableProps) => {
  return (
    <div className="relative">
      {
        header && <div className="hidden justify-between md:flex md:items-center">{header}</div>
      }
      
      <div
        className={`flex flex-col
        ${rowgap === 'sm' ? 'gap-y-1' : rowgap === 'md' ? 'gap-y-2' : rowgap === 'lg' ? 'gap-y-4' : ''}
        `}
      >
        {body}
      </div>
    </div>
  );
};

export default FlexTable;
