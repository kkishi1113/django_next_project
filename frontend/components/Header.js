import React from 'react';
import { useRouter } from 'next/router';

const Header = ({ postData }) => {
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
        <header className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <div className="flex items-center">
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                    ログアウト
                </button>
            </div>
        </header>
    );
}

export default Header;