'use client';
import React, { useState, type FC, type InputHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { inputVariants } from '../../variants/input-variants';
import Loader from '../../loader/Loader';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import { getIn } from 'formik';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  addon?: string;
  formik?: any;
  error?: string | any;
  loading?: boolean;
  showErrorMessage?: boolean;
}

const Password: FC<InputProps> = ({
  label,
  addon,
  size = 'md',
  color = 'default',
  shape = 'smooth',
  formik,
  loading = false,
  className: classes = '',
  showErrorMessage = false,
  error: errorProp,
  ...props
}) => {
  const [strength, setStrength] = useState(0);
  const [touchError, setTouchError] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const [icon, setIcon] = useState(true);

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setShowStrength(true);
    setStrength(calculateStrength(value));
    if (calculateStrength(value) >= 5) {
      setTouchError(false);
      // setShowStrength(false);
    } else {
      setTouchError(true);
    }
    if (formik?.handleChange) {
      formik.handleChange(e);
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formik?.handleBlur) {
      formik.handleBlur(e);
    }
  };

  let error = (getIn(formik?.touched, props?.name) && getIn(formik.errors, props?.name)) || false;

  const handleIconClick = (e) => {
    e.stopPropagation();
    setIcon((prev) => !prev);
  };

  return (
    <div className="w-full">
      {!!label && (
        <label htmlFor={props.name} className="font-sans text-[.85rem] text-muted-400">
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
            className: `peer ${classes} ${size === 'sm' && icon ? 'pe-8 ps-2' : ''} ${size === 'md' && icon ? 'pe-10 ps-3' : ''} ${size === 'lg' && icon ? 'pe-12 ps-4' : ''} ${size === 'sm' && !icon ? 'px-2' : ''} ${size === 'md' && !icon ? 'px-3' : ''} ${size === 'lg' && !icon ? 'px-4' : ''} ${error || touchError ? '!border-error-500' : ''} ${addon ? '!rounded-s-none' : ''} ${
              loading
                ? 'pointer-events-none !select-none !text-transparent !shadow-none placeholder:!text-transparent'
                : ''
            } `
          })}
          {...props}
          type={!icon ? (showStrength ? 'text' : 'password') : 'password'}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div
          className={`absolute end-0 top-0 z-0 flex cursor-pointer items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          onClick={handleIconClick}
        >
          <ReIcon
            iconName={!icon ? 'FiEye' : 'FiEyeOff'}
            className={` ${size === 'sm' ? 'h-3 w-3' : ''} ${size === 'md' ? 'h-4 w-4' : ''} ${size === 'lg' ? 'h-5 w-5' : ''} ${error ? '!text-error-500' : ''} `}
          />
        </div>

        {!!loading ? (
          <div
            className={`absolute end-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
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
        {showErrorMessage && error ? (
          <span className="mt-0.5 block font-sans text-[0.75rem] text-error-500">{error}</span>
        ) : (
          ''
        )}
      </div>

      {/* Password Strength Indicator */}
      {!showErrorMessage && showStrength && (
        <div className="mt-2 flex space-x-1 md:max-w-[200px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${strength > index ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Password;
