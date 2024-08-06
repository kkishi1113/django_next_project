"use client"

import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
  username: z.string()
    .min(5, {message: "ユーザネームは5~20文字で入力してください。"})
    .max(20, {message: "ユーザネームは5~20文字で入力してください。"}),
  email: z.string()
    .email("正しいメールアドレスを入力してください。"),
  password: z.string()
    .min(5, {message: "パスワードは5~20文字で入力してください。"})
    .max(20, {message: "パスワードは5~20文字で入力してください。"})
    .regex(/^[a-zA-Z0-9]+$/, "パスワードは英数字のみで入力してください"),
})

export default function Signup() {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const router = useRouter();

  const handleOnSubmit = async (formData) => {
    try {
      // アカウント作成
      await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+'/register/', formData);
      // アカウント作成成功後にログイン
      const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+'/login/', formData);
      localStorage.setItem('token', response.data.token);
      //alert('アカウント作成成功！ログインしました。');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('アカウント作成またはログインに失敗しました。');
    }
  };

  return (
    <div className="flex place-items-center">
      <div className="pt-20 m-auto">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>アカウント作成</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form id="signup" onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Taro" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button form="signup" type="submit" className="hover:opacity-50">Crate Account</Button>
          </CardFooter>
        </Card>
        <Link href="/">戻る</Link>
      </div>
    </div>
  );
}
