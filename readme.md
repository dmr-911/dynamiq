# Dynamiq

A versatile, grid-based dynamic form component for React/Next.js with built-in validation, field dependencies, repeaters, responsive widths, and multiple submission targets.

## Installation

```bash
npm install dynamiq
```

**Peer dependencies** (must be installed separately):
```bash
npm install react react-dom formik yup
```

## Quick Start

```tsx
import { DynamicForm } from 'dynamiq';
import { Button } from 'dynamiq/ui/button/Button';

const formData = {
  name: 'Contact Form',
  grid: 2,
  submit: {
    endPoint: '/api/contact',
    method: 'INSERT',
  },
  items: [
    {
      index: 1,
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      widths: { default: '100%', greaterThan1440: '50%', between890And1440: '50%', between600And890: '100%' },
    },
    {
      index: 2,
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      widths: { default: '100%', greaterThan1440: '50%', between890And1440: '50%', between600And890: '100%' },
      validation: {
        type: 'string',
        validations: {
          email: 'Please enter a valid email',
        },
      },
    },
  ],
};

export default function MyForm() {
  return (
    <DynamicForm formData={formData}>
      <Button type="submit" className="col-span-full" color="primary">
        Submit
      </Button>
    </DynamicForm>
  );
}
```

---

## Form Data Structure

```tsx
const formData: FormData = {
  name: string;           // Form name
  grid?: number;           // Grid columns: 1, 2, 4, 6, or 12 (default: 1)
  submit: Submit;           // Submission configuration
  items: Item[];            // Field definitions
};
```

### Submission Options

```tsx
// Submit to API
submit: {
  endPoint: '/api/endpoint',
  method: 'INSERT' | 'UPSERT' | 'UPDATE' | 'DELETE',
}

// Store in browser
submit: {
  store: 'localStorage' | 'sessionStorage' | 'cookies',
  key_name: 'my-form-data',
}

// Custom handler
submit: {
  function: async ({ values, formik, setErrors, resetForm }) => {
    // Your custom logic
  },
}
```

---

## Field Types

```tsx
{ name: 'username',    label: 'Username',    type: 'text' }
{ name: 'password',    label: 'Password',    type: 'password' }
{ name: 'bio',         label: 'Bio',         type: 'textarea' }
{ name: 'age',         label: 'Age',         type: 'number' }
{ name: 'enabled',     label: 'Enable?',     type: 'switch' }
{ name: 'category',    label: 'Category',    type: 'select',    options: ['A', 'B', 'C'] }
{ name: 'avatar',       label: 'Avatar',      type: 'file' }
{ name: 'role',        label: 'Role',        type: 'radio-group',  options: ['Admin', 'User'] }
{ name: 'tags',        label: 'Tags',        type: 'checkbox-group', options: ['React', 'TS'] }
{ name: 'otp',         label: 'OTP',         type: 'otp' }
{ name: 'phone',       label: 'Phone',       type: 'phone' }
{ name: 'startDate',   label: 'Start Date',  type: 'date' }
{ name: 'htmlBlock',    label: '',            type: 'HTML', children: <div>Custom HTML</div> }
```

### Field Properties

```tsx
{
  index: 1,                           // Sort order
  name: 'fieldName',                  // Formik key
  label: 'Field Label',               // Display label
  type?: FieldType;                   // Field type
  tag?: 'repeater' | 'group';        // Special container types
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  options?: string[];                 // For select, radio-group, checkbox-group
  multiple?: boolean;                  // Multi-select or multi-file
  variant?: string;                   // e.g. 'choice-group', 'custom'
  widths?: Widths;                   // Responsive column widths
  validation?: Validation;           // Yup validation rules
  depends?: Dependency;               // Conditional visibility
  dependsDisabled?: Dependency;       // Conditional disabled state
  dependsEnabled?: Dependency;       // Conditional enabled state
  requiredEnabled?: Dependency;       // Required when conditions met
  requiredDisabled?: Dependency;     // Not required when conditions met
  form?: NestedForm;                // Nested fields (for repeater/group)
  calculate?: Calculate;             // Auto-calculate from other fields
}
```

### Responsive Widths

```tsx
widths: {
  default: '100%',               // < 600px
  between600And890: '50%',      // 600px – 890px
  between890And1440: '50%',    // 890px – 1440px
  greaterThan1440: '50%',        // > 1440px
}
```

---

## Validation

```tsx
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  validation: {
    type: 'string',
    validations: {
      required: 'Email is required',
      email: 'Invalid email address',
      minLength: { value: 5, message: 'At least 5 characters' },
      maxLength: { value: 100, message: 'Max 100 characters' },
      matches: {
        regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
        message: 'Invalid email format',
      },
    },
  },
}
```

**Supported validation types:** `string`, `number`, `array`, `object`, `boolean`, `date`, `datetime-local`

**Rules:** `required`, `minLength`, `maxLength`, `email`, `matches`, `oneOf`, `notOneOf`, `min`, `max`, `lessThan`, `positive`, `negative`, `maxWords`, `when`, `moreThan`

---

## Field Dependencies

Show/hide or enable/disable fields based on other field values:

```tsx
{
  name: 'country',
  label: 'Country',
  type: 'select',
  options: ['USA', 'Canada', 'Other'],
},
{
  name: 'state',
  label: 'State/Province',
  type: 'select',
  depends: {
    condition: 'AND',
    rules: [{ name: 'country', operator: 'eq', value: 'USA' }],
  },
  // Visible only when country === 'USA'
},
{
  name: 'zip',
  label: 'ZIP Code',
  type: 'text',
  dependsDisabled: {
    condition: 'OR',
    rules: [
      { name: 'country', operator: 'eq', value: 'Canada' },
      { name: 'country', operator: 'eq', value: 'Other' },
    ],
  },
  // Disabled when country is Canada or Other
}
```

**Operators:** `eq` (equals), `gt` (greater than), `lt` (less than), `includes`
**Conditions:** `AND`, `OR`

---

## Repeater Fields

Dynamic arrays of fields (e.g., multiple addresses, contacts):

```tsx
{
  index: 10,
  name: 'addresses',
  label: 'Addresses',
  tag: 'repeater',
  placeholder: 'address',
  form: {
    name: 'Address Entry',
    grid: 2,
    items: [
      {
        index: 1, name: 'street', label: 'Street', type: 'text',
        widths: { default: '100%', greaterThan1440: '100%', between890And1440: '100%', between600And890: '100%' },
      },
      {
        index: 2, name: 'city', label: 'City', type: 'text',
        widths: { default: '100%', greaterThan1440: '50%', between890And1440: '50%', between600And890: '100%' },
      },
      {
        index: 3, name: 'zip', label: 'ZIP', type: 'text',
        widths: { default: '100%', greaterThan1440: '50%', between890And1440: '50%', between600And890: '100%' },
      },
    ],
  },
}
```

---

## Field Calculations

Automatically compute a field's value from other fields:

```tsx
{
  name: 'total',
  label: 'Total ($)',
  type: 'number',
  calculate: {
    operator: 'addition',    // 'addition' | 'subtraction' | 'multiplication' | 'division'
    fields: ['subtotal', 'tax'],
  },
}
```

---

## Custom Submit Handler

```tsx
<DynamicForm
  formData={formData}
  onSubmit={async (values) => {
    console.log('Form values:', values);
    await saveToDatabase(values);
  }}
>
  <Button type="submit">Save</Button>
</DynamicForm>
```

---

## API Reference

### `DynamicForm` Props

| Prop | Type | Description |
|------|------|-------------|
| `formData` | `FormData` | Form configuration (name, grid, items, submit) |
| `children` | `ReactNode` | Submit button and custom content |
| `className` | `string` | Additional CSS classes for the form container |
| `onSubmit` | `(values) => void` | Custom submit handler |
| `defaultValue` | `object` | Pre-populate form with existing values |
| `allValues` | `object` | External values for dependency calculations |
| `isRealTime` | `boolean` | Call `setRealTimeValues` on every change |
| `setRealTimeValues` | `(values) => void` | Real-time value callback |
| `noGap` | `boolean` | Remove gap between fields (default: `true`) |

### `Item`

```tsx
{
  index: number;
  name: string;
  label: string;
  type?: FieldType;
  tag?: 'repeater' | 'group';
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  options?: string[];
  multiple?: boolean;
  variant?: string;
  widths?: Widths;
  validation?: Validation;
  depends?: Dependency;
  dependsDisabled?: Dependency;
  dependsEnabled?: Dependency;
  requiredEnabled?: Dependency;
  requiredDisabled?: Dependency;
  form?: NestedForm;
  calculate?: Calculate;
}
```

### `Validation`

```tsx
{
  type: 'string' | 'number' | 'array' | 'object' | 'boolean' | 'date';
  validations: {
    required?: string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    email?: string;
    matches?: { regex: RegExp; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    oneOf?: { field_name: string; message: string };
    // ...and more
  };
}
```

### `Dependency`

```tsx
{
  condition: 'AND' | 'OR';
  rules: {
    name: string;       // Field to check
    operator: 'eq' | 'gt' | 'lt' | 'includes';
    value: unknown;
  }[];
}
```

---