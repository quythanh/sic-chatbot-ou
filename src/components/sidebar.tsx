'use client';
import type IUser from '@/models/user';
import type * as model1 from '@/models/all';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from 'react-bootstrap/Button';
import NewSession from '@/components/newSession';
import * as api from '@/utils/api';
import Spinner from 'react-bootstrap/Spinner';
import * as style1 from '@/styles/main.module.css';

import { getAllSessionUser } from '@/utils/api';

import getDate from '@/utils/date';

// Định nghĩa kiểu dữ liệu cho các sự kiện
interface MyEvents {
    valueChange?: [(newValue: string) => void];
    [key: string]: any; // Index signature cho kiểu string
    changeSession: () => void;
    showEmloyeeMessager: () => void;
    renderSideBar: boolean;
}

interface chat_employee extends model1.ChatWithEmloyee {
    announcement?: number;
    announcement_user?: number;
}
const SideBar = (
    { changeSession, showEmloyeeMessager, renderSideBar, saveOldSessions, oldSessions }: MyEvents,
    props: any,
) => {
    const [sessions, setSessions] = useState<model1.Session[]>(saveOldSessions);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userL, setUserL] = useState<IUser>(props.user);
    const [userAndChat, setUserAndChat] = useState<chat_employee | undefined>(undefined);
    useEffect(() => {
        setSessions(saveOldSessions);
    }, [saveOldSessions]);

    // trong một file khác, ví dụ main-chat.tsx
    const router = useRouter();

    const get_number_chat_user = async (user_id: number) => {
        try {
            const data: chat_employee = await api.get_number_chat_user(user_id as number);
            setUserAndChat(data);
        } catch (error) {}
    };

    useEffect(() => {
        if (userL)
            getAllSessionUser(userL.user_id as number).then((arrSession) => {
                setSessions(arrSession);
            });
    }, [renderSideBar]);

    useEffect(() => {
        () => oldSessions(sessions);
    }, [sessions]);

    useEffect(() => {
        setIsLoading(true);
        const fetchDataAndUpdateUser = async () => {
            try {
                const user = userL ?? (await get_user_info());
                setUserL(user);

                get_number_chat_user(user.user_id as number);
                if (user && 'user_id' in user) {
                    const arrSession = await api.getAllSessionUser(user['user_id'] as number);
                    console.log(arrSession);

                    setSessions(arrSession);
                    if (arrSession.length !== 0) {
                        const currentPath = window.location.pathname;
                        if (!currentPath.includes(`chat-page/${arrSession[0]['session_id']}`))
                            router.push(`/chat-page/${arrSession[0]['session_id']}`);
                    }
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchDataAndUpdateUser();
        setIsLoading(false);
    }, []);

    async function get_user_info() {
        try {
            let user;
            if (!userL) {
                user = await api.get_user_info2();
                setUserL(user);
            } else {
                user = userL;
            }

            if (user) {
                // console.log("u", user);
                setIsMounted(true);
                return user;
            }
            return null;
        } catch (error) {
            // console.log("Error:", error);
            // Handle error if necessary
            return null;
        }
    }

    const createSession = async () => {
        try {
            // console.log(22324)
            setIsLoading(true);
            let user;
            if (userL) {
                user = userL;
            } else {
                user = await get_user_info(); // Corrected to call the function
                // console.log('chay log sau khi tai')
            }

            if (user) {
                setUserL(user);
                // console.log("user1", user);
                // Sử dụng TypeScript assertion để khẳng định rằng user không phải là null hoặc undefined
                if ('user_id' in user) {
                    // console.log("user_id", user["user_id"]);
                    const newDate = getDate();
                    const session: model1.Session = {
                        name: `session ${newDate}`,
                        start_time: newDate,
                        end_time: newDate,
                        user_id: user['user_id'] as number,
                    };
                    const session_id = await api.createSession(session);
                    session_id ? router.push(`/chat-page/${session_id}`) : '';
                }
            }
            return user;
        } catch (error) {
            console.log('Error:', error);
            // Handle error if necessary
        }

        setIsLoading(false);
    };

    const updateSession = async (session: model1.Session) => {
        setIsLoading(true);
        try {
            const s = await api.updateSession(session);
            // console.log("put", session);
            setIsLoading(false);
            return s;
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
            return []; // Trả về một mảng trống nếu có lỗi xảy ra
        }
    };

    const deleteSession = async (session: model1.Session) => {
        await api.deleteSession(session.session_id as number);
        if (session.session_id === sessions[0].session_id) {
            if (sessions[1]) router.push(`/chat-page/${sessions[1].session_id}`);
            else createSession();
        }
        setSessions((prevSessions) => prevSessions.filter((s) => s.session_id !== session.session_id));
    };

    const handleSelectSession = async (session: model1.Session) => {
        setIsLoading(true);
        session.end_time = getDate();
        try {
            const s = await updateSession(session); // Chờ cho updateSession hoàn thành
            // Chỉ chuyển hướng khi không có lỗi xảy ra
            // console.log("updateS", s);
            s ? router.push(`/chat-page/${session.session_id}`) : '';
        } catch (error) {
            console.error('Error updating session:', error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="w-100 h-100 p-0 position-relative bg-dark">
                <div className={isLoading ? (style1 as any)['disabled-div'] : undefined}>
                    <button
                        type="button"
                        style={{
                            width: '91%',
                            marginLeft: '40px',
                            height: '45px',
                            margin: 'auto',
                            paddingLeft: '20px',
                        }}
                        className="position-absolute btn btn-outline-light top-2 m-3 text-center z-3"
                        onClick={createSession}
                    >
                        <b>Tạo mới</b>
                    </button>

                    <div
                        style={{
                            overflow: 'auto',
                            textAlign: 'left',
                            height: '70vh',
                        }}
                        className={(style1 as any).scrollbarHidden}
                    >
                        <div style={{ height: '70px' }} className="space" />
                        <div
                            className="position-relative"
                            style={{ width: '85%', textAlign: 'left', marginLeft: '25px' }}
                        >
                            {isLoading ? (
                                <div
                                    className="position-absolute"
                                    style={{
                                        top: '50%',
                                        right: '50%',
                                        transform: ' translate(-50%, -50%);',
                                        opacity: '1',
                                        zIndex: '2',
                                    }}
                                >
                                    <Spinner animation="border" variant="white" />
                                </div>
                            ) : null}

                            <div className="m-3" />

                            {sessions?.map((session: model1.Session, index: number) => (
                                <NewSession
                                    key={session.session_id}
                                    status={!index}
                                    name={session.name}
                                    session={session}
                                    getSession={handleSelectSession}
                                    deleteSession={deleteSession}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ height: '50px' }} className="w-100 position-absolute bottom-0 bg-black">
                    <br />
                    <div className="position-absolute bottom-0 w-100">
                        <Button
                            className="w-100 border-0 text-start px-5"
                            onClick={() => {
                                router.push('/login');
                            }}
                        >
                            <img width="35px" src="../images/logout.png" alt="Logout" className="inline-block" />
                            <b className="mx-2">Đăng xuất</b>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
