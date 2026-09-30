import { getIn } from 'formik';
import React, { type FC, type InputHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { inputVariants } from '../../variants/input-variants';
import Loader from '../../loader/Loader';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import FormError from '../../../FormError';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
  VariantProps<typeof inputVariants> {
  icon?: string;
  label?: string;
  addon?: string;
  formik?: any;
  error?: string;
  loading?: boolean;
  forceError?: boolean;
  showErrorMessage?: boolean;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

const Input: FC<InputProps> = ({
  label,
  addon,
  size = 'md',
  color = 'default',
  shape = 'smooth',
  // error,
  formik,
  loading = false,
  icon,
  suffix,
  forceError,
  className: classes = '',
  showErrorMessage = true,
  prefix,
  ...props
}) => {
  let error =
    forceError ??
    ((getIn(formik?.touched, props?.name) && getIn(formik.errors, props?.name)) || false);

  console.log("formik error", error, getIn(formik?.touched, props?.name), props.name)
  return (
    <div className="w-full">
      {!!label && (
        <label
          htmlFor={props.name}
          className="truncate font-sans text-[.85rem] text-muted-400 dark:text-muted-300"
        >
          {label}
        </label>
      )}
      <div className={`relative w-full ${addon ? 'flex' : ''}`}>
        {!!addon ? (
          <div
            className={`inline-flex cursor-pointer items-center justify-center border border-muted-200 border-e-transparent bg-muted-100 px-4 py-2 text-center text-sm leading-tight text-muted-500 dark:border-muted-800 dark:border-e-transparent dark:bg-muted-700 dark:text-muted-300 ${size === 'sm' ? 'h-8' : ''} ${size === 'md' ? 'h-10' : ''} ${size === 'lg' ? 'h-12' : ''} ${shape === 'rounded' ? 'rounded-s-md' : ''} ${shape === 'smooth' ? 'rounded-s-lg' : ''} ${shape === 'curved' ? 'rounded-s-xl' : ''} ${shape === 'full' ? 'rounded-s-full' : ''} `}
          >
            {addon}
          </div>
        ) : (
          ''
        )}
        <input
          className={inputVariants({
            size,
            color,
            shape,
            className: `peer ${classes} ${prefix ? 'pl-16' : ''} ${size === 'sm' && icon ? 'pe-2 ps-8' : ''} ${size === 'md' && icon ? 'pe-3 ps-10' : ''} ${size === 'lg' && icon ? 'pe-4 ps-12' : ''} ${size === 'sm' && !icon ? 'px-2' : ''} ${size === 'md' && !icon ? 'px-3' : ''} ${size === 'lg' && !icon ? 'px-4' : ''} ${error ? '!border-error-500' : ''} ${addon ? '!rounded-s-none' : ''} ${loading
              ? 'pointer-events-none !select-none !text-muted-400 !shadow-none placeholder:!text-transparent'
              : ''
              } `
          })}
          {...props}
        />
        {prefix && (
          <div
            className={`absolute left-3 top-0 z-0 flex items-center justify-center pl-2 text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            {/* <ReIcon
              iconName={icon}
              className={` ${size === 'sm' ? 'h-3 w-3' : ''} ${size === 'md' ? 'h-4 w-4' : ''} ${size === 'lg' ? 'h-5 w-5' : ''} ${error ? '!text-error-500' : ''} `}
            /> */}
            {prefix}
          </div>
        )}
        {suffix && (
          <div
            className={`absolute right-2 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            {/* <ReIcon
              iconName={icon}
              className={` ${size === 'sm' ? 'h-3 w-3' : ''} ${size === 'md' ? 'h-4 w-4' : ''} ${size === 'lg' ? 'h-5 w-5' : ''} ${error ? '!text-error-500' : ''} `}
            /> */}
            {suffix}
          </div>
        )}
        {!!icon ? (
          <div
            className={`absolute start-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            <ReIcon
              iconName={icon}
              className={` ${size === 'sm' ? 'h-3 w-3' : ''} ${size === 'md' ? 'h-4 w-4' : ''} ${size === 'lg' ? 'h-5 w-5' : ''} ${error ? '!text-error-500' : ''} `}
            />
          </div>
        ) : (
          ''
        )}
        {!!loading ? (
          <div
            className={`absolute end-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            <Loader
              classNames={`dark:text-muted-200
                ${color === 'muted' || color === 'mutedContrast'
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
        {/* {showErrorMessage && error ? (
          <span className="mt-0.5 block font-sans text-[0.75rem] text-error-500">{error}</span>
        ) : (
          ''
        )} */}
        {formik && <FormError formik={formik} name={props.name || ''} helperText={''} />}
      </div>
    </div>
  );
};

export default Input;
