import axios from 'axios';
import { HOST_MODEL } from '@/env/env';

const request = axios.create({
    baseURL: HOST_MODEL,
});

export const get = async (path: string, options = {}) => {
    const response = await request.get(path, options);
    return response.data;
};

export const post = async (path: string, data = {}, options = {}) => {
    const response = await request.post(path, data, options);
    return response.data;
};

export const put = async (path: string, options = {}) => {
    const response = await request.put(path, options);
    return response.data;
};

export const patch = async (path: string, options = {}) => {
    const response = await request.patch(path, options);
    return response.data;
};

export const del = async (path: string, options = {}) => {
    const response = await request.delete(path, options);
    return response.data;
};

export default { get, post, put, patch, del };
