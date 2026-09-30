export const queryData = {
  name: 'queryBuilderForm',
  grid: 4,
  submit: {
    store: 'localStorage',
    key_name: 'query_builder',
    method: 'UPSERT'
  },
  items: [
    {
      index: 0,
      name: 'condition',
      label: 'Condition',
      tag: 'select',
      options: ['AND', 'OR'],
      placeholder: 'Select Condition',
      type: 'select',
      required: true,
      width: '100%',
    },
    {
      index: 1,
      name: 'rules',
      label: 'Rules',
      tag: '',
      form: {
        name: 'ruleForm',
        grid: 4,
        items: [
          {
            index: 0,
            name: 'field',
            label: 'Field',
            tag: 'select',
            options: ['isMarried', 'spouse_name', 'status'],
            placeholder: 'Select Field',
            type: 'select',
            required: true,
            width: '100%'
          },
          {
            index: 1,
            name: 'operator',
            label: 'Operator',
            tag: 'select',
            options: ['equals', 'contains'],
            placeholder: 'Select Operator',
            type: 'select',
            required: true,
            width: '100%'
          },
          {
            index: 2,
            name: 'value',
            label: 'Value',
            tag: 'input',
            placeholder: 'Enter Value',
            type: 'select',
            required: true,
            width: '100%'
          },
        ]
      }
    }
  ]
};
