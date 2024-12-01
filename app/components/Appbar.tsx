"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { LogOut, LogIn, Share2 } from 'lucide-react'; 


//@ts-ignore
import { Music} from 'lucide-react'
export function Appbar({onShare}:{onShare:()=>void}){
    const session = useSession()
    return(
        <nav className=" mb-4 px-4 py-2">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <Link href="/" className="text-2xl font-bold text-purple-500">
                    RadioShake
                </Link>

                <div className="flex items-center gap-4">
                    {/* Share Button */}
                    <button
                        onClick={onShare}
                        className="flex items-center gap-2 px-6 py-2
                            bg-gray-800 
                            hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 
                            text-white font-medium rounded-full
                            transition-all duration-300 ease-in-out
                            transform hover:scale-105
                            border border-gray-700/50 hover:border-transparent"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                    </button>

                    {/* Logout Button - with red-orange gradient */}
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 px-6 py-2
                           bg-gradient-to-r from-red-500 to-orange-500
                            hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 
                            text-white font-medium rounded-full
                            transition-all duration-300 ease-in-out
                            transform hover:scale-105
                            border border-gray-700/50 hover:border-transparent
                            hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}