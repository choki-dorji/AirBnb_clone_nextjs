import { User } from "@prisma/client"

export type safeuser = Omit<
User, 
"createdAt" | "updatedAt" | "emailVerified"
> & {

    createdAt: string | undefined;
    updatedAt: string | undefined;
    emailVerified: string | null
};
