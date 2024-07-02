import React from 'react';

const Header = ({ onLogout }) => {
    return (
        <header className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <div className="flex items-center">
                <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                    ログアウト
                </button>
            </div>
        </header>
    );
}

export default Header;