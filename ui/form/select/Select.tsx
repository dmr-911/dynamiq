/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, type FC, type SelectHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { selectVariants } from '../../variants/select-variants';
import Loader from '../../loader/Loader';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import FormError from '../../../FormError';

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  index?: number;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'color'>,
    VariantProps<typeof selectVariants> {
  label?: string | boolean;
  icon?: string;
  error?: string;
  loading?: boolean;
  options?: Option[];
  availableDataAPI?: string;
  containerClasses?: string;
  formik?: any;
}

const Select: FC<SelectProps> = ({
  label,
  options = [],
  icon,
  color = 'default',
  shape,
  size = 'md',
  error,
  loading = false,
  className: classes = '',
  containerClasses = '',
  availableDataAPI,
  formik,
  ...props
}) => {
  // console.log('error in select', error);
  const [updatedOptions, setUpdatedOptions] = useState<Option[]>(options);

  // const error = "hello world!";
  useEffect(() => {
    if (formik) {
      if (formik.values[props.name]) {
        // console.log('formik values',);
      } else {
        if (availableDataAPI && options.length === 0) {
          fetch(availableDataAPI)
            .then((response) => response.json())
            .then((data) => {
              const fetchedOptions = data.map((d: any) => ({
                label: d.username,
                value: d.username
              }));
              setUpdatedOptions(fetchedOptions);

              if (formik && fetchedOptions.length > 0) {
                formik.setFieldValue(props.name, fetchedOptions[0].value);
              }
            });
        } else if (options.length > 0) {
          formik.setFieldValue(props.name, options[0]?.value);
        }
      }
    }
    // }
  }, []);

  // console.log('formik value', formik.values);
  return (
    <div className={`w-full font-sans ${containerClasses}`}>
      {!!label && (
        <label className="font-sans text-[.85rem] text-muted-400 dark:text-muted-300">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`group relative inline-block w-full after:pointer-events-none after:absolute after:end-[1.125em] after:top-1/2 after:z-[4] after:block after:h-[.625em] after:w-[.625em] after:rounded-[2px] after:border-b-[3px] after:border-s-[3px] after:border-muted-400 after:transition-all after:duration-300 after:content-[''] after:[transform:scale(0.8)_rotate(-45deg)] focus-within:after:[transform:scale(0.8)_rotate(-225deg)] ${size === 'sm' ? 'after:-mt-[.4575em] focus-within:after:top-[60%]' : ''} ${size === 'md' ? 'after:-mt-[.4575em] focus-within:after:top-[60%]' : ''} ${size === 'lg' ? 'after:-mt-[.4575em] focus-within:after:top-[60%]' : ''} ${loading ? 'pointer-events-none after:!border-transparent' : ''} `}
        >
          <select
            className={selectVariants({
              size,
              color,
              shape,
              className: `peer ${classes} ${size === 'sm' && icon ? '!py-1 ps-8' : ''} ${size === 'md' && icon ? 'ps-10' : ''} ${size === 'lg' && icon ? 'ps-12' : ''} ${size === 'sm' && !icon ? '!py-1 !pt-1.5 ps-2' : ''} ${size === 'md' && !icon ? 'ps-3' : ''} ${size === 'lg' && !icon ? 'ps-4' : ''} ${error ? '!border-error-500' : ''} ${loading ? '!select-none !text-transparent !shadow-none' : ''}`
            })}
            {...props}
            // {...(formik.values[props.name] && { value: formik.values[props.name] })}
          >
            {updatedOptions.map((opt, i) => (
              <option key={i} value={opt.value} disabled={opt?.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {!!icon && (
          <div
            className={`absolute start-0 top-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 ${size === 'sm' ? 'h-8 w-8' : ''} ${size === 'md' ? 'h-10 w-10' : ''} ${size === 'lg' ? 'h-12 w-12' : ''}`}
          >
            <ReIcon
              iconName={icon}
              className={` ${size === 'sm' ? 'h-3 w-3' : ''} ${size === 'md' ? 'h-4 w-4' : ''} ${size === 'lg' ? 'h-5 w-5' : ''} ${error ? '!text-error-500' : ''} `}
            />
          </div>
        )}
        {!!loading && (
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
        )}
        {/* {!!error && (
          <span className="text-red-500 mt-0.5 block font-sans text-[0.75rem]">{error}</span>
        )} */}
        <div className="mt-0.5 font-sans">
          <FormError formik={formik} name={props.name} helperText={''} />
        </div>
      </div>
    </div>
  );
};

export default Select;
