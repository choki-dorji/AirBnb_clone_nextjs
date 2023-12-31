import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/LIBS/prismadb"
import NextAuth from "next-auth";

export const authOptions: AuthOptions = {
    
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        Credentials({
            name: "Credientials",
            credentials: {
                email: {label: "email", type:"text"},
                password: {label: "password", type:"password"}
            },
            
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Invalid credentials")
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if(!user || !user?.hashedPassword){
                    throw new Error("Invalid credentials")
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password, user.hashedPassword
                )
                if(!isCorrectPassword){
                    throw new Error("Invalid Password")
                }
                return user
            }
        })    

    ],
    pages: {
        signIn: "/"
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: 'jwt'
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
