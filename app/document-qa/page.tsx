import { Metadata } from "next";
import DocumentQAClient from "./DocumentQAClient";

export const metadata: Metadata = { title: "Document Q&A" };
export default function Page() {
  return <DocumentQAClient />;
}