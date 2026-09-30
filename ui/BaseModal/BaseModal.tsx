// Code by Eshak
import { cn } from '../utils/cn';
import { Dialog, DialogContent } from '../Dialog/Dialog';
import BaseParagraph from '../base-paragraph/BaseParagraph';
import IconButton from '../button-icon/IconButton';
import { ReIcon } from '../../components/ReIcon/ReIcon';

const BaseModal = ({
  title,
  open,
  setOpen,
  children,
  footer,
  outsideClickClose = true,
  classes
}: {
  outsideClickClose?: boolean;
  title: string;
  open: boolean;
  setOpen: any;
  children: React.ReactNode;
  footer?: React.ReactNode;
  classes?: {
    main?: string;
  };
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} outsideClickClose={outsideClickClose}>
      <DialogContent
        className={cn(
          'w-[95%] rounded-2xl bg-gray-50 backdrop-blur-3xl dark:border dark:border-muted-700 dark:bg-muted-800/65 md:w-[50%] xl:w-[30%]',
          classes?.main && classes?.main
        )}
        style={{ maxHeight: 'auto' }}
      >
        <div>
          <div className={cn('w-full')}>
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 shadow-sm dark:border-gray-800">
              {title && (
                <div className="">
                  <BaseParagraph size="md" weight="semibold">
                    {title}
                  </BaseParagraph>
                </div>
              )}
              {/* Modal close dialog */}
              <IconButton
                type="button"
                className="!h-6 !w-6"
                shape={'full'}
                shadow={'muted'}
                size={'sm'}
                variant={'pastel'}
                color={'error'}
                onClick={() => setOpen(false)}
              >
                <ReIcon iconName="AiOutlineClose" />
              </IconButton>
            </div>
            {/* content */}
            <div className="custom__scrollbar max-h-[calc(100vh-80px)] overflow-auto rounded-b-xl">
              {children}
              {/* footer */}
              {footer && (
                <div className="rounded-b-xl bg-gray-100 px-4 py-3 backdrop-blur-sm dark:bg-muted-800/65">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BaseModal;
