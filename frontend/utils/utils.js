import axios from 'axios';

// 共通のAPIクライアントの作成
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 共通のAPI呼び出し関数
export const fetchData = async (url, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(url, {
            ...options,
            headers: {
                Authorization: `Token ${token}`,
                ...options.headers,
            },
        });
        return response.data;
    } catch (error) {
        console.error('fetchData関数でエラーが発生しました:', error);
        throw error;
    }
};

export const postData = async (url, data, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.post(url, data, {
            ...options,
            headers: {
            Authorization: `Token ${token}`,
            ...options.headers,
            },
        });
      return response.data;
    } catch (error) {
        console.error('postData関数でエラーが発生しました:', error);
        throw error;
    }
};

export const deleteData = async (url, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        await apiClient.delete(url, {
            ...options,
            headers: {
                Authorization: `Token ${token}`,
                ...options.headers,
            },
        });
    } catch (error) {
        console.error('deleteData関数でエラーが発生しました:', error);
        throw error;
    }
};

export const patchData = async (url, data, options = {}) => {
    try {
    const token = localStorage.getItem('token');
        await apiClient.patch(url, data, {
            ...options,
            headers: {
            Authorization: `Token ${token}`,
            ...options.headers,
            },
        });
    } catch (error) {
        console.error('patchData関数でエラーが発生しました:', error);
        throw error;
    }
};