import {getServerSession} from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/app/LIBS/prismadb"

export async function getSession(){
    return await getServerSession(authOptions)
}

export default async function getCurrentUser(){
    try{
        const session = await getSession()

        if(!session?.user?.email){
            return null
        }
        const currentuser = await prisma.user.findUnique({
            where:{
                email: session.user.email as string
            }
        })
        if(!currentuser){
            return null
        }
        return {
            ...currentuser, 
            createdAt: currentuser.createdAt?.toISOString(),
            updatedAt: currentuser.updatedAt?.toISOString(),
            emailVerified: currentuser.emailVerified?.toString() || null

        }

    }catch(err){
        return null
    }
}