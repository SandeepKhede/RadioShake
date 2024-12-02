import StreamView from "@/app/components/StreamView"

export default async function CreatorPage({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: string
    }
}) {
    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false} />
        </div>
    );
}