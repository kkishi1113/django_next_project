"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchData, postData, deleteData, patchData } from '../utils/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import * as React from "react"
 
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import Link from 'next/link';

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1,{message: "入力が必須です。"}).max(100,{message: "最大文字数は100文字です。"}),
  url: z.string().min(1,{message: "入力が必須です。"}).max(500,{message: "最大文字数は500文字です。"}).url({message: "URLの形式で入力してください。"}),
});

const Shortcut = () => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        id: undefined,
        title: "Google",
        url: "https://www.google.com/",
      },
      mode: "onChange",
    });
    const [shortcuts, setShortcuts] = useState([]);
    const [editingShortcut, setEditingShortcut] = useState(null);
    const router = useRouter();

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
        try {
            await deleteData(`/shortcuts/${id}/`);
            setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
        } catch (error) {
            handleError(error);
        }
    };

    const handleUpdateShortcut = async (data) => {
        try {
            await patchData(`/shortcuts/${data.id}/`, { title: data.title, url: data.url });
            setShortcuts(shortcuts.map((shortcut) => (shortcut.id === data.id ? { ...shortcut, title: data.title, url: data.url } : shortcut)));
            setEditingShortcut(null);
        } catch (error) {
            handleError(error);
        }
    };

    const handleAddShortcut = async (data) => {
        try {
            const newShortcut = await postData('/shortcuts/', { title: data.title, url: data.url });
            setShortcuts([...shortcuts, newShortcut]);
            form.reset();
        } catch (error) {
            handleError(error);
        }
    };

    const handleEditClick = (shortcut) => {
        setEditingShortcut(shortcut);
        form.setValue("id", shortcut.id);
        form.setValue("title", shortcut.title);
        form.setValue("url", shortcut.url);
    };

    useEffect(() => {
        const fetchShortcutList = async () => {
            try {
                const shortcuts = await fetchData('/shortcuts/');
                setShortcuts(shortcuts);
            } catch (error) {
                handleError(error);
            }
        };
        fetchShortcutList();
    }, []);

    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">ショートカットを追加</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddShortcut)} className="space-y-8">
                <DialogHeader>
                  <DialogTitle>ショートカットを追加</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>表示名</FormLabel>
                      <FormControl>
                        <Input placeholder="Google" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.google.com/" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" disabled={!form.formState.isValid}>追加</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div className="grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-4 py-4">
          {shortcuts.map((shortcut)=>(
            <Card key={shortcut.id} className="border-white shadow-white h-full w-full relative hover:opacity-50 group">
              <Dialog>
                <DialogTrigger asChild className="rounded-full">
                  <Button variant="ghost" className="aspect-square absolute top-0 right-0 z-20 hidden group-hover:block" onClick={() => handleEditClick(shortcut)}>
                    <FontAwesomeIcon icon={faEllipsisVertical} className="" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateShortcut)} className="space-y-8">
                      <DialogHeader>
                        <DialogTitle>ショートカットを編集</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>表示名</FormLabel>
                            <FormControl>
                              <Input placeholder="Google" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.google.com/" {...field} />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="destructive" type="button" onClick={() => handleDeleteShortcut(shortcut.id)}>削除</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="submit" disabled={!form.formState.isValid}>保存</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Link href={shortcut.url} target="_blank" rel="noopener noreferrer" className="block aspect-square">
                <CardContent className="absolute inset-0 flex place-items-center ">
                  {/* <img src={shortcut.url+"/favicon.ico"} className="object-contain w-10" /> */}
                  {/* <img src={"http://www.google.com/s2/favicons?domain="+shortcut.url}  className="object-contain w-10" /> */}
                  <img src={"https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url="+shortcut.url+"&size=128"}  className="m-auto w-12" />
                </CardContent>
                <CardFooter className="absolute bottom-0 w-full flex justify-center h-1/3 px-1">
                  <p className="text-center overflow-hidden whitespace-nowrap text-ellipsis">{shortcut.title}</p>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div> 
      </>
    );
}

export default Shortcut;
