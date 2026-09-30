import * as Yup from 'yup';

type ValidationRules = {
  required?: string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  oneOf?: { field_name: string; message: string };
  email?: string;
  matches?: { regex: RegExp; message: string };
  length?: number;
  min?: number;
  max?: number;
  lessThan?: number;
  moreThan?: number;
  positive?: boolean;
  negative?: boolean;
  [key: string]: any;
};

type SchemaType = 'string' | 'number' | 'array' | 'object' | 'boolean' | 'date' | 'datetime-local';

Yup.addMethod(Yup.string, 'maxWords', function (maxWords, message) {
  return this.test('maxWords', message || `Text cannot exceed ${maxWords} words`, function (value) {
    if (!value) return true; // Handle empty/undefined values

    // Remove extra whitespace and split by spaces to count words
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount <= maxWords;
  });
});

export const getYupValidation = (
  schemaType: SchemaType,
  validation: ValidationRules,
  multiple?: boolean
) => {
  let validator:
    | Yup.StringSchema<string | undefined, object>
    | Yup.NumberSchema<number | undefined, object>
    | Yup.ArraySchema<any, object>
    | Yup.ObjectSchema<object | undefined, object, {}, ''>
    | Yup.BooleanSchema<boolean | undefined, object>
    | Yup.DateSchema<Date | undefined, object>;

  switch (schemaType) {
    case 'string':
      validator = Yup.string();
      break;
    case 'number':
      validator = Yup.number();
      break;
    case 'array':
      validator = Yup.array();
      break;
    case 'object':
      validator = Yup.object();
      break;
    case 'boolean':
      validator = Yup.boolean();
      break;
    case 'datetime-local':
    case 'date':
      validator = Yup.date();
      break;
    default:
      validator = Yup.string();
  }

  Object.entries(validation).forEach(([rule, value]) => {
    switch (rule) {
      case 'required':
        validator = validator.required(value as string);
        break;
      case 'minLength':
        validator = (validator as Yup.StringSchema).min(
          (value as { value: number; message: string }).value,
          (value as { value: number; message: string }).message
        );
        break;
      case 'maxLength':
        validator = (validator as Yup.StringSchema).max(
          (value as { value: number; message: string }).value,
          (value as { value: number; message: string }).message
        );
        break;
      case 'oneOf':
        if (schemaType === 'object') {
          const options = (value as { value: { label: string; value: string }[] }).value;
          validator = validator.test(
            'one-of',
            (value as { message: string }).message,
            function (value) {
              return options.some(
                (option) => option.value === value?.value && option.label === value?.label
              );
            }
          );
        } else {
          validator = validator.oneOf(
            [Yup.ref((value as { field_name: string; message: string }).field_name), null],
            (value as { field_name: string; message: string }).message
          );
        }
        break;
      case 'notOneOf':
        if (schemaType === 'object') {
          const options = (value as { value: { label: string; value: string }[] }).value;
          validator = validator.test(
            'not-one-of',
            (value as { message: string }).message,
            function (value) {
              return !options.some(
                (option) => option.value === value?.value && option.label === value?.label
              );
            }
          );
        } else {
          validator = validator.notOneOf(
            [Yup.ref((value as { field_name: string; message: string }).field_name), null],
            (value as { field_name: string; message: string }).message
          );
        }
        break;
      case 'email':
        validator = (validator as Yup.StringSchema).email(value as string);
        break;
      case 'matches':
        validator = (validator as Yup.StringSchema).matches(
          (value as { regex: RegExp; message: string }).regex,
          (value as { regex: RegExp; message: string }).message
        );
        break;
      case 'length':
        validator = (validator as Yup.StringSchema).length(value as number);
        break;
      case 'min':
        if (schemaType === 'datetime-local') {
          console.log('schema type', schemaType, value);
          validator = (validator as Yup.NumberSchema).min(
            Yup.ref((value as { field_name: string; message: string }).field_name),
            // (value as { value: number; message: string }).value,
            (value as { value: number; message: string }).message
          );
        } else {
          validator = (validator as Yup.StringSchema).min(
            (value as { value: number; message: string }).value,
            (value as { value: number; message: string }).message
          );
        }
        break;
      case 'max':
        validator = (validator as Yup.NumberSchema).max(
          (value as { value: number; message: string }).value,
          (value as { value: number; message: string }).message
        );
        break;
      case 'maxWords':
        console.log('maxWords', validator);
        validator = (validator as Yup.StringSchema).maxWords(
          (value as { value: number; message: string }).value,
          (value as { value: number; message: string }).message
        );

        break;
      case 'lessThan':
        validator = (validator as Yup.NumberSchema).lessThan(
          (value as { value: number; message: string }).value,
          (value as { value: number; message: string }).message
        );
        break;
      // case 'moreThan':
      //   validator = (validator as Yup.NumberSchema).moreThan(
      //     (value as { value: number; message: string }).value,
      //     (value as { value: number; message: string }).message
      //   );
      //   break;
      case 'positive':
        validator = (validator as Yup.NumberSchema).positive(
          (value as { value: boolean; message: string }).value,
          (value as { value: boolean; message: string }).message
        );
        break;
      case 'negative':
        validator = (validator as Yup.NumberSchema).negative(
          (value as { value: boolean; message: string }).value,
          (value as { value: boolean; message: string }).message
        );
        break;

      case 'when':
        validator = (validator as Yup.DateSchema).when(
          value.field_name,
          (eventStartDate, Yup) =>
            eventStartDate && Yup.min(eventStartDate, 'End date cant be before Start date')
        );

      case 'moreThan':
        validator = (validator as Yup.NumberSchema).moreThan(
          Yup.ref((value as { field_name: string; message: string }).field_name),
          (value as { field_name: string; message: string }).message
        );
        break;
      default:
        break;
    }
  });

  return validator;
};

// export const getYupValidation = (
//   schemaType: SchemaType,
//   validation: ValidationRules,
//   multiple?: boolean
// ) => {
//   let validator:
//     | Yup.StringSchema<string | undefined, object>
//     | Yup.NumberSchema<number | undefined, object>
//     | Yup.ArraySchema<any, object>
//     | Yup.ObjectSchema<object | undefined, object, {}, ''>
//     | Yup.BooleanSchema<boolean | undefined, object>;

//   // Initialize schema based on the provided schemaType
//   switch (schemaType) {
//     case 'string':
//       validator = Yup.string();
//       break;
//     case 'number':
//       validator = Yup.number();
//       break;
//     case 'array':
//       validator = Yup.array();
//       break;
//     case 'object':
//       validator = Yup.object();
//       break;
//     case 'boolean':
//       validator = Yup.boolean();
//       break;
//     default:
//       validator = Yup.string();
//   }

//   // Loop through the validation rules and apply them to the validator
//   Object.entries(validation)?.forEach(([rule, value]) => {
//     switch (rule) {
// case 'required':
//   validator = validator.required((value as { message: string }).message);
//   break;

// case 'minLength':
//   validator = (validator as Yup.StringSchema).min(
//     (value as { value: number }).value,
//     (value as { message: string }).message
//   );
//   break;

// case 'maxLength':
//   validator = (validator as Yup.StringSchema).max(
//     (value as { value: number }).value,
//     (value as { message: string }).message
//   );
//   break;

// case 'min':
//   if (schemaType === 'number') {
//     validator = (validator as Yup.NumberSchema).min(
//       (value as { value: number }).value,
//       (value as { message: string }).message
//     );
//   } else if (schemaType === 'array') {
//     validator = (validator as any).min(
//       (value as { value: number }).value,
//       (value as { message: string }).message
//     );
//   }
//   break;

// case 'max':
//   if (schemaType === 'number') {
//     validator = (validator as Yup.NumberSchema).max(
//       (value as { value: number }).value,
//       (value as { message: string }).message
//     );
//   } else if (schemaType === 'array') {
//     validator = (validator as any).max(
//       (value as { value: number }).value,
//       (value as { message: string }).message
//     );
//   }
//   break;

// case 'oneOf':
//   validator = validator.oneOf(
//     (value as { options: any[] }).options,
//     (value as { message: string }).message
//   );
//   break;

// case 'email':
//   validator = (validator as Yup.StringSchema).email((value as { message: string }).message);
//   break;

// case 'matches':
//   validator = (validator as Yup.StringSchema).matches(
//     (value as { regex: RegExp }).regex,
//     (value as { message: string }).message
//   );
//   break;

// case 'lessThan':
//   validator = (validator as Yup.NumberSchema).lessThan(
//     (value as { value: number }).value,
//     (value as { message: string }).message
//   );
//   break;

// case 'moreThan':
//   validator = (validator as Yup.NumberSchema).moreThan(
//     (value as { value: number }).value,
//     (value as { message: string }).message
//   );
//   break;

// case 'positive':
//   validator = (validator as Yup.NumberSchema).positive(
//     (value as { message: string }).message
//   );
//   break;

// case 'negative':
//   validator = (validator as Yup.NumberSchema).negative(
//     (value as { message: string }).message
//   );
//   break;

// default:
//   break;
//     }
//   });

//   // Return the finalized Yup schema
//   return validator;
// };
