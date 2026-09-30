import { getIn, useFormik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import Button from './ui/button/Button';
import CheckboxGroup from './ui/form/checkbox-group';
import Checkbox from './ui/form/checkbox/Checkbox';
import Input from './ui/form/input/Input';
import Number from './ui/form/number/Number';
import Password from './ui/form/password/Password';
import Phone from './ui/form/Phone/Phone';
import CustomRadioGroup from './ui/form/radio-group/CustomRadioGroup';
import RadioGroup from './ui/form/radio-group/RadioGroup';
import ComboSelect from './ui/form/select/ComboSelect';
import SelectOption from './ui/form/select/Select';
import Textarea from './ui/form/textarea/Textarea';
import { checkDependency } from './utils/checkDependency';
import { filterSubmittingValues } from './utils/filterSubmittingValues';
import { generateInitialValues } from './utils/generateInitialValues';
import { generateValidationSchema } from './utils/generateValidationSchema';
import { storeOrSendValueToApi } from './utils/storeOrSendValueToApi';
import SearchAddressWithAutocomplete from './Map/components/AutocompleteWithMap/SearchAddressWithAutocompleteForm';
import ToggleSwitch from './ui/form/toggle-switch/ToggleSwitch';
import ChoiceGroup from './ui/form/radio-group/ChoiceGroup';
import FormError from './FormError';
import IconButton from './ui/button-icon/IconButton';
import { cn } from './utils/cn';
import type {
  Item,
  FormData,
  NestedForm,
  Submit,
  Validation,
  ValidationRule,
  ValidationValidations,
  Widths,
  Dependency,
  DependencyRule,
  DependencyCondition,
  DependencyOperator,
  FieldType,
  FieldTag,
  Calculate,
  CalculationOperator,
  DynamicFormProps,
  HttpMethod,
  StorageType,
  YupSchemaType,
} from './types';

// Re-export all types from types.ts so consumers get them from the main entry
export type {
  Item,
  FormData,
  NestedForm,
  Submit,
  Validation,
  ValidationRule,
  ValidationValidations,
  Widths,
  Dependency,
  DependencyRule,
  DependencyCondition,
  DependencyOperator,
  FieldType,
  FieldTag,
  Calculate,
  CalculationOperator,
  DynamicFormProps,
  HttpMethod,
  StorageType,
  YupSchemaType,
} from './types';

interface FormikValues {
  [key: string]: Record<string, string | string[] | any[]>;
}

/** Legacy props that were previously on DynamicFormProps but are now handled via formData.submit */
interface LegacySubmitProps {
  store?: 'localStorage' | 'sessionStorage' | 'cookies';
  set_data_to_browser_store?: boolean;
  send_data_to_external_api?: boolean;
  endPoint?: string;
  method?: HttpMethod;
  key_name?: string;
}

type AllDynamicFormProps = DynamicFormProps & LegacySubmitProps;

const DynamicForm = ({
  formData,
  className,
  store,
  send_data_to_external_api,
  set_data_to_browser_store,
  endPoint,
  method,
  key_name,
  children,
  defaultValue,
  allValues = {},
  onSubmit: handleFormSubmit,
  isRealTime,
  setRealTimeValues,
  noGap = true,
}: AllDynamicFormProps) => {
  const generateSchema = useCallback((items: Item[], values: FormikValues, mode: any) => {
    return Yup.object(
      generateValidationSchema(
        items.filter((item) => !item.variant?.includes('custom') || item.type === 'HTML'),
        values,
        mode
      )
    );
  }, []);
  const [formItems, setFormItems] = useState(formData.items);
  const [validationSchema, setValidationSchema] = useState();

  const initialValues = defaultValue ?? generateInitialValues(formItems);

  const formik: {
    [x: string]: any;
    values: FormikValues;
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema as any,
    onSubmit: async (values, { setErrors, resetForm }) => {
      // if stepper form
      if (handleFormSubmit) {
        handleFormSubmit(values);
      }
      // if not stepper form
      else {
        // Execute the function if defined in submit

        if (formData?.submit?.function) {
          formData.submit?.function({
            values,
            formik,
            setErrors,
            resetForm,
            schema: validationSchema
          });
        } else {
          // for story book configuration
          if (store || set_data_to_browser_store || send_data_to_external_api || endPoint) {
            const newData = {
              store: set_data_to_browser_store && !send_data_to_external_api ? store : '', // local Storage, session Storage
              key_name: set_data_to_browser_store && !send_data_to_external_api ? key_name : '',
              endPoint: send_data_to_external_api && !set_data_to_browser_store ? endPoint : '',
              method: send_data_to_external_api && !set_data_to_browser_store ? method : 'INSERT' // UPSERT, DELETE, UPDATE
            };
            try {
              await storeOrSendValueToApi({ data: newData, values });
              // Optionally show success message or perform other actions upon successful submission
              // alert(JSON.stringify(filterSubmittingValues(values)));
            } catch (error) {
              console.error('Error submitting form data:', error);
              // Handle error state or display error message
            }
          }
          // for original data submission
          else {
            try {
              await storeOrSendValueToApi({ data: formData.submit, values });
              // Optionally show success message or perform other actions upon successful submission
              alert(JSON.stringify(filterSubmittingValues(values)));
            } catch (error) {
              console.error('Error submitting form data:', error);
              // Handle error state or display error message
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    const updateFormItems = () => {
      const updateItemsWithDependencies = (items: Item[] | any) => {
        return items?.map((item: any, index: number) => {
          item = checkDependency({
            item,
            values: formik.values,
            formik,
            allValues: Object.keys(allValues).length > 0 ? allValues : formik.values
          });

          if ((item.tag === 'repeater' || item.tag === 'group') && item?.form?.items?.length > 0) {
            item.form.items = updateItemsWithDependencies(item?.form?.items);
          }

          // Handle the calculation logic for fields with "calculate"
          if (item?.calculate) {
            const { operator, fields } = item?.calculate;
            const fieldValues = fields.map((fieldName: any) => formik.values[fieldName] || 0);

            let calculatedValue = parseFloat(fieldValues[0]); // Initialize with the first field value

            // Apply the calculation based on the operator
            for (let i = 1; i < fieldValues.length; i++) {
              switch (operator) {
                case 'addition':
                  calculatedValue += parseFloat(fieldValues[i]);
                  break;
                case 'subtraction':
                  calculatedValue -= parseFloat(fieldValues[i]);
                  break;
                case 'multiplication':
                  calculatedValue *= parseFloat(fieldValues[i]);
                  break;
                case 'division':
                  if (parseFloat(fieldValues[i]) !== 0) {
                    calculatedValue /= parseFloat(fieldValues[i]);
                  } else {
                    console.warn('Division by zero is not allowed');
                  }
                  break;
                default:
                  console.warn('Unknown operator');
              }
            }

            // Update the calculated field's value in Formik
            formik.setFieldValue(item.name, calculatedValue);
          }

          return item;
        });
      };

      const updatedItems = updateItemsWithDependencies(formItems);
      if (formik.values && Object.keys(formik.values).length > 0) {
        setValidationSchema(generateSchema(updatedItems, formik?.values, 'update') as any);
        setFormItems(updatedItems);
      }
    };

    updateFormItems();
  }, [formik?.values, defaultValue]);

  useEffect(() => {
    if (isRealTime && typeof setRealTimeValues === 'function') {
      setRealTimeValues(formik?.values);
    }
  }, [isRealTime, formik?.values]);

  const adjustWidths = (items: Item[] | any, innerWidth: number) => {
    return items?.map((item: any) => {
      if (item.widths && typeof item.widths === 'object') {
        if (innerWidth > 1440) {
          item.width = item.widths.greaterThan1440;
        } else if (innerWidth > 890 && innerWidth <= 1440) {
          item.width = item.widths.between890And1440;
        } else if (innerWidth > 600 && innerWidth <= 890) {
          item.width = item.widths.between600And890;
        } else {
          item.width = item.widths.default;
        }
      }

      // Recursively adjust widths for nested items in fieldArray
      if ((item.tag === 'repeater' || item.tag === 'group') && item.form && item.form.items) {
        item.form.items = adjustWidths(item.form.items, innerWidth);
      }

      return item;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const updatedItems = adjustWidths(formData.items, window.innerWidth);

      // const updatedItemsWithValidation = updatedItems.map((item: any) => {
      //   if (item?.depends) {
      //     const { condition, rules } = item.depends;

      //     // Recursive function to evaluate the rules
      //     const evaluateRule = (rule: any) => {
      //       const { field, operator, value } = rule;
      //       const fieldValue: any = formik?.values[field];

      //       switch (operator) {
      //         case 'eq':
      //           return fieldValue === value;
      //         case 'gt':
      //           return fieldValue > value;
      //         case 'lt':
      //           return fieldValue < value;
      //         case 'contains':
      //           return fieldValue?.includes(value);
      //         default:
      //           return false;
      //       }
      //     };

      //     const evaluateRules = (condition: any, rules: any) => {
      //       return rules.reduce((acc: any, rule: any) => {
      //         const ruleResult = rule.rules
      //           ? evaluateRules(rule.condition, rule.rules) // Recursively evaluate nested rules
      //           : evaluateRule(rule); // Evaluate the individual rule

      //         if (condition === 'AND') {
      //           return acc && ruleResult;
      //         } else if (condition === 'OR') {
      //           return acc || ruleResult;
      //         }
      //         return acc; // Default case, should not be reached
      //       }, condition === 'AND'); // Initialize accumulator based on condition
      //     };

      //     const isValid = evaluateRules(condition, rules);

      //     if (!isValid) {
      //       return { ...item, hidden: true }; // removed required : false
      //     }
      //     return { ...item, hidden: false }; // removed required : true
      //   }
      //   return item;
      // });
      const updateItemsWithDependencies = (items: Item[] | any) => {
        return items?.map((item: any, index: number) => {
          item = checkDependency({
            item,
            values: formik.values,
            formik,
            allValues: Object.keys(allValues).length > 0 ? allValues : formik.values
          });

          if ((item.tag === 'repeater' || item.tag === 'group') && item?.form?.items?.length > 0) {
            item.form.items = updateItemsWithDependencies(item?.form?.items);
          }

          // Handle the calculation logic for fields with "calculate"
          if (item?.calculate) {
            const { operator, fields } = item?.calculate;
            const fieldValues = fields.map((fieldName: any) => formik.values[fieldName] || 0);

            let calculatedValue = parseFloat(fieldValues[0]); // Initialize with the first field value

            // Apply the calculation based on the operator
            for (let i = 1; i < fieldValues.length; i++) {
              switch (operator) {
                case 'addition':
                  calculatedValue += parseFloat(fieldValues[i]);
                  break;
                case 'subtraction':
                  calculatedValue -= parseFloat(fieldValues[i]);
                  break;
                case 'multiplication':
                  calculatedValue *= parseFloat(fieldValues[i]);
                  break;
                case 'division':
                  if (parseFloat(fieldValues[i]) !== 0) {
                    calculatedValue /= parseFloat(fieldValues[i]);
                  } else {
                    console.warn('Division by zero is not allowed');
                  }
                  break;
                default:
                  console.warn('Unknown operator');
              }
            }

            // Update the calculated field's value in Formik
            formik.setFieldValue(item.name, calculatedValue);
          }

          return item;
        });
      };

      const updatedItemsWithValidation = updateItemsWithDependencies(formData.items);

      setFormItems(updatedItemsWithValidation);
      setValidationSchema(generateSchema(updatedItemsWithValidation, formik?.values, 'initial') as any);
    };

    handleResize(); // Initial setup

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddFieldArrayItem = (name: string, items: Item[]) => {
    const newFieldArrayItem = generateInitialValues(items);
    formik.setFieldValue(name, [...getIn(formik.values, name), newFieldArrayItem]);
  };

  const handleRemoveFieldArrayItem = (name: string, index: number) => {
    const fieldArray: any = [...getIn(formik.values, name)];
    fieldArray.splice(index, 1);
    formik.setFieldValue(name, fieldArray);
  };

  const [isOpen, setOpen] = useState(false);
  const addItem = (name = '', newItem: any) => {
    formik.setFieldValue(name, [...(formik.values?.[name] as any), newItem]);
    setOpen(false);
  };

  const renderRepeaterField = ({
    item,
    itemName,
    formik,
    handleRemoveFieldArrayItem,
    handleAddFieldArrayItem
  }: {
    item: Item | any;
    itemName: string;
    formik: any;
    handleRemoveFieldArrayItem: (name: string, index: number) => void;
    handleAddFieldArrayItem: (name: string, items: Item[]) => void;
  }) => {
    const splittedWidth = item?.width?.split('%')?.[0];
    const gridSingleColumnWidth = 100 / formData?.grid;

    const gridColsDecorator = () => {
      const colsToSpan = splittedWidth / gridSingleColumnWidth;

      return Math.ceil(colsToSpan);
    };

    return (
      <div
        key={item.id || `${Math.random() * 1000 + new Date().getTime()}`}
        style={{
          display: 'grid!important',
          gridColumn: `span ${gridColsDecorator()}`
        }}
        className="field-array-wrapper col-span-full space-y-3 rounded-md border border-muted-300 bg-primary-50 p-4 dark:rounded-md dark:border-muted-700 dark:bg-muted-800/65 dark:backdrop-blur-sm"
      >
        <p className="font-semibold text-muted-400 dark:text-muted-300">{item.label}</p>
        {(getIn(formik.values, itemName) || [])?.map((fieldItem: Item, index: number) => {
          const fieldName = `${itemName}[${index}]`;
          // Apply checkDependency for the current field item
          const updatedItem: any = checkDependency({
            item,
            values: formik.values,
            formik,
            index,
            allValues: Object.keys(allValues).length > 0 ? allValues : formik.values
          });

          if (updatedItem?.hidden) return null; // Skip rendering if hidden

          return (
            <div key={index} className="flex items-center gap-2">
              <div className="w-full rounded-md border border-muted-300 p-2 shadow-md dark:border-muted-700">
                {renderFields({
                  items:
                    [...item?.form.items]
                      ?.sort((a, b) => a.index - b.index)
                      .map((item) => ({ ...item, label: `${item.label} #${index + 1}` })) || [],
                  parentName: `${itemName}[${index}]`,
                  index
                })}
              </div>
              {getIn(formik.values, itemName).length > 1 ? (
                <IconButton
                  type="button"
                  onClick={() => handleRemoveFieldArrayItem(itemName, index)}
                  // className="w-8"
                  color="error"
                  variant="pastel"
                  size="sm"
                >
                  ×
                </IconButton>
              ) : null}
            </div>
          );
        })}

        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddFieldArrayItem(itemName, item?.form.items);
          }}
          className="mt-4 p-2"
          color="primary"
        >
          Add {item.placeholder}
        </Button>
      </div>
    );
  };

  // render group fields
  const renderGroupField = ({
    item,
    itemName,
    formik
  }: {
    item: Item | any;
    itemName: string;
    formik: any;
  }) => {
    const splittedWidth = item?.form?.width?.split('%')?.[0];
    const gridSingleColumnWidth = 100 / item.form?.grid;

    const gridColsDecorator = () => {
      const colsToSpan = splittedWidth / gridSingleColumnWidth;

      return Math.ceil(colsToSpan);
    };

    return (
      <div
        key={item.index}
        style={{}}
        className="group-array-wrapper col-span-full grid gap-2 rounded-md border bg-primary-50 p-4 dark:rounded-md dark:border dark:border-white dark:bg-primary"
      >
        {/* <p className="col-span-full font-semibold text-gray-600">{item.label}</p> */}

        {renderFields({
          items: [...item?.form?.items]?.sort((a, b) => a.index - b.index) || [],
          parentName: itemName
        })}
      </div>
    );
  };

  // Sort items by index for grid layout

  const renderFields = useMemo(() => {
    return ({
      items,
      parentName = '',
      index = null
    }: {
      items: Item[] | any;
      parentName?: string;
      index?: number | null;
    }) => {
      return items?.map((item: Item | any, i: number) => {
        if (item?.hidden) return null;

        const itemName = parentName ? `${parentName}.${item?.name}` : item?.name;
        const splittedWidth = item?.width?.split('%')?.[0];
        const gridSingleColumnWidth = 100 / formData?.grid;

        const gridColsDecorator = () => {
          const colsToSpan = splittedWidth / gridSingleColumnWidth;
          return Math.ceil(colsToSpan);
        };

        const { widths, depends, validation, width, required, matches, index, oneOf, ...rest } =
          item || {};

        if (item.tag === 'repeater' && !item.variant) {
          // Evaluate dependencies
          return renderRepeaterField({
            item,
            itemName,
            formik,
            handleRemoveFieldArrayItem,
            handleAddFieldArrayItem
          });
        } else if (item.tag === 'repeater' && item.variant) {
          return (
            <InputRenderrer
              key={item.variant + item.name + i}
              {...rest}
              suggested="current-password"
              name={itemName}
              oldFormik={formik}
              item={item}
              addItem={addItem}
              open={isOpen}
              setOpen={setOpen}
              {...(item.type === 'headless-radio' && { defaultValue: item.value })}
            />
          );
        }

        if (item.tag === 'group' && !item.variant) {
          // Evaluate dependencies
          return renderGroupField({
            item,
            itemName,
            formik
          });
        }

        const touched = getIn(formik.touched, itemName);
        const error = getIn(formik.errors, itemName);
        const showError = touched && error;

        // console.log('grid cols decorator', gridColsDecorator());
        return (
          !item?.hidden && (
            <div
              key={item?.id || `${Math.random() * 1000 + new Date().getTime()} + ${i}`}
              style={{
                gridColumn: `span ${gridColsDecorator()}`,
                overflow: item.type === 'select' && item.multiple ? 'visible' : 'hidden'
                // margin: '0 0'
              }}
            >
              {item.type === 'HTML' ? (
                <div>{item?.children}</div>
              ) : (
                <InputRenderrer
                  {...rest}
                  autoComplete="current-password"
                  name={itemName}
                  value={getIn(formik.values, itemName)}
                  formik={formik}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                  error={getIn(formik?.errors, itemName) && getIn(formik?.touched, itemName)}
                  {...(item.type === 'headless-radio' && { defaultValue: item.value })}
                />
              )}
            </div>
          )
        );
      });
    };
  }, [
    formik.values,
    formData?.grid,
    handleRemoveFieldArrayItem,
    handleAddFieldArrayItem,
    addItem,
    isOpen,
    setOpen
  ]);

  const sortedItems = [...formItems]?.sort((a, b) => a.index - b.index);

  // console.log('sorted items', formik.errors, formik.values);
  return (
    <form onSubmit={formik?.handleSubmit} autoComplete="off">
      <div
        className={cn(`relative grid w-full ${!noGap && 'px-4 py-3'} `, className && className)}
        style={{
          gridTemplateColumns: `repeat(${formData.grid || 1}, 1fr)`,
          gap: '0.5rem',
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
        {renderFields({ items: sortedItems, parentName: undefined })}
      </div>
      {children}
    </form>
  );
};

export default DynamicForm;

export const InputRenderrer = (input: any) => {
  const [isOpen, setOpen] = useState(false);
  const { type, ...rest } = input || {};
  switch (type) {
    case 'email':
      return <Input type="email" {...rest} autoComplete="new-password" />;
    case 'password':
      // return <Input type="password" {...rest} />;
      // return <Input type="password" {...rest} />;
      return <Password type="password" {...rest} autoComplete="new-password" />;
    case 'phone':
      return <Phone {...rest} />;
    case 'number':
      return <Number type="number" {...rest} />;
    // case 'select':
    //   return <Select {...rest} />;

    case 'document-editor':
      return (
        <div>
          <label htmlFor={rest?.name} className="truncate font-sans text-[.85rem] text-muted-400">
            {rest?.label}
          </label>
          <textarea
            className="w-full rounded border p-2"
            defaultValue={rest?.value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              rest.formik.setFieldValue(rest.name, e);
            }}
          />
        </div>
      );

    case 'file':
      return (
        <>
          <div className="col-span-full mx-auto rounded-md">
            <div className="flex justify-between">
              {/* Description */}
              <div className="flex flex-col gap-0">
                <p className="col-span-10 text-muted-500 dark:text-muted-200">
                  Select Media <span className="text-red-500">*</span>
                </p>
                <span className="text-xs text-muted-400">
                  Allowed Format {rest?.acceptedFileTypes?.join(', ')}
                </span>
              </div>

              {/* Button */}
              <Button
                type="button"
                color="primary"
                onClick={() => {
                  setOpen(!isOpen);
                }}
                className="flex h-10 items-center rounded bg-blue-500 px-4 font-bold text-white hover:bg-blue-700"
              >
                <span>Upload</span>
              </Button>
            </div>
          </div>

          <input
            type="file"
            multiple={rest?.multiple}
            accept="image/png,image/jpeg,application/pdf"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (files) {
                rest.formik.setFieldValue(rest.name, files);
              }
            }}
          />
          <FormError formik={rest.formik} name={rest.name} helperText={``} />
        </>
      );
    case 'file-manager':
      return;

    case 'textarea':
      return <Textarea autoComplete="new-password" {...rest} />;
    case 'switch':
      return <ToggleSwitch checked={getIn(rest.formik.values, rest.name)} {...rest} />;
    case 'checkbox':
      return <Checkbox checked={getIn(rest.formik.values, rest.name)} {...rest} />;

    case 'select':
      switch (rest.multiple) {
        case true:
          return (
            <>
              <ComboSelect
                label={rest.label}
                placeholder={rest.placeholder}
                options={rest.options}
                floating={true}
                {...rest}
                onChange={(value) => {
                  // setSelectedRole(value);
                  // handleChange('selectedRole');
                  rest.formik.setFieldValue(rest.name, value);
                }}
                value={getIn(rest.formik.values, rest.name)}
                multiple
                // floating={true}
                error={rest.formik.errors[rest.name]}

              // onBlur={() => handleBlur('selectedRole')}
              />
              <FormError name={rest.name} formik={rest.formik} helperText={``} />
            </>
          );

        case false:
          return (
            <>
              <ComboSelect
                label={rest.label}
                floating={true}
                name={rest.name}
                id={rest.id}
                placeholder={rest.placeholder}
                options={rest.options}
                multiple={true}
                {...rest}
                onChange={(value: any) => {
                  rest.formik.setFieldValue(rest.name, value?.value);
                }}
                {...(getIn(rest.formik.values, rest.name) && {
                  value: {
                    label: rest?.options?.find(
                      (field: any) => field?.value === rest.formik.values[rest.name]
                    )?.label,
                    value: getIn(rest.formik.values, rest.name)
                  }
                })}
                error={
                  getIn(rest.formik.errors, rest.name) && getIn(rest.formik.touched, rest.name)
                    ? getIn(rest.formik.errors, rest.name)
                    : null
                }
                onBlur={rest.formik.handleBlur}

              // onBlur={() => handleBlur('selectedRole')}
              />
              <FormError name={rest.name} formik={rest.formik} helperText={``} />
            </>
          );

        default:
          return <SelectOption error={getIn(rest.formik.errors, rest.name)} {...rest} />;
      }

    case 'radio-group':
      const { variant, ...props } = rest;
      switch (variant) {
        case 'custom':
          return <CustomRadioGroup {...props} />;
        case 'choice-group':
          return <ChoiceGroup {...props} />;
        default:
          return <RadioGroup {...props} />;
      }
    case 'checkbox-group':
      return <CheckboxGroup {...rest} />;

    case 'signature':
      return <input type="text" {...rest} placeholder="Signature" />;

    case 'initials':
      return <input type="text" {...rest} placeholder="Initials" />;

    default:
      switch (input.variant) {
        case 'address-autocomplete':
          return (
            <>
              <SearchAddressWithAutocomplete
                label={rest?.label}
                errors={rest?.formik?.errors}
                name={rest?.name}
                formik={rest?.formik}
                withMap={rest?.withMap}
                onChange={(values, fullAddress) => {
                  if (values?.latitude) {
                    // Only update if the new values are different
                    Object.keys(values || {}).forEach((key) => {
                      if (rest?.formik?.values?.[key] !== values[key]) {
                        rest?.formik?.setFieldValue(key, values[key]);
                      }
                    });
                  }

                  // Set the full address if it exists and is different
                  if (fullAddress && rest?.formik?.values?.[rest.name] !== fullAddress) {
                    rest.formik.setFieldValue(rest.name, fullAddress);
                  }
                }}
                error={rest?.formik?.errors?.[rest?.name] && rest?.formik?.touched?.[rest?.name]}
                onBlur={rest?.formik?.handleBlur}
                defaultValue={rest?.formik?.values?.[rest?.name]}
              />
              <FormError name={rest?.name} formik={rest?.formik} helperText={``} />
            </>
          );

        default:
          return <Input type={type} {...rest} autoComplete="new-password" />;
      }
  }
};
