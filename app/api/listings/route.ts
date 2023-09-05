import { NextResponse } from "next/server";
import prisma from "@/app/LIBS/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request){
    const currentuser = await getCurrentUser();
    if(!currentuser){
        console.log("error")
        return NextResponse.error()
    }
    const body = await request.json();

    const { title, description, imageSrc, category, roomCount, bathRoomCount, price, location, guestCount } = body;

    console.log(title, description, imageSrc, category, roomCount,  bathRoomCount, price, location, guestCount)

    Object.keys(body).forEach((value: any) => {
        if(!body[value]){
            NextResponse.error()
        }
    })

    const listing = await prisma.listing.create({
        data: { title, description, imageSrc, category, roomCount,bathroomCount : bathRoomCount, price: parseInt(price, 10), locationValue: location.value, guestCount, userId: currentuser.id}
    })
    return NextResponse.json(listing)
}