"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
//functionalities -> ui

const Page = () => {
  //debouncing means while typing aap api req bhejte ho ushe aapko optimize karna hai

  const [userName, setUserName] = useState<string>("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const debounceUserName = useDebounceValue(userName, 300);

  const { toast } = useToast();
  const router = useRouter();

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
      try {
        if (debounceUserName) {
          setIsCheckingUserName(true);
          setUserNameMessage("");

          const response = await axios.get(
            `/api/check-username-unique?username=${debounceUserName}`
          );
          console.log(response);

          setUserNameMessage(response.data.message);
        }
      } catch (error) {
        console.error(`Error in sign-in front end`, error);
        const axiosError = error as AxiosError<ApiResponse>;
        setUserNameMessage(axiosError.response?.data.message ?? "Erro exist");
      } finally {
        setIsCheckingUserName(false);
      }
    };
    chekcUserNameUnique();
  }, [debounceUserName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(response);

      toast({
        title: "Success",
        description: response.data.message,
      });

      //no history will be added with the use of replace and will redirect to this page
      router.replace(`/verify/${userName}`);
      setIsSubmiting(false);

    } catch (error) {
      
      console.error(`Error exist in onSubmit in sign-up tsx`, error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmiting(false);
    }
  };

  return <div>page</div>;
};

export default Page;
