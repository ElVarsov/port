"use client";
import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const PeopleCounter = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // const setupCamera = async () => {
    //   const stream = await navigator.mediaDevices.getUserMedia({
    //     video: { width: 640, height: 480 },
    //   });
    //   if (videoRef.current) {
    //     (videoRef.current as HTMLVideoElement).srcObject = stream;
    //   }
    // };

    const detectPeople = async () => {
      await tf.setBackend('webgl');
      const model = await cocoSsd.load();
      // const video = videoRef.current as HTMLVideoElement;
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas?.getContext("2d");

      const processFrame = async () => {
        // if (video && video.readyState === 4) {
        //   const predictions = await model.detect(video as HTMLVideoElement);
        //   const people = predictions.filter(p => p.class === "person" && p.score > 0.3); // Adjust confidence threshold
        //   setCount(people.length);

        //   // Draw heatmap
        //   ctx?.clearRect(0, 0, canvas.width, canvas.height);
        //   ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        //   people.forEach(({ bbox }) => {
        //     if (ctx) {
        //       const [x, y, width, height] = bbox;
        //       const centerX = x + width / 2;
        //       const centerY = y + height / 2;
        //       const radius = Math.max(width, height) / 2;

        //       const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        //       gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
        //       gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        //       ctx.fillStyle = gradient;
        //       ctx.fillRect(x, y, width, height);
        //     }
        //   });
        // }
        requestAnimationFrame(processFrame);
      };
      processFrame();
    };

    // setupCamera().then(detectPeople);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = async () => {
          setImageSrc(img.src);
          const model = await cocoSsd.load();
          const canvas = canvasRef.current as HTMLCanvasElement;
          const ctx = canvas?.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const predictions = await model.detect(img);
          const people = predictions.filter(p => p.class === "person" && p.score > 0.01); // Adjust confidence threshold
          setCount(people.length);
          people.forEach(({ bbox }) => {
            if (ctx) {
              const [x, y, width, height] = bbox;
              const centerX = x + width / 2;
              const centerY = y + height / 2;
              const radius = Math.max(width, height) / 2;

              const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
              gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
              gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

              ctx.fillStyle = gradient;
              ctx.fillRect(x, y, width, height);
            }
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white p-6">
      {/* Left side - Camera Feed */}
      <div className="flex-1 flex justify-center items-center">
        <div style={{ position: "relative", width: 640, height: 480 }}>
          {/* <video ref={videoRef} autoPlay playsInline muted width="640" height="480" style={{ position: "absolute" }} /> */}
          <canvas ref={canvasRef} width="640" height="480" style={{ position: "absolute", top: 0, left: 0 }} />
        </div>
      </div>

      {/* Right side - Information Panel */}
      <div className="w-1/2 bg-gray-900 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold">Camera Statistics</h2>
        <p className="text-lg mt-4">People Count: <span className="font-bold">{count}</span></p>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-4" />
        {imageSrc && <img src={imageSrc} alt="Uploaded" className="mt-4" />}
      </div>
    </div>
  );
};

export default PeopleCounter;