import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';
import Card from '../card/Card';
import { ReIcon } from '../../components/ReIcon/ReIcon';
import { cn } from '../../utils/cn';

interface ToggleBoxProps {
  isToggle?: boolean;
  open?: boolean;
  title?: string;
  shape?: 'straight' | 'rounded' | 'smooth' | 'curved';
  color?:
    | 'default'
    | 'contrast'
    | 'muted'
    | 'mutedContrast'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'transparent';
  growOnExpand?: boolean;
  spaced?: 'sm' | 'md' | 'lg' | 'none';
  header?: React.ReactNode;
  children: React.ReactNode;
  classes?: {
    container?: string;
    header?: string;
    headerContainer?: string;
    content?: string;
  };
  isOpened?: (open: boolean) => void;
}

// Debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Custom hook for managing content height
const useContentHeight = (isOpen: boolean, contentRef: React.RefObject<HTMLDivElement>) => {
  const [contentHeight, setContentHeight] = useState('0px');

  const updateHeight = useCallback(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setContentHeight('0px');
    }
  }, [isOpen, contentRef]);

  const debouncedUpdateHeight = debounce(updateHeight, 50);

  useEffect(() => {
    updateHeight();

    const resizeObserver = new ResizeObserver(debouncedUpdateHeight);
    const mutationObserver = new MutationObserver(debouncedUpdateHeight);

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isOpen, contentRef, debouncedUpdateHeight]);

  return contentHeight;
};

const ToggleBox: FC<ToggleBoxProps> = ({
  header,
  children,
  title,
  shape = 'smooth',
  color = 'contrast',
  growOnExpand,
  spaced,
  isToggle = false,
  open = false,
  classes,
  isOpened
}) => {
  const [panelOpened, setPanelOpened] = useState(open);
  // const [contentHeight, setContentHeight] = useState('0px');

  const toggleBoxContentRef = useRef<HTMLDivElement>(null);
  const contentHeight = useContentHeight(panelOpened, toggleBoxContentRef);

  useEffect(() => {
    setPanelOpened(open);
  }, [open]);

  useEffect(() => {
    if (isOpened) {
      isOpened(panelOpened);
    }
  }, [panelOpened, isOpened]);

  return (
    <Card
      shape={shape}
      color={color}
      shadow={panelOpened ? 'flat' : 'none'}
      className={cn(
        ` ${panelOpened && growOnExpand ? 'md:p-6' : ''} `,
        spaced && spaced === 'none'
          ? 'p-0'
          : spaced === 'md'
            ? 'p-6'
            : spaced === 'lg'
              ? 'p-7'
              : 'p-4',
        classes && classes?.container
        // '!bg-muted-100 dark:!bg-muted-900'
      )}
    >
      <div
        role="button"
        className={cn(
          `flex items-center gap-x-2 ${panelOpened ? '' : ''} ${isToggle ? 'cursor-pointer' : ''}`,
          classes && classes?.headerContainer
        )}
        onClick={() => {
          setPanelOpened(!panelOpened);
        }}
      >
        {header ? (
          <div className={cn(classes && classes?.header)}>{header}</div>
        ) : (
          <div>
            <h5 className="font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
              {title}
            </h5>
          </div>
        )}
        <div
          className={`pointer-events-none transition-all duration-300 ${
            panelOpened ? 'rotate-90' : 'hover:rotate-90'
          } ${
            isToggle
              ? 'flex h-8 w-8 items-center justify-center rounded-full text-muted-400 hover:bg-muted-100 dark:hover:bg-muted-800 [&>svg]:h-4'
              : ''
          }`}
        >
          <ReIcon iconName="BiChevronRight" className="text-2xl text-muted-400" />
        </div>
      </div>
      <div
        ref={toggleBoxContentRef}
        style={{
          maxHeight: contentHeight,
          transition: 'all 0.3s ease-in-out'
        }}
        className={cn(
          `grid grid-cols-1 gap-3 overflow-hidden ${panelOpened ? 'mt-0' : 'mt-0'}`,
          classes && classes?.content
        )}
      >
        {children}
      </div>
    </Card>
  );
};

export default ToggleBox;
