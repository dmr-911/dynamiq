import { cn } from '../../../utils/cn';
import React, { ChangeEvent, type FC } from 'react';
import Card from '../../card/Card';
import Image from 'next/image';
import { ReIcon } from '../../../components/ReIcon/ReIcon';

interface RadioHeadlessProps extends React.HTMLProps<HTMLInputElement> {
  id?: string;
  label?: string;
  name?: string;
  checked?: boolean;
  children?: React.ReactNode;
  formik?: any;
  onChange?: any;
  selfSubmit?: boolean;
  disabled?: boolean;
  imageUrl?: string;
}

const RadioHeadless: FC<RadioHeadlessProps> = ({
  id,
  checked,
  label,
  name,
  children,
  formik,
  selfSubmit,
  onChange,
  ...props
}) => {
  const handleClick = (event: any) => {
    if (!props.disabled) {
      if (formik) {
        formik.handleChange(event);
        if (selfSubmit) {
          formik.submitForm();
        }
      } else {
        onChange && onChange();
      }
    }
  };
  return (
    <div
      className={`group/radio-headless relative w-full ${props.disabled ? 'cursor-not-allowed' : ''}`}
    >
      {/* {label ? (
        <label className="mb-1 inline-block cursor-pointer select-none font-sans text-sm text-muted-400">
          {label}
        </label>
      ) : (
        ''
      )} */}
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          value={props.defaultValue || props.value}
          onClick={handleClick}
          className={cn(
            'peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0',
            props.disabled ? 'cursor-not-allowed' : ''
          )}
        />
        <Card
          shape="curved"
          className="peer-checked:!bg-primary-500/10 relative flex items-center justify-center gap-2 p-2 peer-checked:!border-primary-500 peer-checked:[&>span]:!opacity-100"
        >
          <span className="opacity-20">
            <ReIcon iconName="AiFillCheckCircle" className="text-base text-primary-500" />
          </span>

          <span className="whitespace-nowrap text-sm font-normal capitalize text-muted-600 dark:text-muted-100">
            {label}
          </span>
        {children}
        </Card>

      </div>
    </div>
  );
};

export default RadioHeadless;
