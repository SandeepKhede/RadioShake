'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
//@ts-ignore
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import YouTube from 'react-youtube'
import axios from 'axios'
import { Appbar } from '../components/Appbar'
import { useSession } from 'next-auth/react'


const REFRESH_INTERVAL_MS = 10 * 1000;
// Dummy data for video

// Define the Stream interface
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

// Define the overall response interface
export interface StreamsResponse {
  streams: Stream[];
}




export default function StreamView({creatorId}:{creatorId: string}) {
  const [input, setInput] = useState('')
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [queue, setQueue] = useState<StreamsResponse>({
    streams: []
  });
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)

  console.log(queue?.streams[0]?.url,"dajksfkljaskfjkd");
  const extractedId = queue?.streams[0]?.url.split("?v=")[1];
  console.log(extractedId,'extracred people')
  
  async function refreshStream() {
    const res = await axios.get(`/api/stream/?creatorId=${creatorId}`);
    setQueue(res.data)
    console.log(res);
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(previewId,"privie di");

  useEffect(() => {
    refreshStream()
    setCurrentVideo("true")
    const interval = setInterval(() => {
      refreshStream()
    }, REFRESH_INTERVAL_MS)
    // return () => clearInterval(interval);
  },[])

  // const creatorId = "258d4b3f-fd89-4dd7-aeb5-1d76c0f4f493",


  const sortedQ = queue.streams.sort((a,b) => a.upvotes < b.upvotes ? 1 : -1);
  console.log(sortedQ,'Soted queeee');
  
  

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    const videoId = extractVideoId(e.target.value)
    setPreviewId(videoId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      creatorId,
      url: input
    }
    if (previewId) {
      const res = await axios.post('/api/stream/', data);
      // Assuming the response contains the streams object:
      console.log(res.data,'sdfdsfdsfd');
      
      // setQueue((prevQueue) => ({
      //   streams: [...prevQueue.streams, ...res.data], // Append new streams to existing streams
      // }));
      // setQueue([...queue, { id: previewId, votes: 0, title: `New Video (${previewId})` }])
      setInput('')
      setPreviewId(null)
    }
  }

  const updateVotes = async (index: number, increment: number, id: string) => {
    try {
      const newQueue = [...queue.streams];
      
      // Determine upvote or downvote action
      const haveUpvoted = newQueue[index].haveUpvoted;
  
      // Optimistically update local state
      newQueue[index].upvotes += haveUpvoted ? -1 : 1; // Adjust upvote count
      newQueue[index].haveUpvoted = !haveUpvoted; // Toggle upvote state
      newQueue.sort((a, b) => b.upvotes - a.upvotes); // Sort the streams
      setQueue({ streams: newQueue }); // Update state locally
      // API Request
      const data = { streamId: id };
      const res = await axios.post(`/api/stream/${haveUpvoted ? 'downvote' : 'upvote'}`, data);
  
      console.log('API Response:', res.data);
    } catch (error) {
      console.error('Error updating votes:', error);
  
      // Rollback local state on error
      const newQueue = [...queue.streams];
      newQueue[index].upvotes -= increment; // Revert upvote count
      newQueue[index].haveUpvoted = !newQueue[index].haveUpvoted; // Revert upvote state
      setQueue({ streams: newQueue });
    }
  };
  

  const playNext = () => {
    if (queue.streams.length > 0) {
      // setCurrentVideo(queue.streams[0].url)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % queue.streams.length);
      // setQueue(queue.slice(1))
    } else {
      setCurrentVideo(null)
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.href}/creator/${creatorId}`
    navigator.clipboard.writeText(shareUrl)
    .then(() => {
      console.log("URL copied to clipboard:", shareUrl);
      alert("Link copied to clipboard!"); // Optional: Notify the user
    })
    .catch((err) => {
      console.error("Failed to copy URL:", err);
      alert("Failed to copy the link."); // Optional: Notify the user about failure
    });
  }

  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 flex-grow">
    <Appbar />
        {/* Share Button */}
        <Button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Share
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-center">Stream Song Voting</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter YouTube video URL"
                className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
              />
              <Button type="submit" disabled={!previewId} className="bg-blue-600 hover:bg-blue-700">
                Add to Queue
              </Button>
            </form>
            {previewId && (
              <div className="aspect-video mb-6">
                <YouTube videoId={previewId} opts={{ width: '100%', height: '100%' }} />
              </div>
            )}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Video Queue</h2>
              {sortedQ.map((video, index) => (
  <div key={video.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
    {/* Thumbnail Image */}
    <img
      src={video.smallImg}
      alt={video.title}
      className="w-24 h-18 object-cover rounded"
    />

    {/* Video Details */}
    <div className="flex-grow">
      <p className="font-medium">{video.title}</p>
      <p className="text-sm text-gray-400">Total Votes: {video.upvotes}</p>
    </div>

    {/* Vote Buttons */}
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => updateVotes(index, 1, video.id)}
        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-100"
      >
        { video.haveUpvoted ?<ThumbsDown className="h-4 w-4" /> :<ThumbsUp className="h-4 w-4" />}
        <span>{Math.ceil(video.upvotes / 2)}</span>
      </Button>
    </div>
  </div>
))}

            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Currently Playing</h2>
            {currentVideo ? (
              <div className="aspect-video">
                <YouTube
                  videoId={queue?.streams[currentIndex]?.url.split("?v=")[1]}
                  opts={{  playerVars: { autoplay: 1 ,mute: 1} }}
                  onEnd={playNext}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-800 flex items-center justify-center rounded-lg">
                <p className="text-gray-400">No video playing</p>
              </div>
            )}
            <Button onClick={playNext} className="mt-4 bg-blue-600 hover:bg-blue-700" disabled={queue.length === 0}>
              Play Next
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
