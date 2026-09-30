'use client';
import { useCallback, useEffect, useState } from 'react';
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

export default useContentHeight;
