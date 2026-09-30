export const dynamicLayoutData = {
  name: 'Test',
  grid: 4,
  submit: {
    store: 'localStorage', // local Storage, session Storage
    key_name: 'change-form'
    // endPoint: '/change-form',
    // method: 'INSERT' // UPSERT, DELETE, UPDATE
  },
  items: [
    {
      index: 1,
      widths: {
        default: '100%',
        greaterThan1440: '100%',
        between890And1440: '100%',
        between600And890: '100%'
      },
      atom: false,
      element: 'csPassword',
      name: 'password',
      label: 'Current Password',
      placeholder: 'Enter current password',
      variant: 'M',
      labelClass: 'text-sm',
      required: true
    },
    {
      index: 2,
      width: '100%',
      atom: false,
      element: 'csPassword',
      name: 'newPassword',
      label: 'New Password',
      variant: 'M',
      labelClass: 'text-sm',
      placeholder: 'Enter new password',
      required: true
    },
    {
      index: 3,
      width: '100%',
      atom: false,
      element: 'csPassword',
      name: 'confirmNewPassword',
      label: 'Confirm New Password',
      variant: 'M',
      labelClass: 'text-sm',
      placeholder: 'Re-type password',
      required: false
    },
    {
      index: 7,
      widths: {
        default: '100%',
        greaterThan1440: '100%',
        between890And1440: '100%',
        between600And890: '100%'
      },
      name: 'friends',
      label: 'Friends',
      required: true,
      tag: 'repeater',
      form: {
        name: 'Nested Test',
        grid: 4,
        items: [
          {
            index: 1,
            widths: {
              default: '100%',
              greaterThan1440: '100%',
              between890And1440: '100%',
              between600And890: '100%'
            },
            atom: false,
            element: 'csText',
            name: 'name',
            label: 'Friend Name',
            placeholder: 'Enter Friend Name',
            variant: 'M',
            labelClass: 'text-sm',
            required: true
          },
          {
            index: 2,
            width: '100%',
            atom: false,
            element: 'csText',
            name: 'age',
            label: 'Friend Age',
            variant: 'M',
            labelClass: 'text-sm',
            placeholder: 'Enter Friend Age',
            required: true
          }
        ]
      },
      validation: {
        type: 'array'
        // validations: {
        //   min: {
        //     value: 1,
        //     message: 'At least one friend is required'
        //   }
        // }
      }
    }
  ]
};
