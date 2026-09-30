import React, { type FC } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { iconboxVariants } from '../variants/iconbox-variants';
import { ReIcon } from '../../components/ReIcon/ReIcon';

interface IconBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof iconboxVariants> {
  icon: string;
  iconClasses?: string;
  mask?: 'hex' | 'hexed' | 'blob' | 'deca' | 'diamond';
}

const IconBox: FC<IconBoxProps> = ({
  variant,
  color = 'default',
  icon,
  shape = 'full',
  size = 'md',
  mask,
  shadow,
  className: classes = '',
  iconClasses = '',
  ...props
}) => {
  return (
    <div
      className={iconboxVariants({
        variant,
        color,
        shape,
        size,
        shadow,
        className: `relative flex shrink-0 items-center justify-center overflow-hidden ${classes} ${shape === 'straight' && variant !== 'outlined' && mask === 'hex' ? 'mask mask-hex' : ''} ${shape === 'straight' && variant !== 'outlined' && mask === 'hexed' ? 'mask mask-hexed' : ''} ${shape === 'straight' && variant !== 'outlined' && mask === 'blob' ? 'mask mask-blob' : ''} ${shape === 'straight' && variant !== 'outlined' && mask === 'deca' ? 'mask mask-deca' : ''} ${
          shape === 'straight' && variant !== 'outlined' && mask === 'diamond'
            ? 'mask mask-diamond'
            : ''
        }`
      })}
      {...props}
    >
      {variant === 'pastel' && (
        <div className="absolute inset-0 bg-primary-500 opacity-15 shadow-xl shadow-primary-500"></div>
      )}

      <ReIcon iconName={icon} className={`${iconClasses}`} />
    </div>
  );
};

export default IconBox;
