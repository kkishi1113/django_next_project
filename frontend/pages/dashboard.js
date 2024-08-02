import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Todo from '../components/Todo';
import Shortcut from '../components/Shortcut';
import Link from 'next/link';
import { fetchData, postData, deleteData, patchData } from '../utils/utils';


const apps = [
  { name: 'Todo', content: <Todo /> },
  { name: 'Shortcut', content: <Shortcut /> },
  { name: 'Link', content: <Link href="/dashboard"><span className="text-2xl font-bold">Dashboard</span></Link> },
  { name: 'Button0', content: <div><button  className="bg-green-500 text-white px-4 py-2 rounded" value="0" onClick={(e) => console.log(e.target.value)}>ボタン0</button></div>},
  { name: 'Button1', content: <div><button className="bg-blue-500 text-white px-4 py-2 rounded" value="1" onClick={(e) => console.log(e.target.value)}>ボタン1</button></div> },
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
      <Sidebar 
        isVisible={isSidebarVisible} 
        toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} 
        apps={apps}
        handleSelectApp={handleSelectApp}
      />
      <div className="flex-grow container mx-auto ml-72 mr-8">
        <Header username={username} postData={postData} />
        <main>
          <h2 className="text-lg mb-4">ようこそ、<span className="font-bold">{username}</span>さん</h2>
          {mainContent.content}
        </main>
      </div>
    </div>
  );
};

Dashboard.requiresAuth = true;

export default Dashboard;
