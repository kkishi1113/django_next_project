import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Todo = ({ fetchData, postData, patchData, deleteData }) => {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
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
    
    const handleDeleteTodo = async (id) => {
        try{
            await deleteData(`/todos/${id}/`);
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error){
            handleError(error);
        }
    };

    const handleUpdateTodo = async (id, title, text) => {
        try{
            await patchData(`/todos/${id}/`, { title, text });
        } catch(error){
            handleError(error);
        }
    };

    const handleAddTodo = async () => {
        try{
            if (!newTodoTitle) return;
            const newTodo = await postData('/todos/', { title: newTodoTitle, text: '' });
            setTodos([...todos, newTodo]);
            setNewTodoTitle('');
        }catch(error){
            handleError(error);
        }
    };

    useEffect(() => {
        console.log("useEffect実行Todo");
        const fetchTodoList = async () => {
            try{
                const todos = await fetchData('/todos/');
                setTodos(todos);
            } catch(error) {
                handleError(error);
            }
        };
        fetchTodoList();
    }, []);

    return (
       <>
        <div className="flex justify-between items-center py-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="border p-2 flex-grow mr-2"
              placeholder="新しいTodoのタイトル"
            />
            <button onClick={handleAddTodo} className="bg-green-500 text-white px-4 py-2 rounded">
              追加
            </button>
          </div>
          <div className="flex flex-wrap">
            {todos.map((todo, index) => (
              <div key={todo.id} className="border rounded-lg shadow-md p-4 m-2 w-1/4">
                <input
                  type="text"
                  value={todo.title || ''}
                  onChange={(e) => {
                    const updatedTodos = todos.map((t) =>
                      t.id === todo.id ? { ...t, title: e.target.value } : t
                    );
                    setTodos(updatedTodos);
                  }}
                  onBlur={() => handleUpdateTodo(todo.id, todo.title, todo.text)}
                  className="border-b w-full"
                />
                <textarea
                  value={todo.text || ''}
                  onChange={(e) => {
                    const updatedTodos = todos.map((t) =>
                      t.id === todo.id ? { ...t, text: e.target.value } : t
                    );
                    setTodos(updatedTodos);
                  }}
                  onBlur={() => handleUpdateTodo(todo.id, todo.title, todo.text)}
                  className="w-full border mt-2 h-40"
                />
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
       </> 
    );
}

export default Todo;