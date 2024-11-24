import { Appbar } from "./components/Appbar";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
//@ts-ignore
import { Music, Users, Headphones } from 'lucide-react'
//@ts-ignore
import Redirect from "./components/redirect";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Appbar />
        <Redirect />
      <main className="flex-1 flex flex-col">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-300">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Empower your audience to curate your stream's soundtrack. Connect, engage, and create together.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-950">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-purple-300">Key Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gray-700 shadow-lg">
                <Users className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-300">Fan-Driven Playlists</h3>
                <p className="text-sm text-gray-300 text-center">
                  Let your audience shape your stream's soundtrack in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gray-700 shadow-lg">
                <Headphones className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-300">Live Interaction</h3>
                <p className="text-sm text-gray-300 text-center">
                  Engage with your fans through chat, polls, and music requests.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gray-700 shadow-lg sm:col-span-2 md:col-span-1">
                <Music className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-300">Multi-Platform Streaming</h3>
                <p className="text-sm text-gray-300 text-center">
                  Broadcast your music streams across multiple platforms simultaneously.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-purple-300">Start Streaming Today</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the revolution in interactive music streaming. Sign up now!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-gray-800 text-gray-100 border-gray-700" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-purple-400 transition-colors" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2 sm:flex-row items-center">
            <p className="text-xs text-gray-400">© 2024 FanTune. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-xs hover:underline underline-offset-4 hover:text-purple-400 transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline underline-offset-4 hover:text-purple-400 transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
