import React, { type FC } from 'react';
import Dropdown from '../dropdown/Dropdown';
import { ReIcon } from '../../components/ReIcon/ReIcon';

export interface DropdownActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showAll?: string;
  orientation?: 'start' | 'end';
  toggleIcon?: string;
  toggleImage?: React.ReactNode;
}

const DropdownAction: FC<DropdownActionProps> = ({
  title,
  orientation,
  showAll,
  toggleIcon = '',
  toggleImage,
  children,
  className: classes = ''
}) => {
  return (
    <Dropdown
      title={title ?? ''}
      indicator={false}
      showAll={showAll ?? ''}
      orientation={orientation}
      toggleIcon={toggleIcon}
      toggleClassNames="border-muted-200 dark:border-transparent shadow-lg shadow-muted-300/30 dark:shadow-muted-800/30 dark:hover:bg-muted-900 border dark:hover:border-muted-800 rounded-full"
      toggleImage={
        toggleImage ? (
          <>{toggleImage}</>
        ) : (
          <ReIcon
            iconName={toggleIcon}
            className="h-5 w-5 text-muted-400 transition-colors duration-300 group-hover:text-primary-500"
          />
        )
      }
      className={`${classes}`}
    >
      {children}
    </Dropdown>
  );
};

export default DropdownAction;
