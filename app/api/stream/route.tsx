import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
//@ts-expect-error no-unused-vars
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

const YT_Regex = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req:NextRequest){
    try {
    const data  = CreateStreamSchema.parse(await req.json());
    const isYT = data.url.match(YT_Regex)
    if(!isYT){
        return NextResponse.json({
            message: "Invalid URL"
        },{
            status: 411
        })
    } 

    const extractedId = data.url.split("?v=")[1];
    let res;
    try {
        res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res, "res for youtube");
    } catch (apiError) {
        console.error("Error fetching video details:", apiError);
        return NextResponse.json({
            message: "Error fetching video details"
        }, {
            status: 500
        });
    }

    const thumbnails = res?.thumbnail?.thumbnails || [];
    let smallImgUrl = "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg";
    let bigImgUrl = "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg";

    if (thumbnails.length > 0) {
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);
        smallImgUrl = thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url;
        bigImgUrl = thumbnails[thumbnails.length - 1].url;
    }

    const stream = await prismaClient.stream.create({
       data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: res.title ?? "Radio Shake",
        smallImg: smallImgUrl,
        bigImg: bigImgUrl,
       }
    })

    return NextResponse.json({
        ...stream,
        haveUpvoted: false,
        upvotes: 0
    })
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message: "Error while adding stream"
        },{
            status: 411
        })
    }
}


export async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    console.log(user?.email,"user");
    const superUser = user?.email === "sandeep@webkorps.com"
    
    if (!user){
        return NextResponse.json({
            message: "Unauthorized"
        },{
            status: 401
        })
    }
    if(!creatorId){
        return NextResponse.json({
            message: "Error"
        },{
            status: 411
        })
    }
    const [streams, activeStreams] = await Promise.all([await prismaClient.stream.findMany({
        where: {
            userId: creatorId,
            played: false
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
    }), prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId
        },
        include:{
            stream: true
        }
    })])

    console.log(activeStreams,"active =======");
    

    return NextResponse.json({
        streams: streams.map(({_count,...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ?  true : false
        })),
        activeStreams,
        superUser
    })
}