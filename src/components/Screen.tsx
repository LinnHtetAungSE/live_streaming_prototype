import React, { useState, useEffect } from "react";
import { useTV } from "./provider/TVProvider";
import { tvList } from "@/db/data.json";

export default function Screen({ channels }: { channels: any[] }) {
  const { selectedTV, setSelectedTV, handleUpdateTvById } = useTV();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [currentProgram, setCurrentProgram] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentProgram = () => {
      const now = new Date();

      const channel = channels.find((ch) => ch.id === selectedChannel);
      if (channel) {
        const program = channel.programs.find((p: any) => {
          const startTime = new Date(p.showTime);
          const endTime = new Date(p.endTime);
          return now >= startTime && now <= endTime;
        });
        setCurrentProgram(
          program ? program.name : "No program currently showing"
        );
      }
    };

    getCurrentProgram();
    const intervalId = setInterval(getCurrentProgram, 60000);

    return () => clearInterval(intervalId);
  }, [selectedChannel, channels]);

  const handleTVSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTV(e.target.value);
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChannelId = e.target.value;
    setSelectedChannel(newChannelId);

    const channel = channels.find((ch) => ch.id === newChannelId);
    if (channel) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const program = channel.programs.find(
        (prog: any) =>
          prog.showTime <= currentTime &&
          (prog.endTime === "00:00" || prog.endTime > currentTime)
      );
      setCurrentProgram(
        program ? program.name : "No program currently showing"
      );
    }
  };

  const tv = tvList.find((tv) => tv.id === selectedTV);
  const availableChannels = tv
    ? channels.filter((channel) => !tv.disabledChannels.includes(channel.id))
    : channels;

  useEffect(() => {
    setSelectedTV(tvList[0].id);
  }, []);

  useEffect(() => {
    const tv = tvList.find((tv) => tv.id === selectedTV);

    if (tv) {
      const channel = channels.find((ch) => ch.id === tv.watchingOn);
      if (channel) {
        setSelectedChannel(channel.id);
      }
    }
  }, [selectedTV]);

  useEffect(() => {
    if (selectedTV && selectedChannel) {
      handleUpdateTvById(selectedTV, selectedChannel);
    }
  }, [selectedTV]);

  return (
    <div className="w-[40%] bg-white text-black p-5 mx-auto gap-4 rounded-md mb-5">
      <form className="flex justify-between">
        <select
          className="border rounded-sm"
          value={selectedTV}
          onChange={handleTVSelectChange}
        >
          {tvList.map((tv) => (
            <option key={tv.id} value={tv.id}>
              {tv.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded-sm"
          value={selectedChannel}
          onChange={handleChannelChange}
        >
          {availableChannels.map((channel) => (
            <option key={channel.id} value={channel.id}>
              {channel.name}
            </option>
          ))}
        </select>
      </form>
      <p className="text-center my-5">Currently Showing: {currentProgram}</p>
    </div>
  );
}
