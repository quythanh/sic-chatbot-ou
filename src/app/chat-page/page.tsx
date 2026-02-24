'use client';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/main.module.css';
import BackgroundMain from '@/components/loading/backgroundMain';

const ChatPage = () => {
    const [isColHidden, setIsColHidden] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
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

    return <BackgroundMain />;
};

export default ChatPage;
