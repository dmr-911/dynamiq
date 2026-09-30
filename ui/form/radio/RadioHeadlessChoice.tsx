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

const RadioHeadlessChoice: FC<RadioHeadlessProps> = ({
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
        {/* {children} */}
        <Card
          shape="curved"
          className="peer-checked:!bg-primary-500/10 relative h-[160px] border-2 p-2 peer-checked:!border-primary-500 peer-checked:[&>span]:!opacity-100"
        >
          {props.imageUrl ? (
            <div className="mx-auto flex h-[110px] w-[110px] flex-col rounded-md bg-muted-100 py-2 dark:bg-muted-700/70">
              <Image src={props.imageUrl} alt="" height={500} width={500} className="h-24 w-full" />
            </div>
          ) : null}

          <span className="absolute bottom-3 end-2 block opacity-0">
            <ReIcon iconName="AiFillCheckCircle" className="h-5 w-5 text-primary-500" />
          </span>
          <p className="mb-1 mt-2 inline-block w-full cursor-pointer select-none text-center font-sans text-sm text-muted-400 whitespace-nowrap">
            {label}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RadioHeadlessChoice;
