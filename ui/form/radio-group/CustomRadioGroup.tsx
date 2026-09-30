import React, { useEffect } from 'react';
import RadioHeadless from '../radio/RadioHeadless';
import { getIn } from 'formik';
import FormError from '../../../FormError';

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
    if (options.length > 0 && !formik.values[rest.name]) {
      console.log('rest name', rest.name);
      formik.setFieldValue(rest.name, options[0].value);
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
    <div
      role="group"
      aria-labelledby="radio-group"
      className="col-span-full flex flex-col items-center justify-between font-sans"
    >
      {!!rest.label && (
        <label className="w-full font-sans text-[.85rem] text-muted-600">{rest.label}</label>
      )}
      <div className={`mt-2 flex flex-shrink-0 items-center gap-3`}>
        {options.map((option, index) => {
          const props = {
            ...rest,
            ...option
          };

          return (
            <div className="w-full" key={index}>
              <RadioHeadless
                formik={formik}
                {...props}
                checked={getIn(formik.values, rest.name) === option.value}
              />
            </div>
          );
        })}
      </div>
      <FormError name={rest.name} formik={formik} helperText={''} />
    </div>
  );
};

export default CustomRadioGroup;
