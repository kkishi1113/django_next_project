"use client"

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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';



const formSchema = z.object({
  shortcutTitle: z.string().min(1,{message: "入力が必須です。"}).max(100,{message: "最大文字数は100文字です。"}),
  url: z.string().min(1,{message: "入力が必須です。"}).max(100,{message: "最大文字数は100文字です。"}).url({message: "URLの形式で入力してください。"}),
});

const Shortcut = () => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        shortcutTitle: "Google",
        url: "https://www.google.com/",
      },
      mode: "onChange",
    });
    const [shortcuts, setShortcuts] = useState([]);
    // const [shortcutTitle, setShortcutTitle] = useState();
    // const [url, setUrl] = useState();
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

    const handleUpdateShortcut = async (id, title, url) => {
        try{
            await patchData(`/shortcuts/${id}/`, { title, url });
        } catch(error){
            handleError(error);
        }
    };

    const handleAddShortcut = async (values) => {
        try{
            if (!values) return;

            const newShortcut = await postData('/shortcuts/', { title: values.shortcutTitle, url: values.url });
            setShortcuts([...shortcuts, newShortcut]);
        }catch(error){
            handleError(error);
        }
    };

    useEffect(() => {
        console.log("useEffect実行Shortcut");
        const fetchShortcutList = async () => {
            try{
                const shortcuts = await fetchData('/shortcuts/');
                setShortcuts(shortcuts);
            } catch(error) {
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
                    name="shortcutTitle"
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
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-4 py-4">
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-32 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p>Google</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-32 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p>Google</p>
                </CardFooter>
              </Card>
            </Link>
{/*             
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-48 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p className="text-center">Google</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-48 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p className="text-center">Google</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-48 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p className="text-center">Google</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-48 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p className="text-center">Google</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="https://www.google.com/" className="block aspect-square lg:w-32 md:w-48 sm:w-96 relative z-10">
              <Card className="h-full w-full relative">
                <CardHeader className="flex items-center justify-center h-1/3 relative">
                  <Button variant="ghost" className="aspect-square h-1/2 absolute top-0 right-0 z-20" asChild>
                    <Link href="#">:</Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-1/3">
                  <img src="https://www.google.com/favicon.ico" className="object-contain" />
                </CardContent>
                <CardFooter className="flex justify-center h-1/3">
                  <p className="text-center">Google</p>
                </CardFooter>
              </Card>
            </Link> */}
          </div>
       </>
    );
}

export default Shortcut;