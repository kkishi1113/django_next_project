import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // アカウント作成
      await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+'/register/', formData);
      // アカウント作成成功後にログイン
      const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+'/login/', {
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      alert('アカウント作成成功！ログインしました。');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('アカウント作成またはログインに失敗しました。');
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">アカウント作成</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block">ユーザー名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2"
            required
          />
        </div>
        <div>
          <label className="block">パスワード</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2"
            required
          />
        </div>
        <div>
          <label className="block">メールアドレス</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          アカウント作成
        </button>
      </form>
      <Link href="/">戻る</Link>
    </div>
  );
}
