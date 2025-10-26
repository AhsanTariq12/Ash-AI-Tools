import { Metadata } from "next";
import SentimentClient from "./SentimentClient";

export const metadata: Metadata = { title: "Sentiment Analysis" };
export default function Page() {
  return <SentimentClient />;
}