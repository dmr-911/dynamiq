# DynamicForm

A versatile, grid-based dynamic form component for React/Next.js with built-in validation, field dependencies, repeaters, and multiple submission targets.

## Installation

```bash
npm install dynamic-form
```

**Peer dependencies** (must be installed separately):
```bash
npm install react react-dom formik yup
```

## Quick Start

```tsx
import { DynamicForm } from 'dynamic-form';
import { Button } from 'dynamic-form/ui/button/Button';

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
  submit: Submit;          // Submission configuration
  items: Item[];           // Field definitions
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
{ name: 'username', label: 'Username', type: 'text' }
{ name: 'password', label: 'Password', type: 'password' }
{ name: 'bio', label: 'Bio', type: 'textarea' }
{ name: 'age', label: 'Age', type: 'number' }
{ name: 'enabled', label: 'Enable?', type: 'switch' }
{ name: 'category', label: 'Category', type: 'select', options: ['A', 'B', 'C'] }
{ name: 'avatar', label: 'Avatar', type: 'file' }
{ name: 'role', label: 'Role', type: 'radio-group', options: ['Admin', 'User'] }
{ name: 'tags', label: 'Tags', type: 'checkbox-group', options: ['React', 'TypeScript'] }
{ name: 'otp', label: 'OTP', type: 'otp' }
```

### Field Properties

```tsx
{
  index: 1,                          // Sort order
  name: 'fieldName',                 // Formik key
  label: 'Field Label',              // Display label
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'radio-group' | 'file' | 'otp' | 'phone',
  tag?: 'repeater' | 'group';        // Special field types
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  multiple?: boolean;                // For select (multi-select) or file inputs
  options?: string[];                // For select, radio-group, checkbox-group
  variant?: 'choice-group' | 'custom';  // Radio/checkbox variants
  widths?: Widths;                   // Responsive widths
  validation?: Validation;           // Yup validation rules
  depends?: Dependency;               // Conditional visibility
  dependsDisabled?: Dependency;       // Conditional disabled state
  dependsEnabled?: Dependency;       // Conditional enabled state
  form?: NestedForm;                 // For repeater/group fields
  calculate?: { operator: 'addition' | 'subtraction' | 'multiplication' | 'division', fields: string[] };
}
```

### Responsive Widths

```tsx
widths: {
  default: '100%',              // < 600px
  between600And890: '100%',     // 600px - 890px
  between890And1440: '50%',     // 890px - 1440px
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

---

## Field Dependencies

Show/hide fields based on other field values:

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
    rules: [
      { name: 'country', operator: 'eq', value: 'USA' },
    ],
  },
  // Only visible when country === 'USA'
},
```

**Operators:** `eq` (equals), `gt` (greater than), `lt` (less than), `includes`

**Conditions:** `AND`, `OR`

---

## Repeater Fields

Dynamic arrays of fields (e.g., multiple addresses):

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
        index: 1,
        name: 'street',
        label: 'Street',
        type: 'text',
        required: true,
        widths: { default: '100%', greaterThan1440: '100%', between890And1440: '100%', between600And890: '100%' },
      },
      {
        index: 2,
        name: 'city',
        label: 'City',
        type: 'text',
        required: true,
        widths: { default: '100%', greaterThan1440: '50%', between890And1440: '50%', between600And890: '100%' },
      },
      {
        index: 3,
        name: 'zip',
        label: 'ZIP Code',
        type: 'text',
        required: true,
        widths: { default: '100%', greaterThan1440: '50%', between890And1440: '50%', between600And890: '100%' },
      },
    ],
  },
},
```

---

## Field Calculations

Automatically calculate a field from others:

```tsx
{
  name: 'total',
  label: 'Total',
  type: 'number',
  calculate: {
    operator: 'addition',
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

## UI Components

The package also exports standalone UI components:

```tsx
import { Button } from 'dynamic-form/ui/button/Button';
import { Input } from 'dynamic-form/ui/form/input/Input';
import { Select } from 'dynamic-form/ui/form/select/Select';
import { Modal } from 'dynamic-form/ui/modal/Modal';
import { Dialog } from 'dynamic-form/ui/Dialog/Dialog';
import { Table } from 'dynamic-form/ui/table/JsonTable';
import { NumberFormatter } from 'dynamic-form/ui/numberFormatter';
import { AdvancedDateFormatter } from 'dynamic-form/ui/date-time-formatter';
import { Checkbox } from 'dynamic-form/ui/form/checkbox/Checkbox';
import { Radio } from 'dynamic-form/ui/form/radio/Radio';
import { Password } from 'dynamic-form/ui/form/password/Password';
import { Phone } from 'dynamic-form/ui/form/Phone/Phone';
import { DatePicker } from 'dynamic-form/ui/form/datepicker/DatePicker';
import { Tabs } from 'dynamic-form/ui/tabs/Tabs';
import { Card } from 'dynamic-form/ui/card/Card';
import { Avatar } from 'dynamic-form/ui/avatar/Avatar';
import { Tag } from 'dynamic-form/ui/tag/Tag';
import { Tooltip } from 'dynamic-form/ui/tooltip/Tooltip';
import { Dropdown } from 'dynamic-form/ui/dropdown/Dropdown';
import { Progress } from 'dynamic-form/ui/progress/Progress';
import { Loader } from 'dynamic-form/ui/loader/Loader';
// ...and more
```

---

## API Reference

### `DynamicForm` Props

| Prop | Type | Description |
|------|------|-------------|
| `formData` | `FormData` | Form configuration (name, grid, items, submit) |
| `children` | `ReactNode` | Submit button and any custom content |
| `className` | `string` | Additional CSS classes for the form container |
| `onSubmit` | `(values: any) => void` | Custom submit handler |
| `defaultValue` | `object` | Pre-populate form with existing values |
| `allValues` | `object` | External values for dependency calculations |
| `isRealTime` | `boolean` | Call `setRealTimeValues` on every change |
| `setRealTimeValues` | `(values: any) => void` | Callback for real-time value updates |
| `noGap` | `boolean` | Remove gap between fields (default: true) |

### `Item` Type

```tsx
interface Item {
  index: number;
  name: string;
  label: string;
  type: string;
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
  form?: NestedForm;
  calculate?: { operator: string; fields: string[] };
}
```

### `Widths`

```tsx
interface Widths {
  default: string;
  greaterThan1440: string;
  between890And1440: string;
  between600And890: string;
}
```

### `Validation`

```tsx
interface Validation {
  type: 'string' | 'number' | 'array' | 'object' | 'boolean' | 'date';
  validations: {
    required?: string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    email?: string;
    matches?: { regex: RegExp; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    oneOf?: { value: any[]; message: string };
  };
}
```

### `Dependency`

```tsx
interface Dependency {
  condition: 'AND' | 'OR';
  rules: {
    name: string;      // Field name to check
    operator: string;  // 'eq' | 'gt' | 'lt' | 'includes'
    value: any;        // Value to compare against
  }[];
}
```

---

## Utilities

Re-exported from `dynamic-form`:

```tsx
import { checkDependency } from 'dynamic-form';
import { filterSubmittingValues } from 'dynamic-form';
import { generateInitialValues } from 'dynamic-form';
import { generateValidationSchema } from 'dynamic-form';
import { storeOrSendValueToApi } from 'dynamic-form';
import { cn } from 'dynamic-form';  // clsx + tailwind-merge
```
