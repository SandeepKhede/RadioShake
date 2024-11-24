"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
//@ts-ignore
import { Music} from 'lucide-react'
export function Appbar(){
    const session = useSession()
    return(
        <div className="flex justify-between w-full items-center">
            <div className="">
                    <Link className="flex items-center justify-center" href="#">
                <Music className="h-6 w-6 text-purple-400" />
                <span className="ml-2 font-bold text-xl text-purple-400">FanTune</span>
                </Link>
            </div>

            <div>

        <nav className="ml-auto flex gap-4 sm:gap-6 flex items-center">
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Contact
          </Link>
          {session.data?.user && 
                <button className="m-2 p-2 rounded bg-purple-600 hover:bg-purple-700 text-white" onClick={()=>signOut()}>Logout</button>
            }
                {!session.data?.user && 
                <button className="m-2 p-2 rounded bg-purple-600 hover:bg-purple-700 text-white" onClick={()=>signIn()}>Signin</button>
            }
        </nav>
            </div>
        </div>
    )
}