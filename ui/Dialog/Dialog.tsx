import * as React from 'react';
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
  useId,
  useTransitionStatus,
  useTransitionStyles
} from '@floating-ui/react';
import useContentHeight from './hooks/useContentHeight';

interface DialogOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  outsideClickClose?: boolean;
}

export function useDialog({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  outsideClickClose
}: DialogOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    open,
    onOpenChange: setOpen
  });

  const context = data.context;
  const click = useClick(context, {
    enabled: controlledOpen == null
  });
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
    enabled: outsideClickClose ? true : false
  });
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      outsideClickClose
    }),
    [open, setOpen, interactions, data, labelId, descriptionId, outsideClickClose]
  );
}

type ContextType =
  | (ReturnType<typeof useDialog> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    })
  | null;

const DialogContext = React.createContext<ContextType>(null);

export const useDialogContext = () => {
  const context = React.useContext(DialogContext);

  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />');
  }

  return context;
};

export function Dialog({
  children,
  ...options
}: {
  children: React.ReactNode;
} & DialogOptions) {
  const dialog = useDialog(options);
  return <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & DialogTriggerProps
>(function DialogTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useDialogContext();
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
      type="button"
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function DialogContent(props, propRef) {
    const { context: floatingContext, outsideClickClose, ...context } = useDialogContext();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const ref = useMergeRefs([context.refs.setFloating, propRef, contentRef]);

    const { isMounted, status } = useTransitionStatus(floatingContext, {
      duration: 500 // Adjust as needed
    });

    const contentHeight = useContentHeight(context.open, contentRef);

    const { styles: transitionStyles } = useTransitionStyles(floatingContext, {
      duration: 500, // Adjust as needed
      initial: {
        opacity: 0,
        transform: 'scale(1)'
      },
      open: {
        opacity: 1,
        transform: 'scale(1)'
      },
      close: {
        opacity: 0,
        transform: 'scale(0.50)'
      }
    });

    if (!isMounted) return null;

    return (
      <FloatingPortal>
        <FloatingOverlay
          className={`z-50 grid place-items-center bg-black/20 backdrop-blur-sm transition-all duration-300 ${
            status === 'open' ? 'opacity-100' : 'opacity-0'
          }`}
          lockScroll
        >
          <FloatingFocusManager context={floatingContext} modal={outsideClickClose}>
            <div
              ref={ref}
              aria-labelledby={context.labelId}
              aria-describedby={context.descriptionId}
              style={{
                ...transitionStyles,
                height: contentHeight,
                overflow: 'auto'
              }}
              className="custom__scrollbar transition-all duration-300"
              {...context.getFloatingProps(props)}
            >
              {props.children}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      </FloatingPortal>
    );
  }
);

export const DialogHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function DialogHeading({ children, ...props }, ref) {
  const { setLabelId } = useDialogContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Dialog root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  );
});

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(function DialogDescription({ children, ...props }, ref) {
  const { setDescriptionId } = useDialogContext();
  const id = useId();

  // Only sets `aria-describedby` on the Dialog root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  );
});

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function DialogClose(props, ref) {
  const { setOpen } = useDialogContext();
  return <button type="button" {...props} ref={ref} onClick={() => setOpen(false)} />;
});
