import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? " ",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
      ],
      pages: {
        signIn: '/auth/signin',  // Update this path
      },
      secret: process.env.NEXTAUTH_SECRET ?? "secret",
      callbacks: {
        async signIn(params){
          if(!params.user.email){
            return false
          }
          try {
            // First try to find the user
            const existingUser = await prismaClient.user.findUnique({
                where: {
                    email: params.user.email
                }
            });

         
            if (!existingUser) {
                await prismaClient.user.create({
                    data: {
                        email: params.user.email,
                        provider: "Google"
                    }
                });
            }

            return true;
          } catch (error) {
            
            console.error('Sign in error:', {
                message: error,
                email: params.user.email
            });
            
            return false; // Deny sign in for other errors
          }
        }
      }
})

export { handler as GET, handler as POST }