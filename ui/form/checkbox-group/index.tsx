import React from 'react';
import Checkbox from '../checkbox/Checkbox';
import FormError from '../../../FormError';

interface CheckboxGroupProps {
  label?: string;
  name: string;
  options: { label?: string; value: any; index?: number; disabled?: boolean }[];
  formik: any;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, name, options, formik }) => {
  const handleChange = (value: { label?: string; value: any }) => {
    const selectedValues = formik.values[name] || [];
    const valueToCheck = value;
    const isSelected = selectedValues.some(
      (item: { label?: string; value: any }) => item === valueToCheck
    );

    if (isSelected) {
      // Remove the value if it is already selected
      formik.setFieldValue(
        name,
        selectedValues
          .filter((item: { label?: string; value: any }) => item !== valueToCheck)
          .map((item: { label?: string; value: any }) => item)
      );
    } else {
      // Add the value if it is not selected
      formik.setFieldValue(name, [...selectedValues, value]);
    }
  };

  return (
    <div role="group" aria-labelledby="checkbox-group" className="col-span-full w-full font-sans">
      {!!label && <label className="font-sans text-[.85rem] text-muted-400">{label}</label>}
      <div className="mt-2 grid grid-cols-4 gap-4">
        {options?.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label || ''}
            value={option.value}
            checked={(formik.values[name] || []).find((value: string) => value === option.value)}
            onChange={() => handleChange(option.value)}
            onBlur={formik.handleBlur}
          />
        ))}
      </div>
      <FormError name={name} formik={formik} helperText={''} />
    </div>
  );
};

export default CheckboxGroup;
