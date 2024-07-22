"use client";

import Controller from "@/components/Controller";
import Playbar from "@/components/Playbar";
import Screen from "@/components/Screen";
import Table from "@/components/Table";
import React from "react";
import { channels } from "@/db/data.json";
import { TVProvider } from "@/components/provider/TVProvider";

export default function Template() {
  return (
    <TVProvider>
      <div>
        <Screen channels={channels} />
        <Playbar />
        <div className="flex">
          <Table />
          <Controller />
        </div>
      </div>
    </TVProvider>
  );
}
