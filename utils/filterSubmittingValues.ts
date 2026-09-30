export const filterSubmittingValues = (values: { [key: string]: any }) => {
  let newValues = {};
  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      newValues[key] = values[key].map((mappedValues) => filterSubmittingValues(mappedValues));
    }

    if (values[key] && !Array.isArray(values[key])) {
      newValues[key] = values[key];
    }
  });

  return newValues;
};

