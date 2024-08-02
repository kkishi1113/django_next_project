import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchData, postData, deleteData, patchData } from '../utils/utils';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Shortcut = () => {
    const [shortcuts, setShortcuts] = useState([]);
    const [shortcutTitle, setShortcutTitle] = useState('');
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
    
    const handleDeleteShortcut = async (id) => {
        try{
            await deleteData(`/shortcuts/${id}/`);
            setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
        } catch (error){
            handleError(error);
        }
    };

    const handleUpdateShortcut = async (id, title, text) => {
        try{
            await patchData(`/shortcuts/${id}/`, { title, text });
        } catch(error){
            handleError(error);
        }
    };

    const handleAddShortcut = async () => {
        try{
            if (!shortcutTitle) return;
            const newShortcut = await postData('/shortcuts/', { title: shortcutTitle, text: '' });
            setShortcuts([...shortcuts, newShortcut]);
            setShortcutTitle('');
        }catch(error){
            handleError(error);
        }
    };

    // useEffect(() => {
    //     console.log("useEffect実行Shortcut");
    //     const fetchShortcutList = async () => {
    //         try{
    //             const shortcuts = await fetchData('/shortcuts/');
    //             setShortcuts(shortcuts);
    //         } catch(error) {
    //             handleError(error);
    //         }
    //     };
    //     fetchShortcutList();
    // }, []);

    return (
       <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">ショートカットを追加</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>ショートカットを追加</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortcutTitle" className="text-right">
                    表示名
                  </Label>
                  <Input
                    id="shortcutTitle"
                    defaultValue="Google"
                    className="col-span-3"
                    onChange={(e) => setShortcutTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    defaultValue="https://wwww.google.com/"
                    className="col-span-3"
                    onChange={(e) => setShortcutTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={()=>handleAddShortcut()}>追加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
       </>
    );
}

export default Shortcut;