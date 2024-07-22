import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { channels as allChannels } from "@/db/data.json";
import { useTV } from "./provider/TVProvider";
import { tvList } from "@/db/data.json";

dayjs.extend(isBetween);

interface Program {
  name: string;
  audio: string;
  showTime: string;
  endTime: string;
}

interface Channel {
  id: string;
  name: string;
  programs: Program[];
}

const getStatus = (showTime: string, endTime: string): string => {
  const now = dayjs();

  const showStart = dayjs(showTime, "YYYY-MM-DD HH:mm");
  const showEnd = dayjs(endTime, "YYYY-MM-DD HH:mm");

  switch (true) {
    case now.isAfter(showStart) && now.isBefore(showEnd):
      return "Showing";
    case now.isBefore(showStart):
      return "Coming Up Next";
    case now.isAfter(showEnd):
      return "Finished";
  }

  return "Unknown";
};

const Table: React.FC = () => {
  const { selectedTV } = useTV();
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});

  const tv = tvList.find((tv) => tv.id === selectedTV);
  const availableChannels = tv
    ? allChannels.filter((channel) => !tv.disabledChannels.includes(channel.id))
    : allChannels;

  const updateStatuses = () => {
    const newStatuses: { [key: string]: string } = {};

    availableChannels.forEach((channel) => {
      channel.programs.forEach((program, index) => {
        const status = getStatus(program.showTime, program.endTime);
        newStatuses[`${channel.id}-${index}`] = status;
      });
    });

    setStatuses(newStatuses);
  };

  useEffect(() => {
    updateStatuses();
    const intervalId = setInterval(updateStatuses, 60000);

    return () => clearInterval(intervalId);
  }, [selectedTV]);

  return (
    <div className="max-h-[300px] overflow-y-auto w-fit mx-auto">
      <table className="relative bg-white rounded-md shadow-sm text-gray-900 table-fixed border-collapse mt-5">
        <thead className="sticky -top-1">
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-300">Channel Name</th>
            <th className="px-4 py-2 border border-gray-300">Program Name</th>
            <th className="px-4 py-2 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {availableChannels.map((channel) =>
            channel.programs.map((program, index) => {
              const status = statuses[`${channel.id}-${index}`] || "Loading...";
              return (
                <tr
                  key={`${channel.id}-${index}`}
                  className="even:bg-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border border-gray-300">
                    {channel.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {program.name}
                  </td>
                  <td
                    className={`px-4 py-2 border border-gray-300 ${
                      status === "Showing"
                        ? "text-green-500"
                        : status === "Coming Up Next"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {status}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
