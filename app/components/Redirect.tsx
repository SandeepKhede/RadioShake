"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, } from "next/navigation";

export default function Redirect() {
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    const creatorId = window.localStorage.getItem("creatorId");
    if (session?.data?.user) {
      if(creatorId){
        router.push(`/creator/${creatorId}`);
      }else{
        router.push("/dashboard");
      }
    }
    else{
      router.push("/");
    }
  }, [session,router]);
  return null;
}