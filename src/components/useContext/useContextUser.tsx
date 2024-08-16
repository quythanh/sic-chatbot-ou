import React, { createContext, useEffect, useState } from 'react';
import IUser from '@/models/user';
import { useRouter } from 'next/navigation';
import * as model1 from "@/models/all";
import * as api from "@/utils/api";
import ChatPage from '@/app/chat-page/page';
interface UserContextProps {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

interface Props {
  children: React.ReactNode; // Đảm bảo có thuộc tính 'children' trong props
}
export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false); // Biến trạng thái để kiểm soát việc gọi useEffect
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
  
      get_user_info();
      setIsLoaded(true);
      console.log("isloaded", isLoaded);
    
  }, []);

  const get_user_info = async () => {
    try {
      const session: model1.Session[] = await api.get_idSession_by_user();
      const user:IUser = await api.get_user_info2();
      setUser(user);
      setLoading(false); // Kết thúc trạng thái loading sau khi dữ liệu được tải xong

      if (session.length === 0) {
        const newDate = getDate();
        const session: model1.Session = {
          name: `session ${newDate}`,
          start_time: newDate,
          end_time: newDate,
          user_id: user["user_id"] as number,
        };
        const session_id = await api.createSession(session);
        session_id ? router.push(`/chat-page/${session_id}`) : "";
      } else {
        router.push(`/chat-page/${session[0].session_id}`);
      }
    } catch (error: any) {
      if (error.message === "Failed login") {
        console.log("Failed login : ", error.message);
        router.push("/login");
      } else {
        console.error("Error fetching user session:", error);
        router.push("/login");
      }
    }
  };

  const getDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };
 
  if (!user) {
    // return <div>Loading1...</div>; // Hiển thị trạng thái loading
    return <ChatPage></ChatPage>
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
