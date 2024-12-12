"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, } from "next/navigation";

export default function Redirect() {
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (session?.data?.user) {
      const creatorId = localStorage.getItem("creatorId");
      if (creatorId) {
        router.push(`/creator/${creatorId}`);
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/");
    }
  }, [session, router]);
  return null;
}