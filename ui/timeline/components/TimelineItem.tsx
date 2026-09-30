import { ReIcon } from '../../components/ReIcon/ReIcon';
import { cn } from '../../utils/cn';

const TimelineItem = ({
  icon,
  children,
  isLast,
  isSuccess
}: {
  icon?: string;
  children: React.ReactNode;
  isLast?: boolean;
  isSuccess?: boolean;
}) => {
  return (
    <div className={cn('flex', !isLast && 'mb-3')}>
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            'z-10 flex items-center justify-center rounded-full border border-muted-300 bg-muted-100 text-muted-600 dark:border-muted-400 dark:bg-muted-700 dark:text-muted-400',
            isSuccess && 'bg-success-500 text-white dark:bg-success-500 dark:text-white',
            icon ? 'h-9 w-9' : 'mt-1 h-4 w-4'
          )}
        >
          {icon && (typeof icon === 'string' ? <ReIcon iconName={icon} /> : icon)}
        </div>
        {!isLast && (
          <div
            className={cn(
              'absolute w-[1px] bg-muted-300 dark:bg-muted-700',
              isSuccess && 'bg-success-500',
              icon ? 'top-4 h-full' : 'top-7 h-[70%]'
            )}
          ></div>
        )}
      </div>
      {/* children */}
      {children}
    </div>
  );
};

export default TimelineItem;
