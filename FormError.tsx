import React from 'react';
import { getIn } from 'formik';

const FormError = ({
  formik,
  name,
  helperText,
  customError
}: {
  formik: any;
  name: string;
  helperText: any;
  customError?: string;
}) => {
  return (
    <div
      className={` ${getIn(formik?.errors, name) && getIn(formik?.touched, name) ? 'mt-1' : ''}`}
    >
      {' '}
      {customError ? (
        <p className="text-xs text-error">{getIn(formik?.errors, name)}</p>
      ) : getIn(formik?.errors, name) && getIn(formik?.touched, name) ? (
        <p className="text-xs text-error">{getIn(formik?.errors, name)}</p>
      ) : (
        helperText
      )}
    </div>
  );
};

export default FormError;
