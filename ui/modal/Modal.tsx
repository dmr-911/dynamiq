import { ReIcon } from '../../components/ReIcon/ReIcon';
import React, { useEffect, useRef, type FC } from 'react';

interface ModalProps {
  open?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  classes?: {
    wrapper?: string | string[];
    backdrop?: string | string[];
    dialog?: string | string[];
  };
  children?: React.ReactNode;
  onBackdropClick?: () => void;
  isClose?: boolean;
  setOpen?: any;
}

const Modal: FC<ModalProps> = ({
  open,
  setOpen,
  size = 'md',
  classes,
  children,
  isClose,
  onBackdropClick
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onBackdropClick?.();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      } ${classes?.wrapper}`}
    >
      <div
        className="fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80"
        onClick={onBackdropClick}
      ></div>

      <div
        ref={modalRef}
        className={`relative mx-auto w-full ${
          size === 'sm' ? 'max-w-sm' : ''
        } ${size === 'md' ? 'max-w-md' : ''} ${
          size === 'lg' ? 'max-w-lg' : ''
        } ${size === 'xl' ? 'max-w-2xl' : ''} ${
          size === '2xl' ? 'max-w-3xl' : ''
        } ${size === '3xl' ? 'max-w-5xl' : ''}`}
      >
        <div
          className={`relative overflow-hidden rounded-md transition-all duration-300 ${
            classes?.dialog
          } ${open ? 'translate-y-0' : '-translate-y-4'}`}
        >
          {isClose && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-50 text-muted-400 duration-200 hover:text-red-500"
            >
              <ReIcon iconName="AiOutlineClose" />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
