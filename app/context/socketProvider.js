'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { createContext } from 'react';
import { io } from 'socket.io-client';



export const SocketContext = createContext();




 const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);
   
  const handleSetMessage = useCallback((data)=>{
         setMessages(data);
  },[])
  const sendMessage = useCallback(
    ({id,content}) => {
      console.log('Send Message', content); 

      if (socket) {
        socket.emit('event:message', {id,content});
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((parsedMessage) => { 
    if(parsedMessage){
      console.log("Message Received From the server...");
       setMessages((prev)=>[...prev,parsedMessage.content]);
    }
  }, []);

  useEffect(() => {
    const _socket = io('http://localhost:8000');
    setSocket(_socket);
    _socket.on('message', onMessageRec);

    return () => {
      _socket.disconnect();
      _socket.off('message', onMessageRec);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages,handleSetMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;