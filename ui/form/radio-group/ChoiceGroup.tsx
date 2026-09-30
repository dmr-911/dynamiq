import React, { useEffect } from 'react';
import { getIn } from 'formik';
import FormError from '../../../FormError';
import RadioHeadlessChoice from '../radio/RadioHeadlessChoice';

interface RadioGroupProps {
  label?: string;
  name: string;
  options: { label?: string; value: any }[];
  formik?: any;
  openModal?: any;
  radioGrid?: number;
  type?: string;
}

const CustomRadioGroup: React.FC<RadioGroupProps> = ({ options, openModal, formik, ...rest }) => {
  useEffect(() => {
    if (options.length > 0 && !formik?.values[rest.name]) {
      formik?.setFieldValue(rest.name, options[0].value);
    }
  }, []);

  const radioGridCalc = () => {
    if (rest.radioGrid) {
      return `grid-cols-${rest.radioGrid}`;
    } else {
      return 'grid-cols-2';
    }
  };

  return (
    <div role="group" aria-labelledby="radio-group" className="w-full font-sans">
      {!!rest.label && (
        <label className="font-sans text-[.85rem] text-muted-400">{rest.label}</label>
      )}
      <div className={`mt-2 grid gap-2 ${radioGridCalc()}`}>
        {options.map((option, index) => {
          const props = {
            ...rest,
            ...option
          };

          return (
            <RadioHeadlessChoice
              key={index}
              formik={formik}
              {...props}
              checked={getIn(formik.values, rest.name) === option.value}
            />
          );
        })}
      </div>
      <FormError name={rest.name} formik={formik} helperText={''} />
    </div>
  );
};

export default CustomRadioGroup;
