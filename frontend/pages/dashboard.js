import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Todo from '../components/Todo';
import { fetchData, postData, deleteData, patchData } from '../utils/utils';

const apps = [
  { name: 'Todo', content: <Todo /> },
]

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [mainContent, setMainContent] = useState(apps[0]);
  const router = useRouter();

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

  const handleSelectApp = (app) => {
    setMainContent(app);
  };

  useEffect(() => {
    console.log("useEffect実行Dashboard");
    const fetchUserData = async () => {
      try{
        const user = await fetchData('/user/');
        setUsername(user.username);
      } catch(error) {
        handleError(error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex">
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} />
      <div className="flex-grow container mx-auto ml-72 mr-8">
        <Header username={username} postData={postData} />
        <main>
          <h2 className="text-lg mb-4">ようこそ、<span className="font-bold">{username}</span>さん</h2>
          {mainContent.content}
          {/* <Todo fetchData={fetchData} postData={postData} patchData={patchData} deleteData={deleteData} /> */}
        </main>
      </div>
    </div>
  );
};

Dashboard.requiresAuth = true;

export default Dashboard;
