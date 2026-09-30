import { useRef } from 'react';

export function useCopyText() {
  const fieldRef = useRef<HTMLInputElement>(null);
  const copyToClipboard = () => {
    if (fieldRef.current) {
      fieldRef.current.select();
      document.execCommand('copy');
      alert('Text copied to clipboard!');
    }
  };
  return { fieldRef, copyToClipboard };
}
