import { ReIcon } from '../../components/ReIcon/ReIcon';
import { cn } from '../../../../utils/cn';
import React from 'react';

const InlineText = ({
  text,
  icon,
  iconPlacement = 'left',
  className,
  beforeText,
  beforeTextClass,
  textClass,
  afterText,
  afterTextClass
}: {
  beforeText?: string;
  text?: string;
  afterText?: string;
  icon?: string | null;
  iconPlacement?: 'left' | 'right';
  className?: string;
  textClass?: string;
  beforeTextClass?: string;
  afterTextClass?: string;
}) => {
  return (
    <div
      className={cn(
        'max-w-full items-center gap-1 overflow-hidden truncate text-muted-600 dark:text-muted-300',
        className && className
      )}
    >
      {icon && iconPlacement === 'left' && <ReIcon iconName={icon} />}
      {beforeText && (
        <span className={cn('capitalize', beforeTextClass && beforeTextClass)}>{beforeText}</span>
      )}
      <span className={cn(textClass && textClass, 'truncate')}>{text}</span>
      {afterText && (
        <span className={cn('capitalize', afterTextClass && afterTextClass)}>{afterText}</span>
      )}
      {icon && iconPlacement === 'right' && <ReIcon iconName={icon} />}
    </div>
  );
};

export default InlineText;
