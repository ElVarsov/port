'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Dashboard() {
  const [peopleCount, setPeopleCount] = useState(0);
  const [queueTime, setQueueTime] = useState('0 min'); // Initialize as string
  const [imageSrc, setImageSrc] = useState('/placeholder.jpg'); // Replace with your CCTV feed

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating live image update (replace with real image URL)
      setImageSrc(`/api/live-image?timestamp=${Date.now()}`);

      // Simulated data fetching (replace with real API calls)
      setPeopleCount(Math.floor(Math.random() * 20));
      setQueueTime(Math.floor(Math.random() * 15) + ' min'); // Ensure this is a string
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white p-6">
      {/* Left side - Live Image */}
      <div className="flex-1 flex justify-center items-center">
        <Image
          src={imageSrc}
          alt="Live Feed"
          width={500}
          height={500}
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Right side - Information Panel */}
      <div className="w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold">Queue Monitoring</h2>
        <p className="text-lg mt-4">People Count: <span className="font-bold">{peopleCount}</span></p>
        <p className="text-lg">Estimated Wait Time: <span className="font-bold">{queueTime}</span></p>
      </div>
    </div>
  );
}
