'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';

const Drawer = ({
  children,
  placement = 'left',
  setIsOpen,
  isOpen = false,
  drawerColor,
  backdropColor,
  backdropOpacity,
  closeOutSide = true,
  width
}: {
  children: ReactNode;
  placement: 'left' | 'right' | 'bottom' | 'top';
  setIsOpen: any;
  isOpen: boolean;
  drawerColor?: string;
  backdropColor?: string;
  backdropOpacity?: number;
  closeOutSide?: boolean;
  width?: string;
}) => {
  const containerRef = useRef<HTMLInputElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);

  const drawerRef = useRef<HTMLInputElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const handleTouchStart = (e: any) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };
  //   touch move for open close toggle
  const handleTouchMove = (e: any) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
    const translateX = Math.min(0, currentX.current - startX.current);
    if (drawerRef.current) {
      drawerRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };
  //  touched for open close toggle system
  const handleTouchEnd = () => {
    isDragging.current = false;
    const threshold = 50;
    if (currentX.current - startX.current > threshold) {
      closeOutSide && setIsOpen(true);
    } else if (startX.current - currentX.current > threshold) {
      closeOutSide && setIsOpen(false);
    }
    if (drawerRef.current) {
      drawerRef.current.style.transform = '';
    }
  };
  const screenHeight = window.screen.height;
  //   compare height and screenHeight
  let cmpHeight = screenHeight < height;
  //   floating check right left and top bottom style
  const drawerFloatingFunction = () => {
    if (placement == 'top') {
      return `left-0 top-0 h-[${height}] w-full`;
    } else if (placement == 'bottom') {
      return `bottom-0 left-0 h-[${height}] w-full`;
    } else if (placement == 'left') {
      return `top-0 left-0 h-full w-64`;
    } else if (placement == 'right') {
      return `top-0 right-0 h-full w-64`;
    }
  };
  //   open for axios check function
  const drawerOpenFloatingFunction = (open: boolean) => {
    if (placement == 'top') {
      return open ? `translate-y-0` : `-translate-y-[150%]`;
    } else if (placement == 'bottom') {
      return open ? `translate-x-0` : `translate-y-[150%]`;
    } else if (placement == 'left') {
      return open ? `translate-x-0` : `-translate-x-[150%]`;
    } else if (placement == 'right') {
      return open ? `translate-x-0` : `translate-x-[150%]`;
    }
  };

  return (
    <div className="relative">
      <div
        ref={drawerRef}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
        className={`custom__scrollbar fixed overflow-auto bg-muted-200 text-muted-600 dark:bg-muted-800 dark:text-muted-200 ${drawerFloatingFunction()} transform ${drawerOpenFloatingFunction(
          isOpen
        )} z-[9999999999999999999] transition-transform duration-300 ease-in-out`}
        // onClick={() => closeOutSide && setIsOpen(!open)}
        style={{
          background: drawerColor ? drawerColor : '',
          ...(width &&
            (placement === 'left' || placement === 'right') && {
              width: width
            })
        }}
      >
        <div
          className={` ${cmpHeight ? 'h-screen overflow-y-scroll' : 'h-full'} `}
          ref={containerRef}
        >
          {' '}
          {children}
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
            isOpen ? 'pointer-events-auto opacity-50' : 'pointer-events-none opacity-0'
          } z-[9999]`}
          onClick={() => closeOutSide && setIsOpen(!open)}
          style={{
            background: backdropColor ? backdropColor : 'black',
            opacity: backdropOpacity ? backdropOpacity : 0.3
          }}
        ></div>
      )}
    </div>
  );
};

export default Drawer;
