import { Metadata } from "next";
import SummarizerClient from "./SummarizerClient";

export const metadata: Metadata = { title: "Text Summarizer" };
export default function Page() {
  return <SummarizerClient />;
}