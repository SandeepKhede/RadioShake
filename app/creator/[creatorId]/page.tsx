'use client'
import StreamView from "@/app/components/StreamView"

type Params = Promise<{ creatorId: string }>;

export default async function CreatorPage({ 
    params 
}: { 
    params: Params 
}) {
    const { creatorId } = await params;
    localStorage.setItem("creatorId", creatorId);
    
    //eslint-disable-next-line react-hooks/rules-of-hooks
    // useEffect(() => {   
    //     window.localStorage.setItem("creatorId", creatorId);
    // }, []);
    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false} />
            {/* <h1>dsfghjjkgfdsghm</h1> */}
        </div>
    );
}