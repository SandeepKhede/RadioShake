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
import StreamView from '../components/StreamView'


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


const creatorId = "258d4b3f-fd89-4dd7-aeb5-1d76c0f4f493"




export default function Dashboard() {
  return <StreamView creatorId={creatorId} />
}
