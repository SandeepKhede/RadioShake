import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(){
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if (!user){
        return NextResponse.json({
            message: "Unauthorized"
        },{
            status: 401
        })
    }

    const streams = await prismaClient.stream.findMany({
        where: {
            userId: user.id
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: user.id
                }
            }
        }
    })


    return NextResponse.json({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        streams: streams.map(({_count,...rest}:any) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ?  true : false
        })),
        creatorId: user.id
    })
}