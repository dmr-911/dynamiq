import { cva } from 'class-variance-authority';

export const sidebarVariants = cva('relative w-full', {
  variants: {
    color: {
      default: 'bg-white dark:bg-muted-800',
      contrast: 'bg-white dark:bg-muted-950',
      muted: 'bg-muted-100 dark:bg-muted-800',
      mutedContrast: 'bg-muted-100 dark:bg-muted-950',
      primary: 'bg-primary-50  dark:bg-primary-950',
      info: 'bg-info-500  dark:bg-info-500',
      success: 'bg-success-500 dark:bg-success-500',
      warning: 'bg-warning-500 dark:bg-warning-500',
      danger: 'bg-danger-500 dark:bg-danger-500',
      transparent: 'bg-transparent border-none'
    },
    shape: {
      straight: '',
      rounded: 'rounded-md',
      smooth: 'rounded-lg',
      curved: 'rounded-xl'
    },
    shadow: {
      flat: 'shadow-xl shadow-muted-300/30 dark:shadow-muted-800/20',
      hover: 'hover:shadow-xl hover:shadow-muted-300/30 dark:hover:shadow-muted-900/20',
      none: ''
    },
    indicatorBorder: {
      none: '',
      dashed: 'border-dashed',
      solid: 'border-solid'
    },
    indicatorColor: {
      default: 'bg-muted-600 dark:bg-muted-400',
      primary: 'bg-primary-500 dark:bg-primary-500',
      info: 'bg-info-500 dark:bg-info-500',
      success: 'bg-success-500 dark:bg-success-500',
      warning: 'bg-warning-500 dark:bg-warning-500',
      danger: 'bg-danger-500 dark:bg-danger-500',
      transparent: 'bg-transparent'
    }
  },
  defaultVariants: {
    color: 'default',
    shape: 'straight',
    shadow: 'none'
  }
});
