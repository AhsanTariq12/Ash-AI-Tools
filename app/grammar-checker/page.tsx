import { Metadata } from "next";
import GrammarClient from "./GrammarClient";

export const metadata: Metadata = { title: "Grammar Checker" };
export default function Page() {
  return <GrammarClient />;
}