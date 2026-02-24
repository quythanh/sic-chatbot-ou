import type IUser from '@/models/user';
import type * as model1 from '@/models/all';

import { Fragment, useEffect, useRef, useState } from 'react';

import Chatbox from '@/components/chatbox';
import { get_user_info2 } from '@/utils/api';
import hash from '@/utils/hash';

const MEMBERS: string[] = ['Bùi Tiến Phát', 'Tsàn Quý Thành', 'Nguyễn Thảo Nhi', 'Trịnh Huỳnh Thịnh Khang'];

// Interface MainChatProp
interface MainChatProp {
    user?: IUser;
    bot: IUser;
    user_messenger: string[];
    bot_messenger: string[];
}
interface IMessages {
    messages: model1.Message[];
    getValueS?: (value: string) => void;
}

const EmptyChatView = () => (
    <div
        style={{
            height: '100%',
            textAlign: 'center',
            alignItems: 'center',
            marginTop: 43,
        }}
    >
        <div style={{ width: '100%', display: 'grid', placeItems: 'center' }} className="w-100">
            <div style={{ width: '400px' }}>
                <div className="p-0" style={{ marginTop: '80px' }}>
                    <img src="../images/bodyOU.png" width="350px" height="250px" alt="Body" />
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <small>Members</small>
                        {MEMBERS.map((member) => (
                            <Fragment key={`member_${member}`}>
                                <br />
                                <strong>{member}</strong>
                            </Fragment>
                        ))}
                    </div>
                    <div className="col">
                        <small>Lecturer</small>
                        <br />
                        <strong>Dương Hữu Thành</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Function MainChat
const MainChat = ({ messages, getValueS }: IMessages) => {
    const endRef = useRef<HTMLDivElement>(null);
    const [userL, setUserL] = useState<IUser>();

    useEffect(() => {
        get_user_info2().then((user) => {
            setUserL(user);
        });

        scrollToBottom();
    }, []);

    // Hàm để cuộn scroll đến cuối thẻ
    const scrollToBottom = () => {
        if (endRef.current === null) return;
        endRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
        });
    };

    // Tạo đối tượng dataMainChat có kiểu MainChatProp và gán giá trị cho các thuộc tính của nó
    const dataMainChat: MainChatProp = {
        user: userL,
        bot: {
            user_id: 0,
            username: 'Chatbot OU',
            password: '134',
            status: true,
            img: '/images/bot_avt.jpg',
        },
        user_messenger: ['1sefesfges', '2efwefef'],
        bot_messenger: ['bot1sdgesgsg', 'bot2dsgeshehs'],
    };

    return (
        <div className="px-3 " style={{ paddingTop: '10px' }}>
            {dataMainChat.user &&
                (!messages || !messages.length ? (
                    <EmptyChatView />
                ) : (
                    messages?.map((message: model1.Message, idx) => (
                        <Fragment key={`chat_${idx}`}>
                            <Chatbox
                                owner={dataMainChat.user!}
                                messenger={message.question}
                                mesengerProp={message}
                                getValueS={getValueS}
                                time={message.question_time}
                            />
                            <br />
                            <Chatbox
                                owner={dataMainChat.bot}
                                bot={true}
                                messenger={message.answer}
                                mesengerProp={message}
                                getValueS={getValueS}
                            />
                            <br />
                        </Fragment>
                    ))
                ))}
            <div ref={endRef} className="w-100 float-end" />
        </div>
    );
};

export default MainChat;
