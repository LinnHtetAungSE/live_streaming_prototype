"use client";

import React, { useEffect, useState } from "react";
import { useTV } from "./provider/TVProvider";
import { tvList, channels } from "@/db/data.json";

const Playbar = () => {
  const { selectedTV } = useTV();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const currentTV = tvList.find((tv: any) => tv.id === selectedTV);

    if (currentTV) {
      const currentChannel = channels.find(
        (ch: any) => ch.id === currentTV.watchingOn
      );

      if (currentChannel) {
        const now = new Date();

        const program = currentChannel.programs.find((p: any) => {
          const startTime = new Date(p.showTime);
          const endTime = new Date(p.endTime);
          return now >= startTime && now <= endTime;
        });

        if (program) {
          const updateProgress = () => {
            const now = new Date().getTime();
            const startTime = new Date(program.showTime).getTime();
            const endTime = new Date(program.endTime).getTime();
            const currentTime = Math.max(0, (now - startTime) / 1000);
            const duration = Math.max(0, (endTime - startTime) / 1000);

            setCurrentTime(currentTime);
            setDuration(duration);
            setProgress((currentTime / duration) * 100);
          };

          updateProgress();

          const intervalId = setInterval(() => {
            updateProgress();
          }, 1000);

          return () => clearInterval(intervalId);
        }
      }
    }
  }, [selectedTV]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="playbar-container text-gray-900 my-5">
      <div className="playbar gap-5">
        <div>{formatTime(currentTime)}</div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div>{formatTime(duration)}</div>
      </div>
    </div>
  );
};

export default Playbar;
