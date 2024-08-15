import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button'
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const Header = ({ postData, apps, handleSelectApp, username }) => {
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

    const handleLogout = async () => {
        try{
            await postData('/logout/', {});
            localStorage.removeItem('token');
            router.push('/');
        } catch (error){
            handleError(error);
        }
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white sticky top-0 mb-10 z-30 border-b-2 border-b-slate-100">
            <div className="flex items-center">
                <Sidebar apps={apps} handleSelectApp={handleSelectApp} />
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center">
                <h2 className="text-xl mr-4"><span className="font-bold">{username}</span>さん</h2>
                <Button variant="ghost" onClick={handleLogout} >
                    <span className="block mx-1">Logout</span>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Button>
            </div>
        </header>
    );
}

export default Header;