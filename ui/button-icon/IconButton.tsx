import React, { type ButtonHTMLAttributes, type FC } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { buttonIconVariants } from '../variants/button-icon-variants';
import Loader from '../loader/Loader';
import { Tooltip } from '../tooltip/Tooltip';

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonIconVariants> {
  children?: React.ReactNode;
  loading?: boolean;
  titlePlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const IconButton: FC<IconButtonProps> = ({
  variant,
  color,
  shape,
  size = 'md',
  shadow,
  className: classes,
  children,
  loading = false,
  title,
  titlePlacement,
  ...props
}) => {
  return (
    <Tooltip placement={titlePlacement} content={title}>
      <button
        className={buttonIconVariants({
          variant,
          shape,
          color,
          size,
          shadow,
          className: `shrink-0 overflow-hidden ${
            loading ? 'pointer-events-none relative !text-transparent' : ''
          } ${classes}`
        })}
        {...props}
      >
        {variant === 'pastel' && (
          <div className="absolute inset-0 bg-primary-300 opacity-10 !shadow-xl !shadow-primary-500 hover:bg-primary-700"></div>
        )}
        {children}
        {loading ? (
          <Loader
            classNames="absolute top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2"
            size={20}
            thickness={4}
          />
        ) : (
          ''
        )}
      </button>
    </Tooltip>
  );
};

export default IconButton;
