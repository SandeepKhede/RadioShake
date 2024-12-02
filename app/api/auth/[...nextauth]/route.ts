import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn(params) {
            if (!params.user.email) {
                return false
            }
            try {
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
                return false;
            }
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    }
})

export { handler as GET, handler as POST }