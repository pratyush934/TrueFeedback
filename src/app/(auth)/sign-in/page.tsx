"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Description } from "@radix-ui/react-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignIn = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      //important
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
    //   console.log(result);

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast({
            title: "Login Failed",
            description: "Incorrect username or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log(`Error in sing-in page.tsx`, error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
