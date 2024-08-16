import model1 from '@/models/all';
import { Row, Col, Button } from 'react-bootstrap';
import { useState, useCallback, useEffect, memo, useMemo, useContext, useTransition } from 'react';
import Search from '@/components/search';
import * as api from '@/utils/api';
import { Trykker } from 'next/font/google';
import * as url from '@/env/env';
import Spinner from 'react-bootstrap/Spinner';
import { ChatContext } from './useContext/useContextChat';
import { mutate } from 'swr';
import { API_BASE_URL, HOST_MODEL } from '@/env/env';
interface messenger {
    username: string;
    fullname?: string;
    chat_employee?: model1.ChatWithEmloyee[]; // Corrected spelling here
    handleClose: () => void;
    onSendData?: (user_id: number) => void;
    user_id: number;
    friend_id: number;
}

function MessengerChat(prop: messenger) {
    const socketToLayout = useContext(ChatContext).socket;
    const { userAndChat, setUserAndChat } = useContext(ChatContext);
    const [statusSearch, setStatusSearch] = useState(true);
    const [listMessage, setListMessage] = useState<model1.ChatWithEmloyee[]>(prop.chat_employee || []);
    const [emloyee, setEmloyee] = useState(false);
    const handleSearch = async (value: string) => {
        scrollToBottom();
        sendMessage(value);
    };

    const [socket, setSocket] = useState<WebSocket | null>(socketToLayout);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadValue, setIsLoadValue] = useState(false);
    const getChatEmloyeesUser = async (user_id: number) => {
        try {
            const c = await api.getChatEmloyeesUser(user_id).then((data) => {
                // Data is the resolved value of the Promise, which is an array of objects

                setListMessage((prevM) => [...data]);
                setIsLoadValue(true);

                data.map((item: model1.ChatWithEmloyee) => {
                    if (prop.user_id == 0) {
                        if (!item.emloyee && item.status == false) {
                            // khoong chow
                            item.status = true;
                            api.updateChatWithEmloyee(item);
                        }
                    } else {
                        if (item.emloyee && item.status == false) {
                            // khoong chow
                            item.status = true;
                            api.updateChatWithEmloyee(item);
                        }
                    }
                });
            });

            // update cacs message setstatus = true
        } catch (error) {
            console.error('error', error);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
            console.log('call scroll');
        }, 100); // Gọi sau khi render
    }, [listMessage, isLoading]);
    useEffect(() => {
        scrollToBottom();
        setIsLoading(true);
        const user_id = prop.user_id; // Thay prop.params.id bằng cách lấy user_id từ props của bạn
        console.log('user_id roket', user_id);
        if (user_id == 0) {
            setEmloyee((prev) => true);
            console.log('0sfe', user_id);
            getChatEmloyeesUser(prop.friend_id);
        } else {
            getChatEmloyeesUser(user_id);
        }

        let newSocket: WebSocket | null = null;
        if (socket?.readyState == WebSocket?.OPEN) {
            newSocket = socket;
            console.log('socket đã  tồn tại', newSocket);
        } else {
            newSocket = new WebSocket(`${url.SERVER_WEBSOCKET}`);
            if (newSocket && newSocket.readyState == WebSocket.OPEN) {
                console.log('dùng lại kết nối cũ');
            } else {
                newSocket.onopen = () => {
                    console.log('Connected to WebSocket server');
                };
            }
        }

        newSocket.onmessage = (event) => {
            console.log(event);
            const message = JSON.parse(event.data);
            console.log(message);
            if (message.friend_id == user_id && message.user_id == prop.friend_id && message.message != '') {
                const item: model1.ChatWithEmloyee =
                    user_id == 0
                        ? {
                              user_id: message.user_id,
                              emloyee: false,
                              messenger: message.message,
                              status: false,
                              datetime: getDate(),
                          }
                        : {
                              user_id: user_id,
                              emloyee: true,
                              messenger: message.message,
                              status: false,
                              datetime: getDate(),
                          };
                // prop.user_id != 0 ?
                // createMessageEmloyee(item)
                // :''
                // setReceivedMessages(prevMessages => [...prevMessages, message]);
                setListMessage((prevMessages) => [...prevMessages, item]);

                const tam = [...userAndChat];
                const user1 = tam.find((item) => item.user_id == prop.friend_id);
                if (user1) {
                    const updatedUser = {
                        ...user1,
                        announcement: (user1.announcement || 0) + 1,
                    };
                    const updatedUsers = userAndChat.map((u) => (u.user_id === user1.user_id ? updatedUser : u));
                    setUserAndChat(updatedUsers);
                }
            }
        };

        sendMessageSocket(newSocket);
        setIsLoading(false);
        setSocket(newSocket);

        // Không cần return một hàm từ useEffect
    }, [prop.user_id]);

    const handleClose = () => {
        console.log('handleClose is called');
        prop.handleClose(); // Đảm bảo rằng hàm handleClose được gọi khi cần thiết
    };
    const createMessageEmloyee = async (message: model1.ChatWithEmloyee) => {
        try {
            await api.createMessageEmloyee(message);
        } catch (error) {
            console.error('Error:', error);

            return []; // Trả về một mảng trống nếu có lỗi xảy ra
        }
    };
    const sendMessage = (message: string) => {
        console.log('socket', socket);
        console.log('message', message.trim());
        scrollToBottom();
        if (socket && socket.readyState === WebSocket.OPEN) {
            const data = {
                user_id: prop.user_id.toString(),
                message: message,
                friend_id: prop.friend_id.toString(),
            };
            const item: model1.ChatWithEmloyee = {
                user_id: prop.user_id,
                emloyee: emloyee,
                messenger: message,
                status: false,
                datetime: getDate(),
            };

            prop.user_id != 0
                ? createMessageEmloyee(item)
                : ((item.user_id = prop.friend_id), createMessageEmloyee(item));

            setListMessage((prevMessages) => [...prevMessages, item]);
            const jsonData = JSON.stringify(data);
            socket.send(jsonData);
            console.log('sf');
        }
    };

    const sendMessageSocket = (Esocket: WebSocket) => {
        scrollToBottom();
        console.log('socket', Esocket);

        const message = '';
        if (Esocket && Esocket.readyState === WebSocket.OPEN) {
            const data = {
                user_id: prop.user_id.toString(),
                message: message,
                friend_id: prop.friend_id.toString(),
            };
            const item: model1.ChatWithEmloyee = {
                user_id: prop.user_id,
                emloyee: emloyee,
                messenger: message,
                status: false,
                datetime: getDate(),
            };

            const jsonData = JSON.stringify(data);
            Esocket.send(jsonData);
            console.log('sf1');
        }
        console.log('sqưef');
    };
    function scrollToBottom() {
        const element = document.getElementById('endMessageEmployee');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            });
        }
    }

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

        console.log(formattedDate); // In ra: "2024-03-02 22:12:39"

        return formattedDate;
    };

    return (
        <>
            <div
                style={{
                    width: '300px',
                    height: '400px',
                    borderColor: 'black',
                    backgroundColor: '#E0E0E0',
                }}
                className="rounded-2 mx-2 border-2 position-relative shadow"
            >
                <Row
                    style={{ height: '50px', marginLeft: '0px' }}
                    className="d-flex w-100 rounded-2 center align-items-center  bg-primary "
                >
                    <Col style={{ paddingLeft: '15px' }} className="d-flex justify-items-center text-white">
                        {prop.fullname ? prop.fullname : prop.username}
                    </Col>
                    <div
                        onClick={() => {
                            if (prop.onSendData) {
                                if (prop.user_id == 0) prop.onSendData(prop.friend_id);
                                else prop.onSendData(prop.user_id);
                            }
                            handleClose();
                        }}
                        style={{ width: '50px', height: '50px' }}
                        className="p-0 d-flex center align-items-center rounded-0  justify-content-center  btn btn-outline-danger border-0"
                    >
                        <img className=" " width="30px" src="/images/delete.png"></img>
                    </div>
                </Row>
                {/* body */}
                <div
                    style={{
                        width: '100%',
                        height: '280px',
                        overflowY: 'auto',
                        backgroundColor: '#E0E0E0',
                    }}
                    className="px-3"
                >
                    <br />
                    {(() => {
                        if (!listMessage) return null;

                        return listMessage.map((item) => {
                            if (emloyee) {
                                return item.emloyee ? (
                                    <div
                                        style={{
                                            width: '200px',
                                            maxWidth: '230px',
                                            wordWrap: 'break-word',
                                            backgroundColor: '#99CCFF',
                                            float: 'right',
                                        }}
                                        className="rounded-2 px-2 py-1"
                                    >
                                        {item.messenger}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: '200px',
                                            maxWidth: '230px',
                                            wordWrap: 'break-word',
                                        }}
                                        className="bg-white d-inline-block rounded-2 px-2 my-2 py-1"
                                    >
                                        {item.messenger}
                                    </div>
                                );
                            }

                            return !item.emloyee ? (
                                <div
                                    style={{
                                        width: '200px',
                                        maxWidth: '230px',
                                        wordWrap: 'break-word',
                                        backgroundColor: '#99CCFF',
                                        float: 'right',
                                    }}
                                    className="rounded-2 px-2 py-1"
                                >
                                    {item.messenger}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: '200px',
                                        maxWidth: '230px',
                                        wordWrap: 'break-word',
                                    }}
                                    className="bg-white d-inline-block rounded-2 py-1 px-2 my-2"
                                >
                                    {item.messenger}
                                </div>
                            );
                        });
                    })()}
                    {listMessage
                        ? listMessage?.map((item: model1.ChatWithEmloyee, index: number) => {
                              return (
                                  <>
                                      {emloyee ? (
                                          item.emloyee ? (
                                              <div
                                                  style={{
                                                      width: '200px',
                                                      maxWidth: '230px',
                                                      wordWrap: 'break-word',
                                                      backgroundColor: '#99CCFF',
                                                      float: 'right',
                                                  }}
                                                  className="rounded-2 px-2 py-1"
                                              >
                                                  {item.messenger}
                                              </div>
                                          ) : (
                                              <div
                                                  style={{
                                                      width: '200px',
                                                      maxWidth: '230px',
                                                      wordWrap: 'break-word',
                                                  }}
                                                  className="bg-white d-inline-block rounded-2 px-2 my-2 py-1"
                                              >
                                                  {item.messenger}
                                              </div>
                                          )
                                      ) : !item.emloyee ? (
                                          <div
                                              style={{
                                                  width: '200px',
                                                  maxWidth: '230px',
                                                  wordWrap: 'break-word',
                                                  backgroundColor: '#99CCFF',
                                                  float: 'right',
                                              }}
                                              className="rounded-2 px-2 py-1"
                                          >
                                              {item.messenger}
                                          </div>
                                      ) : (
                                          <div
                                              style={{
                                                  width: '200px',
                                                  maxWidth: '230px',
                                                  wordWrap: 'break-word',
                                              }}
                                              className="bg-white d-inline-block rounded-2 py-1 px-2 my-2"
                                          >
                                              {item.messenger}
                                          </div>
                                      )}
                                  </>
                              );
                          })
                        : null}

                    {!isLoadValue ? (
                        <Button variant="primary" disabled className="float-end">
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                            Tải dữ liệu...
                        </Button>
                    ) : null}

                    <div id="endMessageEmployee" className="w-100 float-end" />
                    {isLoading ? (
                        <Button variant="primary" disabled className="float-end">
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                            Đang kết nối server...
                        </Button>
                    ) : null}
                </div>

                {/* body */}
                <div className="position-absolute bottom-0 mx-2">
                    <Search getValueS={handleSearch} />
                </div>
            </div>
        </>
    );
}

export default MessengerChat;
