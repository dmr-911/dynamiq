import React from 'react';

interface BaseParagraphProps {
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
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
  as?: 'p';
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
    | 'muted'
    | 'green'
    | 'red';
  children: React.ReactNode;
  className?: string;
}

const BaseParagraph: React.FC<BaseParagraphProps> = ({
  size = 'md',
  as: Component = 'p',
  lead = 'normal',
  weight = 'normal',
  color = 'gray',
  children,
  className
}) => {
  const sizeClass = size ? `text-${size}` : '';
  const leadClass = lead ? `leading-${lead}` : '';
  const weightClass = weight ? `font-${weight}` : '';
  const colorClass = `text-${color}-600 dark:text-${color}-400`;

  return (
    <Component
      className={`font-poppins ${sizeClass} ${leadClass} ${weightClass} ${colorClass} ${className} `}
    >
      {children}
    </Component>
  );
};

export default BaseParagraph;
