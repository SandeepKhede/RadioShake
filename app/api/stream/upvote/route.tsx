import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req:NextRequest){
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        },{
            status: 403
        })
    }

    try {
        const data = UpvoteSchema.parse(await req.json());
        console.log('Creating upvote with data:', { userId: user.id, streamId: data.streamId });
        console.log(data);
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
        return NextResponse.json({
            message: "Upvoting Success"
        },{
            status: 200
        })
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message: "Error while Upvoting"
        },{
            status: 403
        })
    }
}