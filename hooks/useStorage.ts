import { useEffect } from 'react';
import useWebSocket from './useWebSocket';

// Interface for the storage command
interface WebSocketCommand {
  store: 'localstorage' | 'sessionstorage';
  action: 'set' | 'get' | 'delete' | 'update' | 'get-all';
  key: string;
  value?: any;
}

// This hook is used to handle storage commands from the server
const useStorage = (url: string) => {
  const { isConnected, receivedMessage, sendMessage } = useWebSocket(url);

  // Handle the received message from the server and execute the storage command
  useEffect(() => {
    if (receivedMessage) {
      const messageData = JSON.parse(receivedMessage);
      if (messageData['storage']) {
        messageData.storage.forEach((command: WebSocketCommand) => {
          console.log('command', command);
          handleStorageCommand(command);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

  // Handle the storage command
  const handleStorageCommand = (command: WebSocketCommand) => {
    const { store, action, key, value } = command;
    const storage = store === 'localstorage' ? localStorage : sessionStorage;

    switch (action) {
      case 'set':
        storage.setItem(key, value);
        break;
      case 'get':
        const retrievedValue = storage.getItem(key);
        if (retrievedValue !== null) {
          sendMessage(JSON.stringify({ store, action, key, value: retrievedValue }));
        }
        break;
      case 'get-all':
        const allKeys = Object.keys(storage);
        allKeys.forEach((key) => {
          const value = storage.getItem(key);
          sendMessage(JSON.stringify({ store, action: 'get-all', key, value }));
        });
        break;
      case 'delete':
        storage.removeItem(key);
        break;
      case 'update':
        storage.setItem(key, value);
        break;
      default:
        console.error('Unknown action:', action);
    }
  };

  return { isConnected };
};

export default useStorage;
