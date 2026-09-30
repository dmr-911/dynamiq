import React from 'react';

interface BaseHeadingProps {
  size?:
    | 'sm'
    | 'base'
    | 'lg'
    | 'md'
    | 'xs'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  lead?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  weight?: 'bold' | 'light' | 'normal' | 'medium' | 'semibold' | 'extrabold';
  color?:
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'error'
    | 'success'
    | 'info'
    | 'gray'
    | 'dark-gray'
    | 'muted';
  children: React.ReactNode;
  className?: string;
}

const BaseHeading: React.FC<BaseHeadingProps> = ({
  size = 'base',
  as: Component = 'h1',
  lead = 'normal',
  weight = 'normal',
  color = 'muted',
  children,
  className
}) => {
  const sizeClass = size ? `text-${size}` : '';
  const leadClass = lead ? `leading-${lead}` : '';
  const weightClass = weight ? `font-${weight}` : '';
  const colorClass = `text-${color}-600 dark:text-${color}-400`;

  return (
    <Component
      className={`font-poppins ${sizeClass} ${leadClass} ${weightClass} ${colorClass} ${className}`}
    >
      {children}
    </Component>
  );
};

export default BaseHeading;
