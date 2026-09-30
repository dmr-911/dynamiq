function generateFilterConfigurations(modelFields: any) {
  // Extract columns from model fields
  const columns = modelFields?.fields?.map((field: any) => ({
    id: field.id,
    label: field.name
  }));

  // Generate groupBy configuration (customized as needed)
  const groupBy = modelFields?.fields?.map((field: any) => ({
    id: field.id,
    label: field.name
  }));

  // Generate sortBy configuration
  const sortBy = modelFields?.fields?.reduce((acc: any, field: any) => {
    acc[field?.name] = [
      { label: 'Ascending', value: 'asc' },
      { label: 'Descending', value: 'desc' }
    ];
    return acc;
  }, {});

  // Return the final object
  return {
    column: columns,
    groupBy,
    sortBy
  };
}

export default generateFilterConfigurations;
