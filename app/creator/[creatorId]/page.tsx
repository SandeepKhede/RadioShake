'use client'
import StreamView from "@/app/components/StreamView"

type Params = Promise<{ creatorId: string }>;

export default async function CreatorPage({ 
    params 
}: { 
    params: Params 
}) {
    const { creatorId } = await params;
    window.localStorage.setItem("creatorId", creatorId);
    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false} />
            {/* <h1>dsfghjjkgfdsghm</h1> */}
        </div>
    );
}