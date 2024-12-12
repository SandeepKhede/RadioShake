'use client'
import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import YouTube from 'react-youtube'
import axios from 'axios'
import { Appbar } from '../components/Appbar'
import Redirect from './Redirect'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image';


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

// Add these animation variants before the component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },    
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
}

const videoPlayerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      duration: 0.5 
    }
  }
}

// Add new animation variants at the top
const inputVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

// Add these new animation variants at the top
const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const buttonHoverVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
}

// Add these type definitions at the top of your file with other interfaces
interface YouTubePlayer {
    getIframe: () => HTMLIFrameElement;
    isMuted: () => boolean;
    mute: () => void;
    unMute: () => void;
    target: HTMLIFrameElement;
}

interface YouTubeEvent {
    target: YouTubePlayer;
    data: number;
}

export default function StreamView({
    creatorId,
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    playVideo = false
    } : {
        creatorId: string,
        playVideo?: boolean
    }
) {
  const [input, setInput] = useState('')
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [queue, setQueue] = useState<StreamsResponse>({
    streams: []
  });
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)

  const [isSuperUser, setIsSuperUser] = useState<boolean>(false);
  
  const refreshStream = useCallback(async () => {
    try {
        const res = await axios.get(`/api/stream/?creatorId=${creatorId}`);
        setQueue(res.data);
        if (res.data.activeStreams?.stream?.url) {
            setCurrentVideo(res.data.activeStreams.stream.url);
        }
        setIsSuperUser(res.data.superUser);
    } catch (error) {
        console.error('Error refreshing stream:', error);
    }
  }, [creatorId]);

  



  useEffect(() => {
    refreshStream()
    // setCurrentVideo("true")
    const interval = setInterval(() => {
      refreshStream()
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval);
  },[refreshStream])

  

  const sortedQ = queue.streams.sort((a,b) => a.upvotes < b.upvotes ? 1 : -1);
  
  

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
    
    if (previewId) {
      const loadingToast = toast.loading('Adding video to queue...')
      try {
        const data = { creatorId, url: input }
        await axios.post('/api/stream/', data);
        toast.success('Video added to queue!', { id: loadingToast })
        setInput('')
        setPreviewId(null)
      } catch (error) {
        toast.error('Failed to add video', { id: loadingToast })
        console.error(error)
      }
    }
  }

  const updateVotes = async (index: number, increment: number, id: string) => {
    try {
      const newQueue = [...queue.streams];
      const haveUpvoted = newQueue[index].haveUpvoted;
      
      // Optimistically update UI
      newQueue[index].upvotes += haveUpvoted ? -1 : 1;
      newQueue[index].haveUpvoted = !haveUpvoted;
      newQueue.sort((a, b) => b.upvotes - a.upvotes);
      setQueue({ streams: newQueue });

      const data = { streamId: id };
      await axios.post(`/api/stream/${haveUpvoted ? 'downvote' : 'upvote'}`, data);
      toast.success(haveUpvoted ? 'Vote removed' : 'Vote added')
    } catch (error) {
      toast.error('Failed to update vote')
      // Rollback state
      console.log(error,"error");
      
      const newQueue = [...queue.streams];
      newQueue[index].upvotes -= increment;
      newQueue[index].haveUpvoted = !newQueue[index].haveUpvoted;
      setQueue({ streams: newQueue });
    }
  }

  

  const playNext = async () => {
    const loadingToast = toast.loading('Loading next video...')
    try {
      const res = await axios.get(`/api/stream/next`);
      setCurrentVideo(res.data.stream.url);
      toast.success('Playing next video', { id: loadingToast })
    } catch (error) {
      console.log(error,"error");
      
      toast.error('Failed to play next video', { id: loadingToast })
    }
  }

  console.log(currentVideo,"current video");
  

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/creator/${creatorId}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success('Link copied to clipboard!')
      })
      .catch(() => {
        toast.error('Failed to copy link')
      });
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    >
      <Toaster 
        position="top-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(16, 185, 129, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Redirect />
      <div className="container mx-auto p-4 flex-grow ">
        <Appbar onShare={handleShare} />
        <motion.h1 
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold mb-6 text-center text-white bg-clip-text text-transparent"
        >
          ✨ Radio Shake Live ✨
        </motion.h1>

        {/* Form section - moved outside grid */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="flex gap-2 mb-6 w-full max-w-2xl mx-auto"
        >
          <motion.div 
            variants={inputVariants}
            initial="initial"
            animate="animate"
            className="flex-grow"
          >
            <Input
              type="text" 
              value={input}
              onChange={handleInputChange}
              placeholder="🎵 Paste YouTube URL to add to the party..."
              className="w-full bg-gray-800/50 text-gray-100 border-gray-700/50 backdrop-blur-sm"
            />
          </motion.div>
          <motion.div
            variants={buttonHoverVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button 
              type="submit" 
              disabled={!previewId} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700
              text-white font-semibold px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] 
              hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 "
              >
                <span>Drop the Beat</span>
              </motion.span>
            </Button>
          </motion.div>
        </motion.form>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="w-full">
            <motion.h2 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-2xl text-white font-semibold mb-4"
            >
              🎧 Coming Up Next
            </motion.h2>
            
            {/* Scrollable queue container */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-h-[calc(99.25vw/2)] lg:max-h-[calc(99.25vw/4)] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            >
              <AnimatePresence>
                {sortedQ.map((video, index) => (
                  <motion.div 
                    key={video.id}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm 
              rounded-lg transition-all duration-300 border border-gray-700/50
              hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10
              hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  >
                    {/* Thumbnail Container */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative w-1/4 aspect-video overflow-hidden rounded-md"
                    >
                      <Image
                        src={video.smallImg}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </motion.div>

                    {/* Video Details */}
                    <div className="flex-grow space-y-1">
                      <p className="font-medium text-gray-100 line-clamp-1">{video.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Votes: {video.upvotes}</span>
                      </div>
                    </div>

                    {/* Vote Button */}
                    <motion.div 
                      variants={buttonHoverVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateVotes(index, 1, video.id)}
                        className={`
                          flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-sm
                          transition-all duration-200 border border-gray-700/50
                          ${video.haveUpvoted 
                            ? 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-400' 
                            : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400'}
                        `}
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-lg"
                        >
                          {video.haveUpvoted ? '👎' : '👍'}
                        </motion.span>
                        <span className="font-medium">{Math.ceil(video.upvotes / 2)}</span>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Right Column - Currently Playing */}
          <div className="w-full">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-2xl font-semibold text-white mb-4"
            >
              🔴 Now Playing
            </motion.h2>
            
            <motion.div
              variants={videoPlayerVariants}
              initial="hidden"
              animate="visible"
              className="w-full aspect-video rounded-lg overflow-hidden shadow-xl"
            >
              {currentVideo ? (
                <div className="w-full aspect-video">
                  <YouTube
                    videoId={currentVideo.split("?v=")[1]}
                    opts={{ 
                      width: '100%', 
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0,
                        controls: isSuperUser ? 1 : 0,
                        disablekb: !isSuperUser,
                        fs: isSuperUser,
                        iv_load_policy: 3,
                        playsinline: 1,
                      }
                    }}
                    onEnd={playNext}
                    onReady={(event: YouTubeEvent) => {
                      const player = event.target;
                      
                      if (!isSuperUser) {
                        const volumeControl = document.createElement('div');
                        volumeControl.className = 
                          'absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 p-2 rounded-full';
                        
                        const muteButton = document.createElement('button');
                        muteButton.className = 
                          'text-white hover:text-gray-300 transition-colors duration-200';
                        muteButton.innerHTML = '🔊';
                        muteButton.onclick = () => {
                          if (player.isMuted()) {
                            player.unMute();
                            muteButton.innerHTML = '🔊';
                          } else {
                            player.mute();
                            muteButton.innerHTML = '🔈';
                          }
                        };
                        
                        volumeControl.appendChild(muteButton);
                        player.getIframe().parentNode?.appendChild(volumeControl);
                      }
                    }}
                    className="w-full h-full relative"
                  />
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg"
                >
                  <p className="text-gray-400">
                    Queue is empty. Drop your favorite track! 🎵
                  </p>
                </motion.div>
              )}
            </motion.div>

            {isSuperUser && (
              <motion.div
                variants={buttonHoverVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="mt-4"
              >
                <Button 
                  onClick={playNext} 
                  disabled={queue.streams.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 
                  hover:from-purple-700 hover:to-pink-700 text-white font-semibold 
                  px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] 
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-200
                  border border-gray-700/50 disabled:opacity-50"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Play Next Track</span>
                    <span className="text-xl">🎵</span>
                  </motion.span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
