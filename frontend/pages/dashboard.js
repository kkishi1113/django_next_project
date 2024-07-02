import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Todo from '../components/Todo';

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  // 共通のAPIクライアントの作成
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  // 共通のエラーハンドリング関数
  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      alert('セッションの有効期限が切れました。再度ログインしてください。');
      localStorage.removeItem('token');
      router.push('/');
    } else {
      console.error('エラーが発生しました:', error);
    }
  };

  // 共通のAPI呼び出し関数
  const fetchData = async (url, options = {}) => {
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
      handleError(error);
    }
  };

  const postData = async (url, data, options = {}) => {
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
      handleError(error);
    }
  };

  const deleteData = async (url, options = {}) => {
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
      handleError(error);
    }
  };

  const patchData = async (url, data, options = {}) => {
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
      handleError(error);
    }
  };

  useEffect(() => {
    console.log("useEffect実行");
    const fetchUserData = async () => {
      const user = await fetchData('/user/');
      setUsername(user.username);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await postData('/logout/', {});
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="flex">
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} />
      <div className="flex-grow container mx-auto ml-72 mr-8">
        <Header username={username} onLogout={handleLogout} />
        <main>
          <h2 className="text-lg mb-4">ようこそ、<span className="font-bold">{username}</span>さん</h2>
          <Todo fetchData={fetchData} postData={postData} patchData={patchData} deleteData={deleteData} />
        </main>
      </div>
    </div>
  );
};

Dashboard.requiresAuth = true;

export default Dashboard;
