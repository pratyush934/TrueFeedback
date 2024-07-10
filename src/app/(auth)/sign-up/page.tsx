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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
//functionalities -> ui

const Page = () => {
  //debouncing means while typing aap api req bhejte ho ushe aapko optimize karna hai

  const [userName, setUserName] = useState<string>("");
  const [userNameMessage, setuserNameMessage] = useState<string>("");
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);

  // const debounceUserName = useDebounceValue(userName, 300);
  const debounce = useDebounceCallback(setUserName, 300);

  const { toast } = useToast();
  const router = useRouter();

  //form useForm se le liye
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const chekcUserNameUnique = async () => {
      if (userName) {
        setIsCheckingUserName(true);
        setuserNameMessage("");
      }

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${userName}`
        );
        // console.log("8**************888", response, "88888888888*****");
        // console.log(response.data.message);
        let message = response.data.message;
        setuserNameMessage(message);
      } catch (error) {
        console.error(`Error in sign-up front end------>`, error);
        const axiosError = error as AxiosError<ApiResponse>;
        setuserNameMessage(axiosError.response?.data.message ?? "Erro exist");
      } finally {
        setIsCheckingUserName(false);
      }
    };
    chekcUserNameUnique();
  }, [userName]);
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(response);

      toast({
        title: "Success",
        description: response.data.message,
      });

      //no history will be added with the use of replace and will redirect to this page
      // console.log("Is submitting is creating issues let me print ----> ", isSubmitting);
      // setisSubmitting(true)
      router.replace(`/verify/${userName}`);
      setisSubmitting(false);
    } catch (error) {
      console.error(`Error exist in onSubmit in sign-up tsx`, error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      // console.log("Is submitting is creating issues let me print ----> ", isSubmitting);
      setisSubmitting(false);
    }
  };

  return (
    <>
      {/* {isSubmitting && (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )} */}
      (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          //ye krantikari move hai
                          debounce(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUserName && <Loader2 className="animate-spin" />}
                    {userName && !isCheckingUserName && userNameMessage && (
                      <p
                        className={`text-sm ${
                          userNameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {userNameMessage}
                      </p>
                    )}
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
                      <Input placeholder="email" {...field} />
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
              <Button type="submit" className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      )
    </>
  );
};

export default Page;
