"use client";
import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const PeopleCounter = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        (videoRef.current as HTMLVideoElement).srcObject = stream;
      }
    };

    const detectPeople = async () => {
      await tf.setBackend('webgl');
      const model = await cocoSsd.load();
      const video = videoRef.current as HTMLVideoElement;
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas?.getContext("2d");

      const processFrame = async () => {
        if (video && video.readyState === 4) {
          const predictions = await model.detect(video as HTMLVideoElement);
          const people = predictions.filter(p => p.class === "person");
          setCount(people.length);

          // Draw heatmap
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
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
        }
        requestAnimationFrame(processFrame);
      };
      processFrame();
    };

    setupCamera().then(detectPeople);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>People Count: {count}</h1>
      <div style={{ position: "relative", width: 640, height: 480 }}>
        <video ref={videoRef} autoPlay playsInline muted width="640" height="480" style={{ position: "absolute" }} />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: "absolute", top: 0, left: 0 }} />
      </div>
    </div>
  );
};

export default PeopleCounter;