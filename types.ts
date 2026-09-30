import * as Yup from 'yup';

// ---------------------------------------------------------------------------
// Field type system — union types for every controlled string field
// ---------------------------------------------------------------------------

/** All supported field types rendered by InputRenderrer */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'radio-group'
  | 'checkbox-group'
  | 'file'
  | 'otp'
  | 'phone'
  | 'HTML'
  | 'date'
  | 'datetime-local'
  | 'signature'
  | 'initials'
  | 'document-editor'
  | 'file-manager';

/** Special field containers */
export type FieldTag = 'repeater' | 'group';

/** Yup schema types used in validation */
export type YupSchemaType = 'string' | 'number' | 'array' | 'object' | 'boolean' | 'date';

/** HTTP methods for API submission */
export type HttpMethod = 'INSERT' | 'UPSERT' | 'DELETE' | 'UPDATE';

/** Storage backends for browser persistence */
export type StorageType = 'localStorage' | 'sessionStorage' | 'cookies';

/** Dependency condition combinators */
export type DependencyCondition = 'AND' | 'OR';

/** Dependency rule operators */
export type DependencyOperator = 'eq' | 'gt' | 'lt' | 'includes';

/** Calculation operators */
export type CalculationOperator = 'addition' | 'subtraction' | 'multiplication' | 'division';

/** Submit store type */
export type StoreTarget = 'localStorage' | 'sessionStorage' | 'cookies';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationRule {
  type: YupSchemaType;
  message?: string;
  value?: unknown;
  regex?: RegExp;
}

export interface ValidationValidations {
  required?: string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  email?: string;
  matches?: { regex: RegExp; message: string };
  oneOf?: { field_name: string; message: string };
  notOneOf?: { field_name: string; message: string };
  length?: number;
  min?: { value: number; message: string } | { field_name: string; message: string };
  max?: { value: number; message: string };
  lessThan?: { value: number; message: string };
  positive?: { value: boolean; message: string };
  negative?: { value: boolean; message: string };
  when?: { field_name: string; message?: string };
  moreThan?: { field_name: string; message: string };
  maxWords?: { value: number; message: string };
  [key: string]: unknown;
}

export interface Validation {
  type: YupSchemaType;
  validations: ValidationValidations;
}

// ---------------------------------------------------------------------------
// Responsive widths
// ---------------------------------------------------------------------------

export interface Widths {
  default: string;
  greaterThan1440?: string;
  between890And1440?: string;
  between600And890?: string;
}

// ---------------------------------------------------------------------------
// Field dependency
// ---------------------------------------------------------------------------

export interface DependencyRule {
  name: string;
  operator: DependencyOperator;
  value: unknown;
}

export interface Dependency {
  condition: DependencyCondition;
  rules: DependencyRule[];
}

// ---------------------------------------------------------------------------
// Field calculation
// ---------------------------------------------------------------------------

export interface Calculate {
  operator: CalculationOperator;
  fields: string[];
}

// ---------------------------------------------------------------------------
// Nested form (for repeater / group)
// ---------------------------------------------------------------------------

export interface NestedForm {
  name: string;
  grid: number;
  items: Item[];
}

// ---------------------------------------------------------------------------
// Core Item
// ---------------------------------------------------------------------------

export interface Item {
  /** Sort order within the grid */
  index: number;
  /** Formik-compatible field key */
  name: string;
  /** Display label */
  label: string;
  /** The HTML / component type to render */
  type?: FieldType;
  /** Optional container tag — repeater (dynamic array) or group (static object) */
  tag?: FieldTag;
  /** Make field required (adds Yup .required()) */
  required?: boolean;
  /** Disable the field */
  disabled?: boolean;
  /** Hide the field entirely */
  hidden?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Options for select, radio-group, checkbox-group */
  options?: string[];
  /** Responsive column widths */
  widths?: Widths;
  /** Yup validation schema */
  validation?: Validation;
  /** Show this field only when dependency conditions are met */
  depends?: Dependency;
  /** Disable this field when dependency conditions are met */
  dependsDisabled?: Dependency;
  /** Enable this field when dependency conditions are met */
  dependsEnabled?: Dependency;
  /** Require this field when dependency conditions are met */
  requiredEnabled?: Dependency;
  /** Remove required when dependency conditions are met */
  requiredDisabled?: Dependency;
  /** Nested form definition (for tag: 'repeater' or 'group') */
  form?: NestedForm;
  /** Field variant — e.g. 'choice-group', 'custom' */
  variant?: string;
  /** Allow multiple values (select multi, file upload) */
  multiple?: boolean;
  /** Auto-calculate this field's value from other fields */
  calculate?: Calculate;
}

// ---------------------------------------------------------------------------
// Submit configuration
// ---------------------------------------------------------------------------

export interface SubmitFunctionData {
  values?: Record<string, unknown>;
  formik?: unknown;
  setErrors?: (errors: Record<string, string>) => void;
  resetForm?: () => void;
  schema?: Yup.ObjectSchema<unknown>;
}

export interface SubmitStore {
  store: StorageType;
  key_name: string;
}

export interface SubmitApi {
  endPoint: string;
  method: HttpMethod;
}

export type SubmitHandler = (data: SubmitFunctionData) => Promise<void> | void;

export type Submit =
  | ({ store: StorageType; key_name: string; endPoint?: never; method?: never; function?: never })
  | ({ endPoint: string; method: HttpMethod; store?: never; key_name?: never; function?: never })
  | ({ function: SubmitHandler; store?: never; key_name?: never; endPoint?: never; method?: never });

// ---------------------------------------------------------------------------
// FormData — root configuration object
// ---------------------------------------------------------------------------

export interface FormData {
  name: string;
  /** Number of grid columns (1, 2, 4, 6, 12). Default: 1 */
  grid?: number;
  /** Submission configuration */
  submit: Submit;
  /** Ordered list of field definitions */
  items: Item[];
  /** Alias for grid (used interchangeably) */
  columns?: number;
}

// ---------------------------------------------------------------------------
// DynamicForm props
// ---------------------------------------------------------------------------

export interface DynamicFormProps {
  /** Form configuration (name, grid, items, submit) */
  formData: FormData;
  /** Child elements — typically a submit Button */
  children: React.ReactNode;
  /** Extra CSS classes on the form wrapper */
  className?: string;
  /** Custom submit handler (overrides submit.endPoint / submit.function) */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Pre-populate form with existing values */
  defaultValue?: Record<string, unknown>;
  /** Values from an external source (used in dependency calculations) */
  allValues?: Record<string, unknown>;
  /** Fire setRealTimeValues on every change */
  isRealTime?: boolean;
  /** Callback with current form values on every change */
  setRealTimeValues?: (values: Record<string, unknown>) => void;
  /** Remove gap between fields. Default: true */
  noGap?: boolean;
}
