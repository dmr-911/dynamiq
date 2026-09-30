import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketHook {
  isConnected: boolean;
  receivedMessage: string;
  sendMessage: (message: string) => void;
}

const useWebSocket = (url: string): WebSocketHook => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [receivedMessage, setReceivedMessage] = useState<string>('');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connectWebSocket = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    socketRef.current = new WebSocket(url);

    socketRef.current.addEventListener('open', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    socketRef.current.addEventListener('message', (event) => {
      setReceivedMessage(event.data);
    });

    socketRef.current.addEventListener('close', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      scheduleReconnect();
    });

    socketRef.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      scheduleReconnect();
    });
    // eslint-disable-next-line
  }, [url]);

  const disconnectWebSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current !== null) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current === null) {
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectWebSocket();
      }, 5000);
    }
  }, [connectWebSocket]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
    return disconnectWebSocket;
  }, [connectWebSocket, disconnectWebSocket]);

  return {
    isConnected,
    receivedMessage,
    sendMessage
  };
};

export default useWebSocket;

// ------------ OLD CONNECTION CODE -------------

// import { useEffect, useRef, useState } from 'react';

// // return type of the useWebSocket hook
// interface WebSocketHook {
//   isConnected: boolean;
//   receivedMessage: string;
//   // eslint-disable-next-line
//   sendMessage: (message: string) => void;
// }

// const useWebSocket = (url: string): WebSocketHook => {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [receivedMessage, setReceivedMessage] = useState<string>('');
//   const reconnectInterval = useRef<number | null>(null);

//   // The useEffect hook is used to connect and disconnect the WebSocket.
//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       disconnectWebSocket();
//     };
//     // eslint-disable-next-line
//   }, [url]);

//   // The connectWebSocket function is used to create a new WebSocket connection.
//   const connectWebSocket = () => {
//     const newSocket = new WebSocket(url);
//     setSocket(newSocket);

//     newSocket.addEventListener('open', () => {
//       console.log('WebSocket connected');
//       setIsConnected(true);
//       if (reconnectInterval.current !== null) {
//         clearInterval(reconnectInterval.current);
//         reconnectInterval.current = null;
//       }
//     });

//     newSocket.addEventListener('message', (event) => {
//       // console.log('Received:', event.data);
//       setReceivedMessage(event.data);
//     });

//     newSocket.addEventListener('close', () => {
//       console.log('WebSocket disconnected');
//       setIsConnected(false);
//       scheduleReconnect();
//     });

//     newSocket.addEventListener('error', (error) => {
//       console.error('WebSocket error:', error);
//       setIsConnected(false);
//       scheduleReconnect();
//     });
//   };

//   // The disconnectWebSocket function is used to close the WebSocket connection.
//   const disconnectWebSocket = () => {
//     if (socket) {
//       socket.close();
//     }
//   };

//   // The scheduleReconnect function is used to schedule a reconnection attempt.
//   const scheduleReconnect = () => {
//     if (reconnectInterval.current === null) {
//       // Attempt to reconnect every 5 seconds
//       reconnectInterval.current = window.setInterval(connectWebSocket, 5000);
//       console.log('Reconnecting in 5 seconds...');
//     }
//   };

//   // The sendMessage function is used to send a message through the WebSocket.
//   const sendMessage = (message: string) => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(message);
//     }
//   };

//   return {
//     isConnected,
//     receivedMessage,
//     sendMessage
//   };
// };

// export default useWebSocket;
