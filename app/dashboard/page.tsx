'use client'

import StreamView from '../components/StreamView'

// If you need this interface elsewhere, consider moving it to a separate types file
export interface Stream {
    id: string;
    type: string;
    active: boolean;
    url: string;
    extractedId: string;
    title: string;
    smallImg: string;
    bigImg: string;
    userId: string;
    upvotes: number;
    haveUpvoted: boolean
}

export interface StreamsResponse {
    streams: Stream[];
}

const creatorId = "258d4b3f-fd89-4dd7-aeb5-1d76c0f4f493"

export default function Dashboard() {
    return <StreamView creatorId={creatorId} playVideo={true} />
}
