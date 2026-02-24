'use client';

import type { Message, Session } from '@/models/all';
import { useState, useEffect, useContext } from 'react';
import SideBar from '@/components/sidebar';
import MainChat from '@/components/main-chat';
import Search from '@/components/search';
import { Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import MessengerChat from '@/components/messenger-chat';
import { UserContext } from '@/components/useContext/useContextUser';
import { SessionContext } from '@/hook/sessionContext';

import { createMessage, getAllMessageSession, getSession, get_user_info2, updateSession } from '@/utils/api';

import * as style1 from '@/styles/main.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/main.module.css';
import '@/styles/globals.css';
import getDate from '@/utils/date';
import { post } from '@/utils/request';

function ChatPage(prop: any) {
    const userToLayout = useContext(UserContext).user;
    const { saveOldSessions, oldSessions } = useContext(SessionContext);

    const [messages, setMessages] = useState<Message[]>([]);
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const [user, setUser] = useState<any>(userToLayout);
    const [isShowChatEmloyee, setIsShowChatEmloyee] = useState(false);
    const [renderSideBar, setRenderSideBar] = useState(true);
    const [isColHidden, setIsColHidden] = useState(false);

    const chageIdSession = async () => {
        // // Chờ cho cập nhật local storage hoàn tất trước khi tiếp tục
        // await new Promise((resolve) => setTimeout(resolve, 100)); // Thời gian chờ có thể thay đổi
        // const session_id = api.getDataFromLocal("session_id");
        // console.log(session_id);
        // setRefresh((prevRefresh) => !prevRefresh);
        // console.log(refresh);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsColHidden(window.innerWidth < 768); // 992 là kích thước màn hình tương ứng với LG breakpoint
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Xác định trạng thái ban đầu

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        getAllMessageSession(prop.params.session_id).then((sessionMessages) => {
            setMessages(sessionMessages);
        });
        get_user_info();
    }, [prop.params.session_id]);

    const get_user_info = async () => {
        if (user) return;

        const _user = await get_user_info2(); // Chờ Promise được giải quyết
        if (!_user) router.push('/login');
    };

    const convertNewlinesToBreaks = (inputString: string) =>
        inputString
            .split('\n')
            .map((line, index, array) => line + (index === array.length - 1 ? '' : '<br />'))
            .join('');

    const handleSearch = async (query: string, file?: File) => {
        const session_id = prop.params.session_id;

        const data = new FormData();
        const now = getDate();

        data.append('quote', query);
        if (file !== undefined) {
            data.append('file', file, file.name);
        }

        // Nếu giá trị là kiểu string, gán cho thuộc tính answer của đối tượng message
        const message1: Message = {
            question: query,
            answer: 'Loading ...',
            answer_time: getDate(),
            session_id: session_id,
            question_time: now,
        };

        // Thêm message mới vào danh sách messages
        const history: string[][] = [];
        const last3Messages = [...messages.slice(-1)]; // Lấy 1 giá trị cuối cùng của messages

        for (const message of last3Messages)
            if (message.message_summary && message.answer)
                history.push([`${message.message_summary}`, `${message.answer}`]);
        data.append('history', JSON.stringify(history));

        setMessages([...messages, message1]);
        post('/predict', data)
            .then(async (res) => {
                const response: IChatBotResponse = res.data;
                const answer = convertNewlinesToBreaks(response.answer);

                const message: Message = {
                    question: `${query}`,
                    answer: `${answer}`,
                    answer_time: getDate(),
                    session_id: session_id,
                    question_time: now,
                    message_summary: `${response.new_question}`,
                };

                const data = await createMessage(message);
                message.qa_id = data.qa_id;

                // Lấy session và đổi tên theo nội dung tóm tắt
                if (messages.length === 0) {
                    const sessionTam: Session = await getSession(prop.params.session_id);
                    sessionTam.name = response.new_question;
                    sessionTam.end_time = getDate();
                    await updateSession(sessionTam);
                    setRenderSideBar(!renderSideBar);
                }
                setMessages([...messages, message]);
            })
            .catch((err) => {
                const error_message: Message = {
                    question: query,
                    answer: 'Server đang lỗi, hãy thử lại sau!',
                    answer_time: getDate(),
                    session_id: session_id,
                    question_time: now,
                };
                setMessages([...messages, error_message]);
            });
    };

    return (
        <>
            <div className="row h-full w-full px-0 relative">
                <span
                    style={{ width: '335px' }}
                    className="h-100 p-0 d-block d-md-block d-lg-block d-xl-block d-xxl-block"
                >
                    <SideBar
                        user={user}
                        renderSideBar={renderSideBar}
                        saveOldSessions={saveOldSessions}
                        changeSession={chageIdSession}
                        oldSessions={oldSessions}
                        showEmloyeeMessager={() => {
                            setIsShowChatEmloyee(true);
                        }}
                    />
                </span>

                <Col style={{ width: showSideBar ? '10%' : '100%' }} className="p-0">
                    <Row className=" ">
                        <div
                            style={{ fontSize: '25px', overflow: 'hidden' }}
                            className="text-center center bg-black text-bg-dark w-100"
                        >
                            {isColHidden ? (
                                <span
                                    style={{
                                        textAlign: 'left',
                                        marginLeft: '0',
                                        marginRight: '10px',
                                        position: showSideBar ? 'initial' : 'absolute',
                                        left: '19px',
                                        top: '5px',
                                    }}
                                    className="z-2"
                                >
                                    <button
                                        type="button"
                                        className="btn text-white z-2"
                                        onClick={() => {
                                            setShowSideBar(!showSideBar);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-bricks"
                                            viewBox="0 0 16 16"
                                        >
                                            <title>ok</title>
                                            <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5zM3 4v2h4.5V4zm5.5 0v2H13V4zM3 10v2h4.5v-2zm5.5 0v2H13v-2zM1 1v2h3.5V1zm4.5 0v2h5V1zm6 0v2H15V1zM1 7v2h3.5V7zm4.5 0v2h5V7zm6 0v2H15V7zM1 13v2h3.5v-2zm4.5 0v2h5v-2zm6 0v2H15v-2z" />
                                        </svg>
                                    </button>
                                </span>
                            ) : null}
                            <div className={`${showSideBar && isColHidden ? 'd-none' : ''} py-2`}>Chatbot OU</div>
                        </div>
                    </Row>

                    <div className="row" style={{ height: '93%' }}>
                        <Col
                            xs={0}
                            sm={0}
                            md={0}
                            lg={0}
                            xl={9}
                            xxl={9}
                            className={`${
                                showSideBar && isColHidden ? 'd-none' : ''
                            } position-relative container-fluid text-center center  `}
                        >
                            <div
                                style={{
                                    height: '90%',
                                    width: '93%',
                                    overflowX: 'hidden',
                                    textAlign: 'left',
                                }}
                                className={`${(style1 as any).scrollbarHidden} position-absolute`}
                            >
                                <MainChat getValueS={handleSearch} messages={messages} />
                            </div>
                            <div
                                style={{ width: '97%' }}
                                className=" position-absolute bottom-0 mb-2 px-5 d-flex justify-content-center"
                            >
                                <div style={{ width: '100%' }} className="  text-center center ">
                                    <div style={{ width: '50px' }} />
                                    <Search getValueS={handleSearch} />
                                    <small className="text-muted">
                                        Hỗ trợ trả lời các câu hỏi liên quan đến học vụ, sổ tay sinh viên.
                                    </small>
                                </div>
                            </div>
                        </Col>
                    </div>
                </Col>
            </div>
            <div className={`position-absolute bottom-0 end-0 z-3 ${isShowChatEmloyee ? '' : 'd-none'} `}>
                {user && isShowChatEmloyee ? (
                    <MessengerChat
                        friend_id={0}
                        user_id={user.user_id}
                        handleClose={() => {
                            setIsShowChatEmloyee(false);
                        }}
                        fullname={user.full_name}
                        username={user.username}
                        key={user.user_id}
                    />
                ) : null}
            </div>
        </>
    );
}

export default ChatPage;
