'use client'
import React, { createContext, useEffect, useState } from 'react';
import IUser from '@/models/user';
import * as api from "@/utils/api";
import * as url from "@/env/env"

interface userAndChat extends IUser {
    announcement ?: number;
}
interface ChatContextProps {
    socket: WebSocket | null;
    setSocket: (socket: WebSocket | null) => void;
    userAndChat: userAndChat[];
    setUserAndChat: (userAndChat: userAndChat[]) => void;
}


export const ChatContext = createContext<ChatContextProps>({
    socket: null,
    setSocket: () => {},
    userAndChat: [],
    setUserAndChat: () => {},
});

interface Props {
  children: React.ReactNode; // Đảm bảo có thuộc tính 'children' trong props
}
export const ChatProvider: React.FC<Props> = ({ children }) => {
    const [userAndChat, setUserAndChat] = useState<userAndChat[]>([]);

    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const newSocket = new WebSocket(`${url.SERVER_WEBSOCKET}`);
        
        newSocket.onopen = () => {
        
            console.log("Connected to WebSocket server");
          };
  
        setSocket(newSocket);   

        const get_number_chat = async()=>{
            try {
               const data = await api.get_number_chat();
               console.log("dataLayout",data)
               setUserAndChat(prev => [...data]);

            } catch (error) {
                
            }
        }
        get_number_chat();

    },[])

  return (
    <ChatContext.Provider value={{ socket, setSocket, userAndChat, setUserAndChat }}>
      {children}
    </ChatContext.Provider>
  );
};
