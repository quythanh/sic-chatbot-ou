'use client';
import { useState, useCallback, useEffect, use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import SideBar from '@/components/sidebar';
import MainChat from '@/components/main-chat';
import Search from '@/components/search';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as model1 from '@/models/all';
import * as api from '@/utils/api';
import { copyFileSync } from 'fs';
import '@/styles/main.module.css';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store'; // Import hooks từ store.ts
import IUser from '@/models/user';
import Spinner from 'react-bootstrap/Spinner';

import Placeholder from 'react-bootstrap/Placeholder';
import BackgroundMain from '@/components/loading/backgroundMain';

function ChatPage() {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState<model1.Message[]>([]);
    const [refresh, setRefresh] = useState(true);
    const [statusSearch, setStatusSearch] = useState(true);
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const chageIdSession = async () => {};
    const [isColHidden, setIsColHidden] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<IUser>();

    const get_user_info = async () => {
        try {
            const user: model1.Session[] = await api.get_idSession_by_user(); // Chờ Promise được giải quyết
            // console.log(user); // In ra để kiểm tra dữ liệu user
            // Tiếp tục xử lý dữ liệu user sau khi Promise đã được giải quyết
            if (!user.length) {
                const user = await api.get_user_info2();
                const newDate = getDate();
                const session: model1.Session = {
                    name: `session ${newDate}`,
                    start_time: newDate,
                    end_time: newDate,
                    user_id: user['user_id'] as number,
                };
                const session_id = await api.createSession(session);
                session_id ? router.push(`/chat-page/${session_id}`) : '';
            } else {
                router.push(`/chat-page/${user[0].session_id}`);
            }
        } catch (error: any) {
            if (error.message === 'Failed login') {
                console.log('Failed login : ', error.message);
                // Kiểm tra xem đối tượng error có tồn tại và có thuộc tính 'response' không
                router.push('/login'); // Điều hướng đến trang đăng nhập
            } else {
                console.error('Error fetching user session:', error);
                router.push('/login'); // Điều hướng đến trang đăng nhập

                // Xử lý lỗi khác nếu cần
            }
        }
    };
    useEffect(() => {
        // const token = api.getDataFromLocal('token')
        // let user:any;
        // const get_user_info = async(token:string) =>{
        //   try {
        //    user =  await api.get_user_info(token)
        //   } catch (error) {

        //   }
        // }
        // if(token){
        //   get_user_info(token)
        // }

        // get_user_info();
        const handleResize = () => {
            setIsColHidden(window.innerWidth < 768); // 992 là kích thước màn hình tương ứng với LG breakpoint
        };
        setIsMounted(true);
        window.addEventListener('resize', handleResize);
        handleResize(); // Xác định trạng thái ban đầu

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // console.log("cha");

        const getAllMessageSession = async () => {
            try {
                // console.log("messages ");
                const session_id = api.getDataFromLocal('session_id');
                const user = api.getDataFromLocal('user');
                !user ? router.push('/login') : '';

                const sessions = await api.getAllMessageSession(session_id);
                setMessages(sessions);
                // console.log("messages ", sessions);
            } catch (error) {
                console.error('Error:', error);

                return []; // Trả về một mảng trống nếu có lỗi xảy ra
            }
        };
        // console.log("messages 2");
        // getAllMessageSession();
    }, [refresh]);

    const getDate = () => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        // Định dạng thời gian cho MySQL
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // console.log(formattedDate); // In ra: "2024-03-02 22:12:39"

        return formattedDate;
    };

    // const [valueSearch, setValueS] = useState("")
    // const handleSearch = useCallback((value: string) => {
    //   setValueS(value);
    // }, [valueSearch]); // Thêm valueSearch vào dependencies

    return <BackgroundMain />;
}

export default ChatPage;
