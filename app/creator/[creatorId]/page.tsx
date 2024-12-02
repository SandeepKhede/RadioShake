import StreamView from "@/app/components/StreamView"

type Params = Promise<{ creatorId: string }>;

export default async function CreatorPage({ 
    params 
}: { 
    params: Params 
}) {
    const { creatorId } = await params;

    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false} />
        </div>
    );
}