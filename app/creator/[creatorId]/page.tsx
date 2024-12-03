'use client'
import StreamView from "@/app/components/StreamView"
import { useEffect } from "react";

type Params = Promise<{ creatorId: string }>;

export default async function CreatorPage({ 
    params 
}: { 
    params: Params 
}) {
    const { creatorId } = await params;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {   
        window.localStorage.setItem("creatorId", creatorId);
    }, []);
    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false} />
            {/* <h1>dsfghjjkgfdsghm</h1> */}
        </div>
    );
}