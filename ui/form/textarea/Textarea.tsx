import React, { type FC, type TextareaHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { textareaVariants } from '../../variants/textarea-variants';
import Loader from '../../loader/Loader';
import { getIn } from 'formik';

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  resize?: boolean;
  loading?: boolean;
  formik?: any;
}

const Textarea: FC<TextAreaProps> = ({
  label,
  // error,
  color = 'default',
  shape = 'smooth',
  resize = false,
  formik,
  loading = false,
  className: classes = '',
  rows,
  ...props
}) => {
  let error = formik
    ? (getIn(formik.touched, props.name) && getIn(formik.errors, props.name)) || false
    : false;
  return (
    <div className="w-full font-sans">
      {!!label ? (
        <label htmlFor={props.name} className="text-sm text-muted-400">
          {label}
        </label>
      ) : (
        ''
      )}
      <div className="relative w-full text-base">
        <textarea
          rows={rows || 4}
          className={textareaVariants({
            color,
            shape,
            className: ` 
              ${classes}
              ${!resize ? 'resize-none' : ''}
              ${error ? '!border-error-500' : ''}
              ${
                loading
                  ? 'pointer-events-none !text-transparent !shadow-none placeholder:!text-transparent !select-none'
                  : ''
              }
            `
          })}
          {...props}
        ></textarea>
        {!!loading ? (
          <div
            className={`absolute end-0 top-0 z-0 flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
          `}
          >
            <Loader
              classNames={`dark:text-muted-200
                ${
                  color === 'muted' || color === 'mutedContrast'
                    ? 'text-muted-400'
                    : 'text-muted-300'
                }
              `}
              size={20}
              thickness={4}
            />
          </div>
        ) : (
          ''
        )}
        {!!error ? (
          <span className="-mt-1 block font-sans text-[0.75rem] text-error-500">{error}</span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Textarea;
