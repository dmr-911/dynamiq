import { Item } from '../types';

export const generateInitialValues = (items: Item[]): any => {
  return items?.reduce((values, item) => {
    if (item.tag === 'repeater' && item.form?.items) {
      // For repeater, initialize it as an array with one set of initial values

      if (item.variant) {
        values[item.name] = [];
        // values[item.name] = [generateInitialValues(item.form.items)];
      } else {
        values[item.name] = [generateInitialValues(item.form.items)];
      }
    } else if (item.tag === 'group' && item.form?.items) {
      values[item.name] = generateInitialValues(item.form.items);
    } else {
      // Set default value based on the field type
      values[item.name] = getDefaultValue(item.type, item?.multiple);
    }
    return values;
  }, {});
};

export const getDefaultValue = (type?: string, multiple?: boolean): any => {
  switch (type) {
    case 'text':
    case 'textarea':
    case 'email':
      return '';
    case 'checkbox':
      return false;
    case 'select':
      switch (multiple) {
        case true:
          return [];
        default:
          return '';
      }
    case 'switch':
      return false;
    case 'object':
      return {};
    case 'number':
      return null;
    default:
      return '';
  }
};
