import { getYupValidation } from './getYupValidation';
import * as Yup from 'yup';

export const generateValidationSchema = (items, values, update) => {
  const buildSchema = (items, bValues) => {
    return items?.reduce((schema, item) => {
      let validator = getYupValidation(
        item?.validation?.type || 'string',
        item?.validation?.validations || {},
        item?.multiple
      );

      if (item.matches) {
        validator = validator.matches(new RegExp(item.matches), 'Invalid value');
      }

      if (item.oneOf) {
        validator = validator.oneOf([Yup.ref(item.oneOf), null], 'Passwords must match');
      }

      if (item.required) {
        validator = validator.required(`${item.label} is required`);
      }

      if (item?.requiredEnabled) {
        console.log('yup validation required enabled', item);
        const evaluateRule = (rule) => {
          const { name, operator, value } = rule || {};
          const fieldValue = values[name];

          switch (operator) {
            case 'eq':
              return fieldValue === value;
            case 'gt':
              return fieldValue > value;
            case 'lt':
              return fieldValue < value;
            case 'contains':
              return fieldValue?.includes(value);
            case 'includes':
              return value?.includes(fieldValue);
            default:
              return false;
          }
        };

        const evaluateRules = (condition, rules) => {
          return rules.reduce((acc, rule) => {
            const ruleResult = rule.rules
              ? evaluateRules(rule.condition, rule.rules) // Recursively evaluate nested rules
              : evaluateRule(rule); // Evaluate the individual rule

            if (condition === 'AND') {
              return acc && ruleResult;
            } else if (condition === 'OR') {
              return acc || ruleResult;
            }
            return acc;
          }, condition === 'AND'); // Initialize accumulator based on condition
        };

        const isValid =
          item?.requiredEnabled &&
          evaluateRules(item?.requiredEnabled?.condition, item?.requiredEnabled?.rules);

        /* The line `console.log("isValid", isValid, item.name);` is logging the values of `isValid`
        and `item.name` to the console for debugging purposes. This can help in understanding the
        flow of the code and checking the values of these variables at that specific point in the
        code execution. It can be useful for troubleshooting and verifying the logic of the
        conditional statements based on the values of `isValid` and `item.name`. */
        // console.log("isValid", isValid, item.name)
        if (!isValid) {
          return schema;
        }

        if (isValid) {
          validator = validator.required(`${item.label} is required`);
        }
      }

      // Handle repeater tag
      if (item.tag === 'repeater' && item.form.items) {
        const nestedSchema = buildSchema(item?.form?.items, bValues[item.name] || []);
        validator = validator?.of(Yup.object().shape(nestedSchema));
      }

      // Handle group tag
      if (item.tag === 'group' && item.form?.items) {
        const nestedSchema = buildSchema(item?.form?.items, bValues[item.name] || {});
        console.log('nestedSchema', nestedSchema);
        validator = Yup.object().shape(nestedSchema); // Group fields are an object
      }

      schema[item.name] = validator;
      return schema;
    }, {});
  };

  return buildSchema(items, values);
};
