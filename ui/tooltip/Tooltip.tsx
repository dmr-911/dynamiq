'use client';
import { ReactNode, useRef, useState } from 'react';
import {
  ReferenceType,
  offset,
  shift,
  flip,
  useFloating,
  autoUpdate,
  useInteractions,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  arrow,
  useTransitionStyles,
  Placement,
  useClick
} from '@floating-ui/react';
import { cn } from '../../utils/cn';

export interface RenderOpenerProps extends Record<string, unknown> {
  ref: (node: ReferenceType | null) => void;
}

interface TooltipProps {
  content?: ReactNode;
  placement?: Placement;
  indicatorArrow?: boolean;
  children: ReactNode;
  trigger?: 'hover' | 'click' | 'focus';
  className?: string;
  arrowColor?: string;
}

export const Tooltip = ({
  indicatorArrow = true,
  content,
  children,
  placement = 'bottom',
  trigger = 'hover',
  className,
  arrowColor = 'bg-[#f8f8f8] dark:bg-muted-900'
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
    placement: actualPlacement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(12),
      flip(),
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const click = useClick(context);

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }[actualPlacement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'];

  const { styles: transitionStyles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transform: 'scale(0.8)'
    },
    open: {
      opacity: 1,
      transform: 'scale(1)'
    },
    close: {
      opacity: 0,
      transform: 'scale(0.8)'
    }
  });

  const interactions = [];
  if (trigger === 'hover') interactions.push(hover);
  if (trigger === 'focus') interactions.push(focus);
  if (trigger === 'click') interactions.push(click);
  interactions.push(dismiss, role);

  const { getReferenceProps, getFloatingProps } = useInteractions(interactions);

  return (
    <>
      <div
        ref={setReference}
        {...getReferenceProps()}
        style={{ display: 'inline-block', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
      {isOpen && content && (
        <div ref={setFloating} style={{ ...floatingStyles, zIndex: 99999 }} {...getFloatingProps()}>
          <div
            className={cn(
              'rounded-lg bg-[#f8f8f8] px-2 py-1 text-muted-500 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] dark:bg-muted-900 dark:text-muted-200',
              className && className
            )}
            style={transitionStyles}
          >
            {/*indicator arrow start  */}
            {indicatorArrow && (
              <div
                ref={arrowRef}
                className={cn('absolute h-3 w-3 rotate-45 transform', arrowColor)}
                style={{
                  left: arrowX != null ? `${arrowX}px` : '',
                  top: arrowY != null ? `${arrowY}px` : '',
                  right: '',
                  bottom: '',
                  [staticSide]: '-4px',
                  ...(staticSide === 'top' || staticSide === 'bottom'
                    ? { borderLeft: 'none', borderRight: 'none' }
                    : { borderTop: 'none', borderBottom: 'none' })
                }}
              />
            )}
            {/*indicator arrow end  */}

            {content}
          </div>
        </div>
      )}
    </>
  );
};
