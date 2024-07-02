import { useState, useEffect } from 'react';

const Todo = ({ fetchData, postData, patchData, deleteData }) => {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    
    const handleDeleteTodo = async (id) => {
        await deleteData(`/todos/${id}/`);
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const handleUpdateTodo = async (id, title, text) => {
        await patchData(`/todos/${id}/`, { title, text });
    };

    const handleAddTodo = async () => {
        if (!newTodoTitle) return;
        const newTodo = await postData('/todos/', { title: newTodoTitle, text: '' });
        setTodos([...todos, newTodo]);
        setNewTodoTitle('');
      };

    useEffect(() => {
        console.log("useEffect実行");
        const fetchTodoList = async () => {
            const todos = await fetchData('/todos/');
            setTodos(todos);
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