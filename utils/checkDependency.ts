// import { getIn } from 'formik';
// import { Item } from '../DynamicForm';
// // Helper function to resolve nested field values from a string path (e.g., 'owners[0].marital_status')
// const getFieldValue = (obj: any = {}, path: string = '') => {
//   return path
//     .split(/[.[\]]+/)
//     .filter(Boolean)
//     .reduce((acc, part) => acc && acc[part], obj);
// };

// export const checkDependency = ({
//   item,
//   values,
//   formik,
//   allValues,
//   index
// }: {
//   item: Item;
//   values: any;
//   formik?: any;
//   index?: number;
//   allValues?: any;
// }) => {
//   if (item?.depends) {
//     const { condition, rules } = item.depends;

//     const evaluateRule = (rule: any) => {
//       const { name, operator, value } = rule;

//       const fieldPath = name.replace('${index}', index);

//       // const dependentValue = values[name];
//       // const dependentValue = getIn(formik.values, fieldPath);

//       const dependentValue =
//         name?.includes('.') && !name?.includes('${index}')
//           ? getFieldValue(allValues, name)
//           : getIn(formik.values, fieldPath);

//       switch (operator) {
//         case 'eq':
//           return dependentValue === value;
//         case 'gt':
//           return dependentValue > value;
//         case 'includes':
//           return typeof dependentValue === 'string' && dependentValue.includes(value);
//         // Add more operators as needed
//         default:
//           return false;
//       }
//     };

//     const isValid = rules.reduce((acc: boolean, rule: any) => {
//       const ruleResult = evaluateRule(rule);
//       if (condition === 'AND') {
//         return acc && ruleResult;
//       } else if (condition === 'OR') {
//         return acc || ruleResult;
//       }
//       return acc;
//     }, condition === 'AND'); // Start with `true` for AND, `false` for OR

//     if (!isValid) {
//       return { ...item, hidden: true, required: false };
//     }

//     if (isValid) {
//       return { ...item, hidden: false, required: true };
//     }
//   }

//   if (item?.dependsDisabled) {
//     const { condition, rules } = item?.dependsDisabled;

//     const evaluateRule = (rule: any) => {
//       const { name, operator, value } = rule;

//       const fieldPath = name.replace('${index}', index);

//       // const dependentValue = values[name];
//       // const dependentValue = getIn(formik.values, fieldPath);

//       const dependentValue =
//         name?.includes('.') && !name?.includes('${index}')
//           ? getFieldValue(allValues, name)
//           : getIn(formik.values, fieldPath);

//       switch (operator) {
//         case 'eq':
//           return dependentValue === value;
//         case 'gt':
//           return dependentValue > value;
//         case 'includes':
//           return typeof dependentValue === 'string' && dependentValue.includes(value);
//         // Add more operators as needed
//         default:
//           return false;
//       }
//     };

//     const isValid = rules?.reduce((acc: boolean, rule: any) => {
//       const ruleResult = evaluateRule(rule);
//       if (condition === 'AND') {
//         return acc && ruleResult;
//       } else if (condition === 'OR') {
//         return acc || ruleResult;
//       }
//       return acc;
//     }, condition === 'AND'); // Start with `true` for AND, `false` for OR

//     if (!isValid) {
//       return { ...item, disabled: false };
//     }

//     if (isValid) {
//       return { ...item, disabled: true };
//     }
//   }
//   if (item?.dependsEnabled) {
//     const { condition, rules } = item?.dependsEnabled;

//     const evaluateRule = (rule: any) => {
//       const { name, operator, value } = rule;

//       const fieldPath = name.replace('${index}', index);

//       // const dependentValue = values[name];
//       // const dependentValue = getIn(formik.values, fieldPath);

//       const dependentValue =
//         name?.includes('.') && !name?.includes('${index}')
//           ? getFieldValue(allValues, name)
//           : getIn(formik.values, fieldPath);

//       switch (operator) {
//         case 'eq':
//           return dependentValue === value;
//         case 'gt':
//           return dependentValue > value;
//         case 'includes':
//           return typeof dependentValue === 'string' && dependentValue.includes(value);
//         // Add more operators as needed
//         default:
//           return false;
//       }
//     };

//     const isValid = rules?.reduce((acc: boolean, rule: any) => {
//       const ruleResult = evaluateRule(rule);
//       if (condition === 'AND') {
//         return acc && ruleResult;
//       } else if (condition === 'OR') {
//         return acc || ruleResult;
//       }
//       return acc;
//     }, condition === 'AND'); // Start with `true` for AND, `false` for OR

//     if (!isValid) {
//       return { ...item, disabled: true };
//     }

//     if (isValid) {
//       return { ...item, disabled: false };
//     }
//   }

//   return item;
// };

// import { Item } from '../../DynamicForm';
// // Helper function to resolve nested field values from a string path (e.g., 'owners[0].marital_status')
// const getFieldValue = (obj: any = {}, path: string) => {
//   return path
//     .split(/[.[\]]+/)
//     .filter(Boolean)
//     .reduce((acc, part) => acc && acc[part], obj);
// };

// export const checkDependency = ({
//   item,
//   values,
//   formik,
//   index = 0,
//   allValues = {}
// }: {
//   item: Item;
//   values: any;
//   formik?: any;
//   index?: number;
//   allValues?: any;
// }) => {
//   if (item?.depends) {
//     const { condition, rules } = item.depends;

//     const evaluateRule = (rule: any) => {
//       const { name, operator, value } = rule;

//       console.log('path', name, getFieldValue(allValues, name));
//       const fieldPath = name.replace('${index}', index);

//       // const dependentValue = values[name];
//       // const dependentValue = getIn(formik.values, fieldPath);
//       // console.log(
//       //   'dependent value',
//       //   name.includes('.') ? getFieldValue(allValues, name) : getFieldValue(values, name), name?.includes('.'), allValues, values, name
//       // );
//       const dependentValue = name?.includes('.') && !name?.includes('${index}')
//         ? getFieldValue(allValues, name)
//         : getIn(formik.values, fieldPath);

//       switch (operator) {
//         case 'eq':
//           return dependentValue === value;
//         case 'gt':
//           return dependentValue > value;
//         case 'includes':
//           return typeof dependentValue === 'string' && dependentValue.includes(value);
//         // Add more operators as needed
//         default:
//           return false;
//       }
//     };

//     const isValid = rules.reduce((acc: boolean, rule: any) => {
//       const ruleResult = evaluateRule(rule);
//       if (condition === 'AND') {
//         return acc && ruleResult;
//       } else if (condition === 'OR') {
//         return acc || ruleResult;
//       }
//       return acc;
//     }, condition === 'AND'); // Start with `true` for AND, `false` for OR

//     if (!isValid) {
//       return { ...item, hidden: true, required: false };
//     }

//     if (isValid) {
//       return { ...item, hidden: false, required: true };
//     }
//   }
//   return item;
// };

import { getIn } from 'formik';
import { Item } from '../types';
import { getDefaultValue } from './generateInitialValues';

// Helper function to resolve nested field values from a string path (e.g., 'owners[0].marital_status')
const getFieldValue = (obj: any = {}, path: string = '') => {
  return path
    .split(/[.[\]]+/)
    .filter(Boolean)
    .reduce((acc, part) => acc && acc[part], obj);
};

// Helper function to evaluate rules based on an operator
// const evaluateRule = (rule: any, formik: any, index: number | undefined, allValues: any) => {
//   const { name, operator, value, condition, rules } = rule || {};
//   // const fieldPath = name?.replace('${index}', index);
//   const dependentValue = getIn(formik.values, name);
//   // name?.includes('.') && !name?.includes('${index}')
//   //   ? getFieldValue(allValues, name)
//   //   :
//   // getIn(formik.values, fieldPath);

//   switch (operator) {
//     case 'eq':
//       return dependentValue === value;
//     case 'gt':
//       return dependentValue > value;
//     case 'includes':
//       console.log('inclueds', typeof dependentValue);
//       return dependentValue.includes(value);
//     default:
//       return false;
//   }
// };

const evaluateRule = (rule: any, formik: any, index: number | undefined, allValues: any) => {
  const { name, operator, value, condition, rules } = rule || {};

  // If the rule has nested rules, call checkRules recursively
  // if (condition && Array.isArray(rules)) {
  //   return checkRules(rules, condition, formik, index, allValues);
  // }s.

  const dependentValue = getIn(formik.values, name);

  switch (operator) {
    case 'eq':
      return dependentValue === value;
    case 'gt':
      return dependentValue > value;
    case 'includes':
      return (
        (Array.isArray(dependentValue) && dependentValue.includes(value)) ||
        (typeof dependentValue === 'string' && dependentValue.includes(value))
      );
    default:
      return false;
  }
};

// Helper function to check if rules satisfy a condition
const checkRules = (
  rules: any[],
  condition: string,
  formik: any,
  index: number | undefined,
  allValues: any
) => {
  return rules.reduce((acc: boolean, rule: any) => {
    const ruleResult = evaluateRule(rule, formik, index, allValues);

    if (condition === 'AND') {
      return acc && ruleResult;
    } else if (condition === 'OR') {
      return acc || ruleResult;
    }

    return acc;
  }, condition === 'AND');
};

export const checkDependency = ({
  item,
  values,
  formik,
  index,
  allValues
}: {
  item: Item;
  values: any;
  formik?: any;
  index?: number | undefined;
  allValues?: any;
}) => {
  let newItem = item;
  if (item?.requiredEnabled) {
    const isValid = checkRules(
      item.requiredEnabled.rules,
      item.requiredEnabled.condition,
      formik,
      index,
      allValues
    );
    newItem = { ...newItem, required: isValid };
  }
  // const applyDependencyLogic = (dependency: any, override: object) => {
  //   const { condition, rules } = dependency;
  //   const isValid = checkRules(rules, condition, formik, index, allValues);
  //   return { ...item, ...override, hidden: !isValid, required: isValid };
  // };

  // Check if depends property exists (based on it, item will be show or hidden and required or not)
  if (item?.depends) {
    const isValid = checkRules(
      item?.depends.rules,
      item?.depends?.condition,
      formik,
      index,
      allValues
    );

    if (!isValid) {
      !item.tag?.includes('custom') &&
        formik.setFieldValue(
          item.name,
          getDefaultValue(item?.validation?.type || item.type, item.multiple)
        );
    }

    newItem = { ...newItem, hidden: !isValid };
  }

  // Check if dependsDisabled property exists (based on it, item will be disabled or not)
  if (item?.dependsDisabled) {
    const isValid = checkRules(
      item?.dependsDisabled.rules,
      item.dependsDisabled.condition,
      formik,
      index,
      allValues
    );

    if (isValid) {
      !item.tag?.includes('custom') &&
        formik.setFieldValue(
          item.name,
          getDefaultValue(item?.validation?.type || item.type, item.multiple)
        );
    }
    newItem = { ...newItem, disabled: isValid };
  }

  // Check if dependsEnabled property exists (based on it, item will be enabled or not)
  if (item?.dependsEnabled) {
    const isValid = checkRules(
      item.dependsEnabled.rules,
      item.dependsEnabled.condition,
      formik,
      index,
      allValues
    );
    newItem = { ...newItem, disabled: !isValid };
  }

  if (item.requiredDisabled) {
    const isValid = checkRules(
      item.requiredDisabled.rules,
      item.requiredDisabled.condition,
      formik,
      index,
      allValues
    );
    newItem = { ...newItem, required: !isValid };
  }

  // if (item.requiredEnabled) {
  //   console.log('requiredEnabled', item?.requiredEnabled);
  //   const isValid = checkRules(
  //     item.requiredEnabled.rules,
  //     item.requiredEnabled.condition,
  //     formik,
  //     index,
  //     allValues
  //   );
  //   console.log('isValid', isValid);
  //   newItem = { ...newItem, required: isValid };
  // }

  return newItem;
};
