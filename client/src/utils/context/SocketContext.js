import React, { createContext } from "react";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    // create ws connection
    const wssUrl = process.env.REACT_APP_SERVER_URL
    const isLocalHost = wssUrl.includes('localhost')
    const socketProtocol = isLocalHost ? 'ws' : 'wss'
    const socket = new WebSocket(`${socketProtocol}://${process.env.REACT_APP_SERVER_URL.replace(/^.*\/\//, "")}`)

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
