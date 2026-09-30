import React, { type FC } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { toggleSwitchVariants } from '../../variants/toggle-switch-variants';

export interface ToggleSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'>,
    VariantProps<typeof toggleSwitchVariants> {
  checked?: boolean;
  label?: string;
  sublabel?: string;
  supportText?: any;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  id,
  checked,
  label,
  sublabel,
  color,
  className: classes = '',
  supportText,
  ...props
}) => {
  // console.log("checked", checked);
  return (
    <div
      className={`relative col-span-full flex items-center gap-2 text-base ${supportText && 'justify-between'}`}
    >
      <label htmlFor={id} className="relative inline-flex cursor-pointer items-center gap-3">
        <span className="relative inline-flex">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            className={`peer pointer-events-none absolute opacity-0`}
            {...props}
          />
          <i className={toggleSwitchVariants({ color })}></i>
        </span>

        {!sublabel ? (
          label && <span className="font-sans text-sm text-muted-400">{label}</span>
        ) : (
          <div className="ms-1">
            <span className="block font-sans text-sm text-muted-800 dark:text-muted-100">
              {label}
            </span>
            <span className="block font-sans text-xs text-muted-400 dark:text-muted-400">
              {sublabel}
            </span>
          </div>
        )}
      </label>
      {supportText ? supportText : null}
    </div>
  );
};

export default ToggleSwitch;
