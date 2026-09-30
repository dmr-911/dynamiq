import React, { useEffect, useState, type FC, type InputHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { inputVariants } from '../../variants/input-variants';
import Loader from '../../loader/Loader';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import { getIn } from 'formik';

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
  acceptFloat?: boolean;
  floatPoint?: number;
  thousandSeperator?: boolean;
  seperateWith?: string;
  suffix?: React.ReactNode;
}

const Number: FC<InputProps> = ({
  label,
  addon,
  size = 'md',
  color = 'default',
  shape = 'smooth',
  formik,
  loading = false,
  icon,
  forceError,
  className: classes = '',
  showErrorMessage = true,
  acceptFloat,
  floatPoint = 2,
  thousandSeperator = false,
  seperateWith = ',',
  type,
  suffix,
  ...props
}) => {
  let error =
    forceError ??
    ((getIn(formik?.touched, props?.name) && getIn(formik.errors, props?.name)) || false);

  const [errorClass, setErrorClass] = useState('');
  const [showValue, setShowValue] = useState<string>('');

  const handleFormatNumber = (value: any = ''): string => {
    if (!value && value !== 0) return '';

    // Convert to string and remove any existing formatting
    let numStr = String(value).replace(/[^\d.]/g, '');

    // Handle decimal places for float values
    if (acceptFloat) {
      const parts = numStr.split('.');
      if (parts[1]) {
        parts[1] = parts[1].slice(0, floatPoint);
        numStr = parts.join('.');
      }
    } else {
      numStr = numStr.split('.')[0]; // Remove decimal part for non-float values
    }

    // Add thousand separator if enabled
    if (thousandSeperator) {
      const parts = numStr.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, seperateWith);
      numStr = parts.join('.');
    }

    return numStr;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    // Remove all non-numeric characters except decimal point for processing
    let processedValue = value.replace(/[^\d.]/g, '');

    if (acceptFloat) {
      const parts = processedValue.split('.');
      if (parts[1]) {
        parts[1] = parts[1].slice(0, floatPoint);
        processedValue = parts.join('.');
      }
    } else {
      processedValue = processedValue.split('.')[0];
    }

    // Format the value for display
    const formattedDisplayValue = handleFormatNumber(processedValue);
    setShowValue(formattedDisplayValue);

    // Set the raw numeric value in formik
    if (formik && name) {
      const numericValue = parseFloat(processedValue);
      formik.setFieldValue(name, isNaN(numericValue) ? null : numericValue);
    }

    // Update error class for float validation if needed
    if (
      (acceptFloat && !processedValue?.includes('.')) ||
      (acceptFloat && floatPoint && processedValue?.split('.')[1]?.length < floatPoint) ||
      (acceptFloat && processedValue?.split('.')[1]?.length === 0)
    ) {
      setErrorClass('focus:outline-red-500');
    } else {
      setErrorClass('');
    }
  };

  // Effect to handle initial value and updates from formik
  useEffect(() => {
    if (props.name && formik?.values[props.name] !== undefined) {
      const value = formik.values[props.name];
      const formattedValue = handleFormatNumber(value);
      setShowValue(formattedValue);
    }
  }, [props.name, formik?.values[props.name]]);

  return (
    <div className="w-full">
      {!!label && (
        <label
          htmlFor={props.name}
          className="font-sans text-[.85rem] text-muted-400 dark:text-muted-300"
        >
          {label}
        </label>
      )}
      <div className={`relative w-full ${addon ? 'flex' : ''}`}>
        {!!addon && (
          <div
            className={`inline-flex cursor-pointer items-center justify-center border border-muted-200 border-e-transparent bg-muted-100 px-4 py-2 text-center text-sm leading-tight text-muted-500 dark:border-muted-800 dark:border-e-transparent dark:bg-muted-700 dark:text-muted-300 ${size === 'sm' ? 'h-8' : ''} ${size === 'md' ? 'h-10' : ''} ${size === 'lg' ? 'h-12' : ''} ${shape === 'rounded' ? 'rounded-s-md' : ''} ${shape === 'smooth' ? 'rounded-s-lg' : ''} ${shape === 'curved' ? 'rounded-s-xl' : ''} ${shape === 'full' ? 'rounded-s-full' : ''} `}
          >
            {addon}
          </div>
        )}
        <input
          type="text"
          className={inputVariants({
            size,
            color,
            shape,
            className: `peer ${classes} ${size === 'sm' && icon ? 'pe-2 ps-8' : ''} ${size === 'md' && icon ? 'pe-3 ps-10' : ''} ${size === 'lg' && icon ? 'pe-4 ps-12' : ''} ${size === 'sm' && !icon ? 'px-2' : ''} ${size === 'md' && !icon ? 'px-3' : ''} ${size === 'lg' && !icon ? 'px-4' : ''} ${error ? '!border-error-500' : ''} ${addon ? '!rounded-s-none' : ''} ${loading
              ? 'pointer-events-none !select-none !text-muted-400 !shadow-none placeholder:!text-transparent'
              : ''
              } ${errorClass}`
          })}
          {...props}
          value={showValue}
          onChange={handleChange}
          inputMode={acceptFloat ? "decimal" : "numeric"}
        />
        {suffix && (
          <div
            className={`absolute right-2 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            {suffix}
          </div>
        )}
        {!!icon && (
          <div
            className={`absolute start-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            <ReIcon
              iconName={icon}
              className={`${size === 'sm' ? 'h-3 w-3' : ''} ${size === 'md' ? 'h-4 w-4' : ''} ${size === 'lg' ? 'h-5 w-5' : ''} ${error ? '!text-error-500' : ''}`}
            />
          </div>
        )}
        {loading && (
          <div
            className={`absolute end-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            <Loader
              classNames={`dark:text-muted-200 ${color === 'muted' || color === 'mutedContrast'
                ? 'text-muted-400'
                : 'text-muted-300'
                }`}
              size={20}
              thickness={4}
            />
          </div>
        )}
        {showErrorMessage && error && (
          <span className="mt-0.5 block font-sans text-[0.75rem] text-error-500">{error}</span>
        )}
      </div>
    </div>
  );
};

export default Number;