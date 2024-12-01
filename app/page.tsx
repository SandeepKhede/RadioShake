"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Users, Headphones, ArrowRight } from 'lucide-react'
import Redirect from "./components/Redirect";
import { signIn, useSession } from "next-auth/react";
import { motion, useScroll, useTransform } from "framer-motion";
// import { Appbar } from "./components/Appbar";

export default function LandingPage() {
  const session = useSession()
  const { scrollY } = useScroll();
  const opacity = useTransform(
    scrollY, 
    [0, 300, 600], // scroll positions
    [1, 0.5, 0]    // opacity values
  );
  const y = useTransform(
    scrollY, 
    [0, 300, 600], // scroll positions
    [0, -50, -100] // y values
  );
  const scale = useTransform(
    scrollY,
    [0, 300, 600],
    [1, 0.95, 0.9]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <Redirect />
        {/* <Appbar /> */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <motion.div
            style={{ 
              opacity, 
              y,
              scale
            }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-white"
            >
              Welcome to Radio Shake
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-8"
            >
              Discover and share your favorite music
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex space-x-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 
                  hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full 
                  transform transition-all duration-300 hover:shadow-xl
                  flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, margin: "-100px" }}
          className="w-full py-20 md:py-32 relative overflow-hidden bg-gray-900/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="container px-4 md:px-6 mx-auto relative"
          >
            <div className="absolute "></div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Fan-Driven Playlists",
                  description: "Let your audience shape your stream's soundtrack in real-time."
                },
                {
                  icon: Headphones,
                  title: "Live Interaction",
                  description: "Engage with your fans through chat, polls, and music requests."
                },
                {
                  icon: Music,
                  title: "Multi-Platform Streaming",
                  description: "Broadcast your music streams across multiple platforms simultaneously."
                }
              ].map((feature, index) => (
                <div key={index} 
                  className="group flex flex-col items-center space-y-4 p-8 rounded-2xl 
                    bg-gray-800/50 backdrop-blur-sm
                    border border-gray-700/50
                    shadow-[0_0_15px_rgba(168,85,247,0.2)] 
                    hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] 
                    transition-all duration-500 transform hover:-translate-y-2">
                  <feature.icon className="h-16 w-16 text-purple-400 group-hover:scale-110 
                    transition-transform duration-300" />
                  <h3 className="text-2xl font-bold text-purple-300">{feature.title}</h3>
                  <p className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, margin: "-100px" }}
          className="w-full py-20 md:py-32 relative overflow-hidden bg-gray-900/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="container px-4 md:px-6 mx-auto relative"
          >
            <div className="absolute"></div>
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl 
                  bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Start Streaming Today
                </h2>
                <p className="max-w-[600px] text-gray-300 text-xl leading-relaxed">
                  Join the revolution in interactive music streaming. Sign up now!
                </p>
              </div>
              <div className="w-full max-w-md space-y-4">
                <form className="flex space-x-2">
                  <Input 
                    className="flex-1 bg-gray-800/50 text-gray-100 border-gray-700/50 
                      backdrop-blur-sm rounded-full px-6 py-6" 
                    placeholder="Enter your email" 
                    type="email" 
                  />
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 
                      hover:from-purple-700 hover:to-pink-700 text-white 
                      rounded-full px-8 transform transition-all duration-300 
                      hover:scale-105 hover:shadow-xl"
                  >
                    Sign Up
                  </Button>
                </form>
                <p className="text-sm text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-4 hover:text-purple-400 
                    transition-colors" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900/80 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">© 2024 Radio Shake. All rights reserved.</p>
            <nav className="flex gap-6">
              {["Terms of Service", "Privacy"].map((item) => (
                <Link 
                  key={item}
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors 
                    relative after:absolute after:bottom-0 after:left-0 
                    after:h-[2px] after:w-0 after:bg-purple-400 
                    after:transition-all hover:after:w-full" 
                  href="#"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
