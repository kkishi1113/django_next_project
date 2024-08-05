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
  // username: z.string(),
  email: z.string()
    .email("正しいメールアドレスを入力してください。"),
  password: z.string()
    .min(5, {message: "パスワードは6~20文字で入力してください。"})
    .max(20, {message: "パスワードは6~20文字で入力してください。"})
    .regex(/^[a-zA-Z0-9]+$/, "パスワードは英数字のみで入力してください"),
})

export default function Home() {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter();

  // フォーム送信の処理
  const handleOnSubmit = async (formData) => {
    try {
      // サーバーにログインデータを送信
      const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+'/login/', formData);
      localStorage.setItem('token', response.data.token);  // トークンを保存
      router.push('/dashboard');  // ダッシュボードへ移動
    } catch (error) {
      console.error(error);
      alert('ログインに失敗しました。');
    }
  };

  return (
    // コンテナのスタイル設定
    <div className="flex place-items-center">
      <div className="pt-20 m-auto">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
            <form id="login" onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-8">
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
                      <Input placeholder="password" {...field} />
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
            <Button form="login" type="submit" className="hover:opacity-50">Login</Button>
          </CardFooter>
        </Card>
        <Link href="/signup">
          アカウント作成
        </Link>
      </div>
    </div>
  );
}
