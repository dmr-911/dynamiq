import { cva } from 'class-variance-authority';

export const buttonIconVariants = cva(
  'cursor-pointer relative inline-flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
  {
    variants: {
      color: {
        default: '',
        secondary: '',
        muted: '',
        primary: '',
        info: '',
        success: '',
        warning: '',
        error: ''
      },
      variant: {
        solid: '',
        pastel: '',
        outlined: ''
      },
      shape: {
        straight: '',
        rounded: 'rounded-md',
        smooth: 'rounded-lg',
        curved: 'rounded-xl',
        full: 'rounded-full'
      },
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12'
      },
      shadow: {
        none: '',
        default: 'hover:enabled:shadow-xl',
        secondary: 'hover:enabled:shadow-xl',
        muted: 'hover:enabled:shadow-xl',
        primary:
          'hover:enabled:shadow-xl hover:enabled:shadow-primary-500 dark:hover:enabled:shadow-primary-800',
        info: 'hover:enabled:shadow-xl hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20',
        success:
          'hover:enabled:shadow-xl hover:enabled:shadow-success-500/50 dark:hover:enabled:shadow-success-800/20',
        warning:
          'hover:enabled:shadow-xl hover:enabled:shadow-warning-500/50 dark:hover:enabled:shadow-warning-800/20',
        error:
          'hover:enabled:shadow-xl hover:enabled:shadow-error-500/50 dark:hover:enabled:shadow-error-800/20'
      }
    },

    compoundVariants: [
      {
        color: 'default',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 bg-white hover:enabled:bg-muted-50 active:enabled:bg-muted-100 hover:enabled:border-muted-300 dark:hover:enabled:border-muted-600 border border-muted-200 dark:border-muted-700 text-muted-800 dark:text-muted-100 dark:bg-muted-800 dark:hover:enabled:bg-muted-700 dark:active:enabled:bg-muted-800'
      },
      {
        color: 'secondary',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-secondary-500 dark:[&>span>.loader]:text-secondary-200 bg-secondary hover:enabled:bg-secondary-50 active:enabled:bg-secondary-100 hover:enabled:border-secondary-300 dark:hover:enabled:border-secondary-700 border border-secondary-200 dark:border-secondary-800 text-secondary-800 dark:text-secondary-100 dark:bg-secondary-950 dark:hover:enabled:bg-secondary-900 dark:active:enabled:bg-secondary-950'
      },
      {
        color: 'muted',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-200 dark:border-muted-700 bg-muted-200 dark:bg-muted-800 text-muted-500 dark:text-muted-100 enabled:hover:bg-muted-300 dark:enabled:hover:bg-muted-700 active:enabled:bg-muted-100 dark:active:enabled:bg-muted-800'
      },
      {
        color: 'primary',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-100 border border-primary-500 bg-primary-500 text-white enabled:hover:bg-primary-600 active:enabled:bg-primary-400'
      },
      {
        color: 'info',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-100 border border-info-500 bg-info-500 text-white enabled:hover:bg-info-600 active:enabled:bg-info-400'
      },
      {
        color: 'success',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-100 border border-success-500 bg-success-500 text-white enabled:hover:bg-success-600 active:enabled:bg-success-400'
      },
      {
        color: 'warning',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-100 border border-warning-500 bg-warning-500 text-white enabled:hover:bg-warning-600 active:enabled:bg-warning-400'
      },
      {
        color: 'error',
        variant: 'solid',
        className:
          '[&>span>.loader]:text-muted-100 border border-error-500 bg-error-500 text-white enabled:hover:bg-error-600 active:enabled:bg-error-400'
      },
      {
        color: 'default',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border-none bg-muted-300/30 dark:bg-muted-300/10 text-muted-500 dark:text-muted-400 enabled:hover:bg-muted-300/60 dark:enabled:hover:bg-muted-300/20 active:enabled:bg-muted-300/30 dark:active:enabled:bg-muted-300/10'
      },

      {
        color: 'secondary',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-secondary-500 dark:[&>span>.loader]:text-secondary-200 border-none bg-secondary-300/30 dark:bg-secondary-300/10 text-secondary-500 dark:text-secondary-400 enabled:hover:bg-secondary-300/60 dark:enabled:hover:bg-secondary-300/20 active:enabled:bg-secondary-300/30 dark:active:enabled:bg-secondary-300/10'
      },
      {
        color: 'muted',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 bg-muted-300/30 dark:bg-muted-300/10 text-muted-500 dark:text-muted-400 enabled:hover:bg-muted-300/60 dark:enabled:hover:bg-muted-300/20 active:enabled:bg-muted-300/30 dark:active:enabled:bg-muted-300/10'
      },
      {
        color: 'primary',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-500 hover:text-primary-50 enabled:hover:bg-primary-500 dark:enabled:hover:bg-primary-900 active:enabled:bg-primary-500 dark:active:enabled:bg-primary-950'
      },
      {
        color: 'info',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-info-500 bg-info-500/10 dark:bg-info-500/20 text-info-500 enabled:hover:bg-info-500/20 dark:enabled:hover:bg-info-500/30 active:enabled:bg-info-500/10 dark:active:enabled:bg-info-500/10'
      },
      {
        color: 'success',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-success-500 bg-success-500/10 dark:bg-success-500/20 text-success-500 enabled:hover:bg-success-500/20 dark:enabled:hover:bg-success-500/30 active:enabled:bg-success-500/10 dark:active:enabled:bg-success-500/10'
      },
      {
        color: 'warning',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-warning-500 bg-warning-500/10 dark:bg-warning-500/20 text-warning-500 enabled:hover:bg-warning-500/20 dark:enabled:hover:bg-warning-500/30 active:enabled:bg-warning-500/10 dark:active:enabled:bg-warning-500/10'
      },
      {
        color: 'error',
        variant: 'pastel',
        className:
          '[&>span>.loader]:text-error-500 bg-error-500/10 dark:bg-error-500/20 text-error-500 enabled:hover:bg-error-500/20 dark:enabled:hover:bg-error-500/30 active:enabled:bg-error-500/10 dark:active:enabled:bg-error-500/10'
      },
      {
        color: 'default',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-300 dark:border-muted-700 text-muted-500 hover:bg-white hover:enabled:bg-muted-100 dark:hover:enabled:bg-muted-800 active:enabled:bg-muted-50 dark:active:enabled:bg-muted-700 hover:enabled:text-muted-600 dark:hover:enabled:text-muted-100'
      },
      {
        color: 'secondary',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-secondary-500 dark:[&>span>.loader]:text-secondary-200 border border-secondary-300 dark:border-secondary-700 text-secondary-500 hover:bg-white hover:enabled:bg-secondary-100 dark:hover:enabled:bg-secondary-950 active:enabled:bg-secondary-50 dark:active:enabled:bg-secondary-900 hover:enabled:text-secondary-600 dark:hover:enabled:text-secondary-100'
      },
      {
        color: 'muted',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-300 dark:border-muted-700 text-muted-500 hover:bg-white hover:enabled:bg-muted-100 dark:hover:enabled:bg-muted-800 active:enabled:bg-muted-50 dark:active:enabled:bg-muted-700 hover:enabled:text-muted-600 dark:hover:enabled:text-muted-100'
      },
      {
        color: 'primary',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-primary-500 border border-primary-500 text-primary-500 hover:bg-primary-500 active:enabled:bg-primary-400 hover:text-white'
      },
      {
        color: 'info',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-info-500 border border-info-500 text-info-500 hover:bg-info-500 active:enabled:bg-info-400 hover:text-white'
      },
      {
        color: 'success',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-success-500 border border-success-500 text-success-500 hover:bg-success-500 active:enabled:bg-success-400 hover:text-white'
      },
      {
        color: 'warning',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-warning-500 border border-warning-500 text-warning-500 hover:bg-warning-500 active:enabled:bg-warning-400 hover:text-white'
      },
      {
        color: 'error',
        variant: 'outlined',
        className:
          '[&>span>.loader]:text-error-500 border border-error-500 text-error-500 hover:bg-error-500 active:enabled:bg-error-400 hover:text-white'
      }
    ],

    defaultVariants: {
      color: 'default',
      variant: 'solid',
      shape: 'smooth',
      shadow: 'none'
    }
  }
);
