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

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


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
            <HoverCard key={shortcut.id} openDelay={0} closeDelay={0}>
              <Card className="border-white shadow-white relative group">
                <Dialog>
                  <DialogTrigger asChild className="rounded-full">
                    <Button variant="ghost" className="absolute top-0 right-0 z-10 hidden group-hover:block" onClick={() => handleEditClick(shortcut)}>
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
                <HoverCardTrigger asChild>
                  <Link href={shortcut.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-50 block aspect-square">
                    <CardContent className="absolute inset-0 flex place-items-center ">
                      <img src={"https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url="+shortcut.url+"&size=128"}  className="m-auto w-12" />
                    </CardContent>
                    <CardFooter className="absolute bottom-0 w-full m-auto flex place-items-center px-1 ">
                        <p className="m-auto text-center overflow-hidden whitespace-nowrap text-ellipsis">{shortcut.title}</p>
                    </CardFooter>
                  </Link>
                </HoverCardTrigger>
              </Card>
              <HoverCardContent className="text-center text-sm w-auto max-w-96" sideOffset={-50}>
                {shortcut.title}
              </HoverCardContent>
            </HoverCard>
          ))}
          <Card className="border-white shadow-white relative group">
            <div className="aspect-square">
              <CardContent className="absolute inset-0 flex place-items-center">
                <Dialog>
                  <DialogTrigger asChild className="rounded-full hover:opacity-70 m-auto">
                    <Button variant="secondary">+</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddShortcut)} className="space-y-8">
                        <DialogHeader>
                          <DialogTitle>ショートカット追加</DialogTitle>
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
              </CardContent>
              <CardFooter className="absolute bottom-0 w-full m-auto flex place-items-center px-1">
                  <p className="m-auto text-center overflow-hidden whitespace-nowrap text-ellipsis">追加</p>
              </CardFooter>
            </div>
          </Card>
        </div> 
      </>
    );
}

export default Shortcut;
