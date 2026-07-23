"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import axios from "axios";

const CustomWordCloud = dynamic(() => import("./_components/CustomWordCloud"), {
  ssr: false,
});

function HotTopicsCard() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await axios.get("/api/topics");
        const data = res.data;

        const formattedTopics = data.map((topic) => ({
          text: topic.topic,
          value: topic.count,
        }));

        setTopics(formattedTopics);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    }

    fetchTopics();
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>Click on a topic to start a quiz on it.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWordCloud formattedTopics={topics} />
      </CardContent>
    </Card>
  );
}

export default HotTopicsCard;
