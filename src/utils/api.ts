import type IUser from '@/models/user';
import * as model1 from '@/models/all';
import { API_BASE_URL, HOST_MODEL } from '@/env/env';
import { mutate } from 'swr';
import { parseDate } from './date';

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
};
// Lưu dữ liệu vào local storage
export const saveDataToLocal = (key: string, data: any) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        // Do something with localStorage here
        localStorage.setItem(key, JSON.stringify(data));
    } else {
        // Handle case when localStorage is not available
    }
};

// Lấy dữ liệu từ local storage
export const getDataFromLocal = (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        // Do something with localStorage here
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error parsing JSON data from local storage:', error);
            return null;
        }
    } else {
        // Handle case when localStorage is not available
    }
};

// Xóa dữ liệu từ local storage
export const removeDataFromLocal = (key: string) => {
    localStorage.removeItem(key);
};

// // Ví dụ về cách sử dụng
// const userData = { username: 'example', email: 'example@example.com' };

// // Lưu dữ liệu vào local storage
// saveDataToLocal('user', userData);

// // Lấy dữ liệu từ local storage
// const savedUserData = getDataFromLocal('user');
// console.log(savedUserData); // { username: 'example', email: 'example@example.com' }

// // Xóa dữ liệu từ local storage
// removeDataFromLocal('user');

export const login = async (userData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.error);
        }

        const responseData = await response.json();
        // console.log("login", responseData);
        //Xoas token
        removeDataFromLocal('token');
        // Lưu token vào local storage
        saveDataToLocal('token', responseData.access_token);
        // // Sau khi tạo thành công, refresh dữ liệu
        // mutate(`${API_BASE_URL}/login`);
        return responseData;
    } catch (error) {
        console.error('Error:', error as Error);
        return { error: error };
    }
};

export const createUser = async (userData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.error);
        }

        const user = await response.json();
        // console.log(user);
        return user;
    } catch (error) {
        console.error('Error:', error as Error);
        return { error: error };
    }
};

export const get_token_info = async (token: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get_token_info`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer  ${token} `,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get_token_info');
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const get_user_info = async (token: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get_user_info`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer  ${token} `,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get_token_info');
        }

        const user = await response.json();
        // console.log(response);
        return user;
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const get_user_info2 = async () => {
    try {
        const token = getDataFromLocal('token');
        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await fetch(`${API_BASE_URL}/get_user_info`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const user = await response.json();
        // console.log("User info:", user);
        return user;
    } catch (error) {
        console.error('Error:', error);
        return; // Trả về đối tượng rỗng nếu có lỗi
    }
};

export const get_idSession_by_user = async () => {
    try {
        const token = getDataFromLocal('token');
        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await fetch(`${API_BASE_URL}/users/getIDSession`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            throw new Error('Failed login');
        }
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const user = await response.json();
        // console.log("User info:", user);
        return user;
    } catch (error) {
        console.error('Error:', error);
        return; // Trả về đối tượng rỗng nếu có lỗi
    }
};

export const updateUser = async (data: IUser) => {
    try {
        const token = getDataFromLocal('token');
        if (!token) {
            throw new Error('Token is missing');
        }
        // console.log('data', data)
        const response = await fetch(`${API_BASE_URL}/users/${data.user_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const user = await response.json();
        // console.log("User info:", user);
        return user;
    } catch (error) {
        console.error('Error:', error);
        return; // Trả về đối tượng rỗng nếu có lỗi
    }
};

export const createSession = async (data: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to create session');
        }

        const session = await response.json(); // Đợi cho response.json() hoàn thành
        console.log('session: ', session);

        return session['session_id']; // Đảm bảo bạn đã đóng dấu nháy và thêm await ở trước response.json()
    } catch (error) {
        console.error('Error:', error as Error);
        return { error: (error as Error).message }; // Trả về một object với thông báo lỗi
    }
};

export const getAllSession = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        mutate(`${API_BASE_URL}/sessions`);
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getSession = async (session_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${session_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const session: model1.Session = await response.json();
        session.start_time = parseDate(session.start_time);
        return session;
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const deleteSession = async (session_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${session_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete session');
        }

        // mutate(`${API_BASE_URL}/sessions`);
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getAllSessionUser = async (user_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/user/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const sessions: model1.Session[] = await response.json();

        return sessions.map((session) => {
            session.start_time = parseDate(session.start_time);
            return session;
        });
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const updateSession = async (session: model1.Session) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${session.session_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(session),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const createMessage = async (message: model1.Message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error('Failed to message');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getAllMessageSession = async (session_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/session/${session_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getAllMessage = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        // console.log(response.json)
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const updateMessage = async (message: model1.Message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${message.qa_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const postModelChatbot = async (input: model1.setValueModel) => {
    try {
        const response = await fetch(`${HOST_MODEL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        const data = response.json();
        // console.log('chatbot', data)
        return data;
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const postModelGPT = async (question: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/gpt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        const data = response.json();
        // console.log('chatbot', data)
        return data;
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const createMessageEmloyee = async (message: model1.ChatWithEmloyee) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chatEmloyees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error('Failed to message');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getChatEmloyeesUser = async (user_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chatEmloyees/user/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
    return;
};

export const updateChatWithEmloyee = async (chat_employee: model1.ChatWithEmloyee) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chatEmloyees/${chat_employee.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chat_employee),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }
        //  mutate(`${API_BASE_URL}/sessions/${session.session_id}`)
        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getAllUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const createNewPage = async (page: model1.NewPage) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(page),
        });

        if (!response.ok) {
            throw new Error('Failed to create page');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const getAllNewPage = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/pages`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to get new pages');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
        return [];
    }
};

export const getAllNewPageByUserID = async (user_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/user/${user_id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to get new pages');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
        return [];
    }
};

export const updateNewPage = async (NewPage: model1.NewPage) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${NewPage.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(NewPage),
        });

        if (!response.ok) {
            throw new Error('Failed to update data');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
    }
};

export const get_number_chat = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/numberChat`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to get new pages');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
        return [];
    }
};

export const get_number_chat_user = async (user_id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/numberChat/${user_id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to get new pages');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error as Error);
        return [];
    }
};
