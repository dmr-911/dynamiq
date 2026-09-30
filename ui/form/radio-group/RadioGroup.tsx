import React, { useEffect } from 'react';
import Radio from '../radio/Radio';
import FormError from '../../../FormError';

interface RadioGroupProps {
  label?: string;
  name: string;
  options: { label?: string; value: any }[];
  formik: any;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, formik, ...rest }) => {
  useEffect(() => {
    if (options.length > 0 && !formik.values[name]) {
      formik?.setFieldValue(name, options[0].value);
    }
  }, [formik, name, options]);

  return (
    <div
      role="group"
      aria-labelledby="radio-group"
      className="flex w-full items-center gap-4 font-sans"
    >
      {!!label && <label className="font-sans text-[.85rem] text-muted-400">{label}</label>}
      <div className="flex items-center gap-2">
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label || ''}
            type="radio"
            name={name}
            value={option.value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={
              typeof formik.values[name] === 'string'
                ? formik.values[name] === option?.value
                : formik.values[name]
            }
            // {...rest}
          />
        ))}
      </div>
      <FormError name={name} formik={formik} helperText={''} />
    </div>
  );
};

export default RadioGroup;
