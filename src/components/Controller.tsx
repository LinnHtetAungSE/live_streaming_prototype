import PauseIcon from "@/common/svg/PauseIcon";
import PlayIcon from "@/common/svg/PlayIcon";
import StopIcon from "@/common/svg/StopIcon";
import React, { useEffect, useRef, useState } from "react";
import { tvList, channels } from "@/db/data.json";
import { useTV } from "./provider/TVProvider";

const Controller = () => {
  const { selectedTV } = useTV();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackState, setPlaybackState] = useState<
    "playing" | "paused" | "stopped"
  >("stopped");

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaybackState("playing");
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState("paused");
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackState("stopped");
    }
  };

  useEffect(() => {
    const currentTV = tvList.find((tv: any) => tv.id === selectedTV);
    if (currentTV) {
      setPlaybackState(currentTV.status as "playing" | "paused" | "stopped");
      const currentChannel = channels.find(
        (channel: any) => channel.id === currentTV.watchingOn
      );

      if (currentChannel && audioRef.current) {
        const now = new Date();

        const program = currentChannel.programs.find((p: any) => {
          const startTime = new Date(p.showTime);
          const endTime = new Date(p.endTime);
          return now >= startTime && now <= endTime;
        });
        if (!program) {
          setPlaybackState("stopped");
        }

        audioRef.current.src = `music/${program?.audio!}`;
        audioRef.current.load();
      }
      if (playbackState === "playing") {
        handlePlay();
      }
    }
  }, [selectedTV]);

  return (
    <div className="relative w-[40%] h-full">
      <audio ref={audioRef} hidden>
        Your browser does not support the audio element.
      </audio>
      <button
        type="button"
        disabled={playbackState === "playing"}
        className={`absolute top-5 left-0 rounded-full p-2 cursor-pointer ${
          playbackState === "playing" ? "bg-green-400" : "bg-gray-400"
        }`}
        onClick={handlePlay}
      >
        <PlayIcon width={50} height={50} />
      </button>
      <button
        type="button"
        disabled={playbackState === "paused"}
        className={`absolute top-10 left-32 rounded-full p-2 cursor-pointer ${
          playbackState === "paused" ? "bg-yellow-400" : "bg-gray-400"
        }`}
        onClick={handlePause}
      >
        <PauseIcon width={50} height={50} />
      </button>
      <button
        type="button"
        disabled={playbackState === "stopped"}
        className={`absolute top-32 left-0 rounded-full p-2 cursor-pointer ${
          playbackState === "stopped" ? "bg-red-400" : "bg-gray-400"
        }`}
        onClick={handleStop}
      >
        <StopIcon width={50} height={50} />
      </button>
    </div>
  );
};

export default Controller;
