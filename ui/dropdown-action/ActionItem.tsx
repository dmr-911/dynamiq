import { ReIcon } from '../../components/ReIcon/ReIcon';
import React, { type FC } from 'react';

export interface ActionItemProps {
  href?: string;
  icon?: string;
  image?: React.ReactNode;
  text: string;
  subtext: string;
  shape?: 'straight' | 'rounded' | 'smooth' | 'curved';
}

const ActionItem: FC<ActionItemProps> = ({
  href,
  icon,
  image,
  text,
  subtext,
  shape = 'smooth'
}) => {
  return (
    <a
      href={href ? href : '#'}
      className={`
      group/option mx-2 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-300 hover:bg-muted-100 dark:hover:bg-muted-800
      ${shape === 'rounded' && 'rounded-md'}
      ${shape === 'smooth' && 'rounded-lg'}
      ${shape === 'curved' && 'rounded-xl'}
    `}
    >
      {image ? <>{image}</> : ''}
      {icon ? (
        <ReIcon
          iconName={icon ?? ''}
          className="h-5 w-5 text-muted-400 transition-colors duration-300 group-hover/option:text-primary-500"
        />
      ) : (
        ''
      )}
      <div className="font-sans">
        <span className="block cursor-pointer text-xs font-normal leading-tight text-muted-800 dark:text-muted-100">
          {text}
        </span>
        <span className="block text-xs leading-tight text-muted-400">{subtext}</span>
      </div>
    </a>
  );
};

export default ActionItem;
