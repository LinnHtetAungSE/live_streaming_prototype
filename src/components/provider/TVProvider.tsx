import React, { createContext, useContext, useState, ReactNode } from "react";
import { tvList as tvData } from "@/db/data.json";

interface TVContextProps {
  selectedTV: string;
  setSelectedTV: (tvId: string) => void;
  handleUpdateTvById: (id: string, newWatchingOn: string) => void;
}

const TVContext = createContext<TVContextProps | undefined>(undefined);

export const useTV = () => {
  const context = useContext(TVContext);
  if (!context) {
    throw new Error("useTV must be used within a TVProvider");
  }
  return context;
};

export const TVProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTV, setSelectedTV] = useState<string>("");
  const [tvList, setTvList] = useState<any[]>(tvData);

  const handleUpdateTvById = (id: string, newWatchingOn: string) => {
    setTvList((prevTvList) =>
      prevTvList.map((tv) =>
        tv.id === id ? { ...tv, watchingOn: newWatchingOn } : tv
      )
    );
  };

  return (
    <TVContext.Provider
      value={{ selectedTV, setSelectedTV, handleUpdateTvById }}
    >
      {children}
    </TVContext.Provider>
  );
};
