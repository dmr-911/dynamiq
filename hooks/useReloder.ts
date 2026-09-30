import { useEffect } from 'react';
import useWebSocket from './useWebSocket';
import { usePathname, useRouter } from 'next/navigation';

// This hook is used to reload the page when a message is received from the server
const useReloder = (url: string) => {
  const { isConnected, receivedMessage, sendMessage } = useWebSocket(url);
  const router = useRouter();
  const pathname = usePathname();

  // Reload the page if the received message contains the autoRelode key
  useEffect(() => {
    if (receivedMessage) {
      const parsedMessage = JSON.parse(receivedMessage);
      if (parsedMessage['autoRelode'] && parsedMessage.autoRelode === true) {
        // router.push(pathname);
        window.location.reload();
      }
    }
  }, [receivedMessage, router, pathname]);

  return { isConnected, receivedMessage, sendMessage };
};

export default useReloder;
