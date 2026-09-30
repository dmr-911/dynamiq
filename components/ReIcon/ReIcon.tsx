import React from 'react';

interface ReIconProps {
  iconName?: string;
  className?: string;
}

const ReIcon = ({ iconName, className }: ReIconProps) => {
  return <span className={className}>{iconName}</span>;
};

export { ReIcon };
export default ReIcon;
