import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  Placement,
  FloatingPortal,
  FloatingFocusManager,
  useId,
  FloatingArrow,
  arrow,
  useTransitionStyles
} from '@floating-ui/react';
import { cn } from '../utils/cn';

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  indicatorArrow?: boolean;
  offsetDistance?: number;
}

export function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  indicatorArrow,
  offsetDistance = 5 // Default offset
}: PopoverOptions = {}) {
  const arrowRef = React.useRef(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetDistance),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5
      }),
      shift({ padding: 15 }),
      arrow({
        element: arrowRef
      })
    ]
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      arrowRef, // Make sure arrowRef is included in the returned object
      indicatorArrow,
      onOpenChange: setOpen,
      events: context.events,
      dataRef: context.dataRef,
      nodeId: context.nodeId,
      floatingId: context.floatingId
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId, indicatorArrow]
  );
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    })
  | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export function Popover({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed'
      })
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function PopoverContent({ style, ...props }, propRef) {
    const {
      context: floatingContext,
      refs,
      x,
      y,
      strategy,
      placement: actualPlacement,
      middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
      arrowRef,
      indicatorArrow,
      ...context
    } = usePopoverContext();

    // Add this line to use the transition styles
    const { isMounted, styles: transitionStyles } = useTransitionStyles(floatingContext, {
      initial: {
        opacity: 0,
        transform: 'scale(0.7)'
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

    const ref = useMergeRefs([refs.setFloating, propRef]);
    if (!isMounted) return null;
    if (!floatingContext.open) return null;

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    }[actualPlacement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'];

    return (
      <FloatingPortal>
        <FloatingFocusManager context={floatingContext} modal={context.modal}>
          <div
            ref={ref}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...style,
              ...transitionStyles
            }}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(props)}
            className="z-[99999] rounded-[.65rem] border border-muted-200 bg-[#f8f8f8] shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30"
          >
            {/*indicator arrow start  */}
            {indicatorArrow && (
              <div
                ref={arrowRef}
                className={cn(
                  'absolute transform border-[8px] border-b-transparent border-l-muted-100 border-r-transparent border-t-muted-100 dark:border-l-muted-950 dark:border-t-muted-950',

                  staticSide === 'top' && 'rotate-45',
                  staticSide === 'bottom' && 'rotate-[225deg]',
                  staticSide === 'right' && 'rotate-[135deg]',
                  staticSide === 'left' && '-rotate-45'
                )}
                style={{
                  left: arrowX != null ? `${arrowX}px` : '',
                  top: arrowY != null ? `${arrowY}px` : '',
                  right: '',
                  bottom: '',
                  [staticSide]: '-8px'
                  // ...(staticSide === 'top' || staticSide === 'bottom'
                  //   ? { borderLeft: 'none', borderRight: 'none' }
                  //   : { borderTop: 'none', borderBottom: 'none' })
                }}
              />
            )}
            {/*indicator arrow end  */}
            {props.children}
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  }
);

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function PopoverHeading(props, ref) {
  const { setLabelId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {props.children}
    </h2>
  );
});

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(function PopoverDescription(props, ref) {
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return <p {...props} ref={ref} id={id} />;
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
});
